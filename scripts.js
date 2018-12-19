

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
    var inputDate = new Date(document.getElementById("week-commencing-date").value);
    if(inputDate.getDay() === 0){ //only update if a Sunday
        var x;
        for(x in dateFields){
            dateFields[x].innerHTML = inputDate.getDate() + "/" + (inputDate.getMonth() + 1);
            inputDate.setDate(inputDate.getDate() + 1);
        }
    }
}

function setupDatePicker() { //sets date picker to the date of the previous Sunday to ensure 7-day step works correctly
    var datePicker = document.getElementById("week-commencing-date");
    var dateToSet = new Date();
    var daysSinceLastSunday = dateToSet.getDay();
    if(daysSinceLastSunday === 0) daysSinceLastSunday = 7; //if today is Sunday, set to last Sunday
    dateToSet.setDate(dateToSet.getDate() - daysSinceLastSunday);
    var formattedDate = dateToSet.getFullYear() + "-" + (dateToSet.getMonth() + 1) + "-" + dateToSet.getDate();
    datePicker.defaultValue = formattedDate; //set date picker
    datePicker.step = "7"; //only allow Sundays to be selected in the date picker
    updateDates();
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