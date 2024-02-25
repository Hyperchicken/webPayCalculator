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
    let field1 = $(".fortnight-value")[0];
    let field2 = $(".fortnight-value")[1];
    let field3 = $(".fortnight-value")[2];
    let ytd1 = parseFloat(field1.value);
    let ytd2 = parseFloat(field2.value);
    let ytd3 = parseFloat(field3.value);
    if(isNaN(ytd1)) ytd1 = 0;
    if(isNaN(ytd2)) ytd2 = 0;
    if(isNaN(ytd3)) ytd3 = 0;
    setSaveData("ytd0", field1.value);
    setSaveData("ytd1", field2.value);
    setSaveData("ytd2", field3.value);

    let resultArea = document.getElementById("result-area");
    resultArea.innerHTML = ""; //clear existing results
    if(!field1.checkValidity() || !field2.checkValidity() || !field3.checkValidity()) {
        resultArea.innerHTML = "<p>Invalid data in at least one field.</p>";
    }
    else {
        let firstIncreaseTotal = (ytd2 - ytd1) * 0.025;
        let secondIncreaseTotal = (ytd3 - ytd2) * 0.05;
    
        let combinedTotal = parseFloat(firstIncreaseTotal.toFixed(2)) + parseFloat(secondIncreaseTotal.toFixed(2));
        
        let firstIncreaseTotalElement = document.createElement("p");
        let secondIncreaseTotalElement = document.createElement("p");
        let combinedTotalElement = document.createElement("p");
        
        firstIncreaseTotalElement.textContent = "First increase (+1%) backpay: $" + firstIncreaseTotal.toFixed(2);
        secondIncreaseTotalElement.textContent = "Second increase (+2.5%) backpay: $" + secondIncreaseTotal.toFixed(2);
        combinedTotalElement.textContent = "Total backpay (Gross): $" + combinedTotal.toFixed(2);
    
        resultArea.appendChild(firstIncreaseTotalElement);
        resultArea.appendChild(secondIncreaseTotalElement);
        resultArea.appendChild(combinedTotalElement);

        if(ytd2 < ytd1 || ytd3 < ytd2) {
            let e = document.createElement("em");
            e.textContent = "YTD gross values must be greater than or equal to the value above it.";
            resultArea.appendChild(e);
        }
    }
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
    for(let field = 0; field < 3; field++) {
        let saveData = getSaveData("ytd" + field);
        if(saveData) $(".fortnight-value")[field].value = saveData;
        else $(".fortnight-value")[field].value = "";
    }
}