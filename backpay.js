$(document).ready(function() { 
    loadSavedData();
    calculateBackpay();

    let closeMenu = () => {
        $(".dropdown-content").removeClass("show-dropdown")
        $(".dropbtn").removeClass("active");
    }
    $("#menuButton").on("click", function(){
        $(".dropdown-content").toggleClass("show-dropdown");
        if($(".dropdown-content").is(":hidden")) {
            $(".dropbtn").removeClass("active");
        }
        else {
            $(".dropbtn").addClass("active");
        }
    });
    $("#paycalcMenuButton").on("click", function(){
        location.replace("index.php");
    });
    
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn') && !event.target.matches('.dropbtn-icon')) {
            closeMenu();
        }
    } 
});

function calculateBackpay() {
    let firstIncreaseTotals = [];
    let secondIncreaseTotals = [];
    for(let i = 0; i < 13; i++) {
        let currentValue = parseFloat($(".fortnight-value")[i].value);
        setSaveData("field" + i, $(".fortnight-value")[i].value);
        if(isNaN(currentValue)) {
            currentValue = 0;
        }
        firstIncreaseTotals.push(currentValue);
    }
    for(let i = 13; i < 24; i++) {
        let currentValue = parseFloat($(".fortnight-value")[i].value);
        setSaveData("field" + i, $(".fortnight-value")[i].value);
        if(isNaN(currentValue)) {
            currentValue = 0;
        }
        secondIncreaseTotals.push(currentValue);
    }
    let firstIncreaseTotal = 0.0;
    let secondIncreaseTotal = 0.0;
    for(let i = 0; i < firstIncreaseTotals.length; i++) {
        firstIncreaseTotal += firstIncreaseTotals[i] * 0.01;
    }
    for(let i = 0; i < secondIncreaseTotals.length; i++) {
        secondIncreaseTotal += secondIncreaseTotals[i] * 0.035;
    }

    let combinedTotal = parseFloat(firstIncreaseTotal.toFixed(2)) + parseFloat(secondIncreaseTotal.toFixed(2));
    
    let resultArea = document.getElementById("result-area");
    let firstIncreaseTotalElement = document.createElement("p");
    let secondIncreaseTotalElement = document.createElement("p");
    let combinedTotalElement = document.createElement("p");
    
    firstIncreaseTotalElement.textContent = "First increase (1%) backpay: $" + firstIncreaseTotal.toFixed(2);
    secondIncreaseTotalElement.textContent = "Second increase (2.5%) backpay: $" + secondIncreaseTotal.toFixed(2);
    combinedTotalElement.textContent = "Total backpay: $" + combinedTotal.toFixed(2);

    resultArea.innerHTML = ""; //clear existing results
    resultArea.appendChild(firstIncreaseTotalElement);
    resultArea.appendChild(secondIncreaseTotalElement);
    resultArea.appendChild(combinedTotalElement);
}

//Data storage
/**
 * Test the brower for storage availablilty of a specified type
 * @param {string} type storage type
 * @returns {boolean} storage available true/false
 */
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function setSaveData(key, value) {
    if(!storageAvailable('localStorage')) {
        console.alert("setSaveData: no local storage available!");
    }
    else {
        try {
            localStorage.setItem(key, value);
        }
        catch(ex) {
            console.warn("setSaveData(): unable to save data. exception thrown:");
            console.warn(ex.message)
        }
    }
}

function getSaveData(key) {
    return localStorage.getItem(key);
}

function loadSavedData() {
    for(let field = 0; field < 24; field++) {
        let saveData = getSaveData("field" + field);
        if(saveData) $(".fortnight-value")[field].value = saveData;
        else $(".fortnight-value")[field].value = "";
    }
}