"use strict";

class Shift {
    constructor(signOn, signOff) {
        this.startHour = parseInt(signOn.substring(0,2));
        this.startMinute = parseInt(signOn.substring(2,4));
        this.endHour = parseInt(signOff.substring(0,2));
        this.endMinute = parseInt(signOff.substring(2,4));
    }

    get hoursString(){
        return this.calcHoursString();
    }

    calcHoursString() {
        var timeWorked = 0;
        var hours = this.endHour - this.startHour;
        var minutes = this.endMinute - this.startMinute;
        if(hours < 0) hours += 24;
        if(minutes < 0) minutes += 60;
        return hours + "h" + minutes + "m";
    }
}

function inputChanged() {
    updateResults();
    updateHoursPerShift();
}

function updateHoursPerShift() {
    var times = document.querySelectorAll(".time");
    var hoursField = document.querySelectorAll(".shift-hours");
    var shifts = [];
    for(var i = 0; i < times.length; i += 2) {
        if(times[i].textLength == 4 && times[i+1].textLength == 4 && times[i].checkValidity() && times[i+1].checkValidity()){
            var shift = new Shift(times[i].value, times[i+1].value);
            console.log("Hours for i=" + i + ": " + shift.hoursString);
            //console.log("Start hr: " + shift.startHour + " Start min: " + shift.startMinute + " End hr: " + shift.endHour + " End min: " + shift.endMinute);
            shifts.push(shift); //TEMP: this will only work with shifts in sequence
        }
    }
    for(var i = 0; i < shifts.length; i++) {
        hoursField[i].innerHTML = shifts[i].hoursString;
    }
}

function updateResults() {
    var resultArea = document.getElementById("result-area");
    var testResult = addAllFields();

    resultArea.innerHTML = "<p> Adding all the time fields gets you: " + testResult + "</p>";
}

function updateDates() {
    var dateFields = document.querySelectorAll(".date-field");
    var inputDate = new Date(document.getElementById("week-commencing-date").value);
    if(isNaN(inputDate.valueOf())){ //if date invalid, blank the dates
        for(var i = 0; i < dateFields.length; i++){
            dateFields[i].innerHTML = "";
        }
    }
    else { //date valid, print dates
        if(inputDate.getDay() === 0){ //only update if a Sunday
            for(var i = 0; i < dateFields.length; i++){
                dateFields[i].innerHTML = inputDate.getDate() + "/" + (inputDate.getMonth() + 1);
                inputDate.setDate(inputDate.getDate() + 1);
            }
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