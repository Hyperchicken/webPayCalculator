//window.onload(alert("test"));

function inputChanged() {
    updateResults();
}

function updateResults() {
    var resultArea = document.getElementById("result-area");
    var testResult = addAllFields();

    resultArea.innerHTML = "<p> Adding all the time fields gets you: " + testResult + "</p>";
}

function updateDates() {
    var dateFields = document.querySelectorAll(".date-field");
    
}


function addAllFields() {
    var times = document.querySelectorAll("input.time");
    var total = 0;

    var x;
    for (x in times) {
        var value = parseInt(times[x].value)
        if(!isNaN(value)) total += value;
    }
    return total;
}