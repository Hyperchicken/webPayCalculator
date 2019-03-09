"use strict";

//rates
const rateDates =           ["2018-01-01", "2018-07-01", "2019-01-01"];
const spotRates =           [49.4054,      50.6405,      51.9065];
const driverLevel1Rates =   [33.5339,      34.3723,      35.2316];
const traineeRates =        [28.7277,      29.4459,      30.1820];
const conversionRates =     [46.1015,      47.2541,      48.4354];


//define Classes
class Shift {
    constructor(signOn, signOff, shiftType, ojt, wastedMeal) {
        const shiftTypes = ["ord", "ddowork", "ddo", "phwork", "phgaz", "off"];
        if(signOn && signOff) {
            this.startHour = parseInt(signOn.substring(0,2));
            this.startMinute = parseInt(signOn.substring(2,4));
            this.endHour = parseInt(signOff.substring(0,2));
            this.endMinute = parseInt(signOff.substring(2,4));
        }
        else {
            this.startHour = 0;
            this.startMinute = 0;
            this.endHour = 0;
            this.endMinute = 0;
        }
        if(shiftTypes.includes(shiftType)) this.type = shiftType;
            else this.type = 0;
        if(typeof ojt == "boolean") this.ojt = ojt;
            else this.ojt = false;
        if(typeof wastedMeal == "boolean") this.wastedMeal = wastedMeal;
            else this.wastedMeal = false;
    }

    get hoursString() {return this.calcHoursString();}

    get hoursDecimal() {
        let hoursFloat = 0.0;
        let hours = this.endHour - this.startHour;
        let minutes = this.endMinute - this.startMinute;
        if(hours < 0 || (hours == 0 && minutes < 0)) hours += 24;
        if(minutes < 0) {
            minutes += 60;
            hours--;
        }
        hoursFloat = hours + (minutes/60);
        return hoursFloat;
    }

    get isOjt() {return this.ojt;}
    
    get isWastedMeal() {return this.wastedMeal;}

    get shiftOptions() {
        let returnText = "";
        switch(this.type) {
            case "ord": returnText += "Normal"; break;
            case "ddo": returnText += "DDO"; break; //UNFINISHED
            default: returnText += "OFF"; break;
        }
        if(this.ojt) returnText += " OJT";
        if(this.wastedMeal) returnText += "WM";
        return returnText;
    }

    calcHoursString() {
        let hours = this.endHour - this.startHour;
        let minutes = this.endMinute - this.startMinute;
        if(hours < 0 || (hours == 0 && minutes < 0)) hours += 24;
        if(minutes < 0) {
            minutes += 60;
            hours--;
        }
        if(hours || minutes) return hours + ":" + minutes.toString().padStart(2, "0");
        else return "";
    }
}


//initialise variables
let shifts = [];
for (let i = 0; i < 14; i++) shifts.push(new Shift()); //init shifts array with 0 length shifts
let timeField = function() {return document.querySelectorAll(".time")}; //alias for time input boxes
let grade = null;  //declare paygrade
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

$(document).ready(function(){ //init jquery datepicker
    $("#week-commencing-date").datepicker({
        dateFormat: "d/m/yy",
        beforeShowDay: function(date){
            var day = date.getDay();
		    return [ ( day == 0), "" ];
        }
    });
    $(document).ready(function(){updateGrade()}); //init paygrade
});


function timeChanged(field) {
    /*if(timeField()[field].textLength == 4) {
        updateHoursPerShift();
        printShiftHours();
    }
    else {
        shifts[fieldToShift(field)] = new Shift();
        printShiftHours();
    }*/
    updateHoursPerShift();
    printShiftHours();
    //printShiftOptions();
}

function updateHoursPerShift() {
    let times = timeField();
    shifts = [];
    for(let i = 0; i < times.length; i += 2) {
        if(times[i].textLength == 4 && times[i+1].textLength == 4 && times[i].checkValidity() && times[i+1].checkValidity()){
            shifts.push(new Shift(times[i].value, times[i+1].value, "ord"));
        }
        else {
            shifts.push(new Shift());
        }
    }
}

function updateResults() {
    let resultArea = document.getElementById("result-area");
    let testResult = addAllFields();

    resultArea.innerHTML = "<p> Adding all the time fields gets you: " + testResult + "</p>";
}

function updateDates() { //for input type: date
    let dayOfWeekFields = document.querySelectorAll(".day-of-week");
    let inputDate = $("#week-commencing-date").datepicker("getDate");
    if(isNaN(inputDate.valueOf())){ //if date invalid, blank the dates
        for(let i = 0; i < dayOfWeekFields.length; i++){
            dateFields[i].innerHTML = daysOfWeek[i%7];
        }
    }
    else { //date valid, print dates
        if(inputDate.getDay() === 0){ //only update if a Sunday
            for(let i = 0; i < dayOfWeekFields.length; i++){
                dayOfWeekFields[i].innerHTML = daysOfWeek[i%7] + " - " + inputDate.getDate() + "/" + (inputDate.getMonth() + 1);
                inputDate.setDate(inputDate.getDate() + 1);
            }
        }
    }
}

function shiftOptions(day) {
    if (parseInt(day) == NaN) {
        console.error("shiftOptions() error: parameter NaN");
        return;
    }
    
}

//NON-JQUERY DATEPICKER SETUP. NOT CURRENTLY USED
function initDatePicker() { //sets date picker to the date of the previous Sunday to ensure 7-day step works correctly
    let datePicker = document.getElementById("week-commencing-date");
    let dateToSet = new Date();
    let daysSinceLastSunday = dateToSet.getDay();
    if(daysSinceLastSunday === 0) daysSinceLastSunday = 7; //if today is Sunday, set to last Sunday 
    dateToSet.setDate(dateToSet.getDate() - daysSinceLastSunday);
    var formattedDate = dateToSet.getFullYear() + "-" + (dateToSet.getMonth() + 1) + "-" + dateToSet.getDate();
    datePicker.defaultValue = formattedDate; //set date picker
    datePicker.step = "7"; //only allow Sundays to be selected in the date picker
    updateDates();
}

function addAllFields() { //function to test time input boxes
    let times = document.querySelectorAll("input.time");
    let total = 0;

    let x;
    for (x in times) {
        let value = parseInt(times[x].value)
        if(!isNaN(value)) total += value;
    }
    return total;
}

function fieldToShift(field) {
    switch(field) {
        case 0: case 1: return 0;
        case 2: case 3: return 1;
        case 4: case 5: return 2;
        case 6: case 7: return 3;
        case 8: case 9: return 4;
        case 10: case 11: return 5;
        case 12: case 13: return 6;
        case 14: case 15: return 7;
        case 16: case 17: return 8;
        case 18: case 19: return 9;
        case 20: case 21: return 10;
        case 22: case 23: return 11;
        case 24: case 25: return 12;
        case 26: case 27: return 13;
        default: return NaN;
    }
}

function printShiftHours() {
    let hoursField = document.querySelectorAll(".shift-hours");
    for(let i = 0; i < shifts.length; i++) {
        hoursField[i].innerHTML = shifts[i].hoursString;
    }
}

function printShiftOptions() {
    let optionsField = $(".shift-options"); 
    for(let i = 0; i < shifts.length; i++) {
        optionsField[i].innerHTML = shifts[i].shiftOptions;
    }
}

function getRate(date, rates) {
    let wcDate = Date.parse(date);
    for(let i = rates.length - 1; i >= 0; i--) {
        if(wcDate >= Date.parse(rateDates[i])){
            return rates[i];
        }
    }
    console.error("getRate() Error: Invalid date or no matching payrate");
    return 0;
}

function getEbaRate() { //get rate from selected date and pay grade
    let wcDate = $("#week-commencing-date")[0].value;
    switch(grade) {
        case "spot": return getRate(wcDate, spotRates);
        case "level1": return getRate(wcDate, driverLevel1Rates);
        case "trainee": return getRate(wcDate, traineeRates);
        default: console.error("getEbaRate() Error: invalid grade"); return 0;
    }
}

function updateGrade() {
    grade = document.forms["pay-grade-form"]["pay-grade"].value;
}