"use strict";

//rates
const rateDates =           ["2018-01-01", "2018-07-01", "2019-01-01"];
const spotRates =           [49.4054,      50.6405,      51.9065];
const driverLevel1Rates =   [33.5339,      34.3723,      35.2316];
const traineeRates =        [28.7277,      29.4459,      30.1820];
const conversionRates =     [46.1015,      47.2541,      48.4354];

//colours
const ojtColour = "#ff7300";
const phColour = "#c8ff00";
const wmColour = "#bd4bff";
const sickColour = "#ff0000";

const payTypes = ["normal", "guarantee", "edo", "wePen50", "wePen100", "ot150", "ot200", "rost50", "earlyShift", "afternoonShift", "nightShift", "metroSig2"];


//define Classes
class Shift {
    constructor(signOn, signOff) {
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
        this.ojt = false; //OJT shift
        this.ph = false; //public holiday
        this.wm = false; //wasted meal
        this.sick = false //sick day
    }

    get hoursString() {
        return this.calcHoursString();
    }

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

    setNilHours() {
        this.startHour = 0;
        this.endHour = 0;
        this.startMinute = 0;
        this.endMinute = 0;
    }

    setShiftTimes(signOn, signOff) {
        if(signOn && signOff) {
            this.startHour = parseInt(signOn.substring(0,2));
            this.startMinute = parseInt(signOn.substring(2,4));
            this.endHour = parseInt(signOff.substring(0,2));
            this.endMinute = parseInt(signOff.substring(2,4));
        }
        else console.error("setShiftTimes(): insufficient parameters");
    }
}

class PayElement { 
    constructor(payType, hours) {
        if(!payTypes.includes(payType)) {
            this.payType = null;
            this.hours = null;
            console.error("Error creating PayElement! PayType paramater invalid: \"" + payType + "\"\nValid values:  " + payTypes.toString());
        } 
        else {
            this.payType = payType;
            this.hours = hours;
        }
    }
    
    get sortIndex() {
        return payTypes.indexOf(this.payType);
    }

    get payAmount() {
        return this.rate * this.hours;
    }

    get rate() {
        let selectedDate = $("#week-commencing-date").datepicker("getDate");
        let rate = 0
        switch(this.payType) {
            case "normal": case "guarantee": case "edo": case "wePen100":
                rate = getEbaRate(selectedDate, selectedGradeRates);
                break;
            case "wePen50":
                rate = getEbaRate(selectedDate, selectedGradeRates);
                rate /= 2;
                break;
            case "ot150": case "rost50":
                rate = getEbaRate(selectedDate, selectedGradeRates);
                rate *= 1.5;
                break;
            case "ot200":
                rate = getEbaRate(selectedDate, selectedGradeRates);
                rate *= 2;
                break;
            default:
                console.error("PayElement.rate: unable to get rate for payType \"" + this.payType + "\"");
                return null;
        }
        return parseFloat(rate.toFixed(4));
    }
}


//initialise variables
let shifts = [];
let shiftPay = [[]]; //multidimensional array to store pay elements per shift. first dimension is shift number (0-13), second is pay element for that shift.
let selectedGradeRates;
for (let i = 0; i < 14; i++) shifts.push(new Shift()); //init shifts array with 0 length shifts
let timeField = function() {return document.querySelectorAll(".time")}; //alias for time input boxes
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//init on document load
$(document).ready(function() { 
    initButtons();
    updateGrade();

    let radios = $(".pay-grade-radio");
    for(let i = 0; i < radios.length; i++) {
        radios[i].addEventListener("change", function(){updateGrade();});
    }

    $("#week-commencing-date").datepicker({
        dateFormat: "d/m/yy",
        beforeShowDay: function(date){
            var day = date.getDay();
		    return [ ( day == 0), "" ];
        }
    });

    let timeField = $(".time");
    for(let i = 0; i < timeField.length; i++) {timeField[i].addEventListener("focus", function(){closeAllOptionsShelves();});} //close shelves on time field focus
});

function initButtons() {
    let optionsButtons = $(".options-button");
    for(let i = 0; i < optionsButtons.length; i++) {
        optionsButtons[i].addEventListener("click", function(){toggleOptionsShelf(i)});
        optionsButtons[i].textContent = "Options";
    }
    updateOptionsButtons();
}

function updateOptionsButtons() {
    let optionsButtons = $(".options-button");
    for(let i = 0; i < optionsButtons.length; i++) {
        let ojt = shifts[i].ojt;
        let ph = shifts[i].ph;
        let wm = shifts[i].wm;
        let sick = shifts[i].sick;
        if($(".shift-options-shelf")[i].style.display == "block") optionsButtons[i].style.borderStyle = "solid"; //if shelf open, highlight
            else  optionsButtons[i].style.borderStyle = "none";
        if(sick) {
            optionsButtons[i].textContent = "Sick";
            optionsButtons[i].style.backgroundColor = sickColour;
            optionsButtons[i].style.backgroundImage = "";
            optionsButtons[i].style.color = "";
            optionsButtons[i].style.fontWeight = "bold";
        }
        else if(shifts[i].hoursDecimal <= 0){ //if ZERO HOURS
            optionsButtons[i].textContent = "OFF";
            optionsButtons[i].style.backgroundColor = "black";
            optionsButtons[i].style.backgroundImage = "";
            optionsButtons[i].style.color = "";
            optionsButtons[i].style.fontWeight = "bold";
            if(ojt || ph || wm) { //if any shift options selected, show this on the main option button.
                /*let multipleOptions = false; //trigger for adding delimiters for multiple options
                optionsButtons[i].textContent += " (";
                if(ojt) {
                    optionsButtons[i].textContent += "OJT";
                    multipleOptions = true;
                } 
                if(ph) {
                    if(multipleOptions) optionsButtons[i].textContent += " + ";
                    optionsButtons[i].textContent += "PH";
                    multipleOptions = true;
                }
                if(wm) {
                    if(multipleOptions) optionsButtons[i].textContent += " + ";
                    optionsButtons[i].textContent += "WM";
                    multipleOptions = true;
                }
                optionsButtons[i].textContent += ")";*/
                optionsButtons[i].textContent += " (+)";
            }
        }
        else { //if actual shift
            if(ojt || ph || wm){
                let optionsCount = 0;
                optionsButtons[i].textContent = "";
                optionsButtons[i].style.color = "black";
                optionsButtons[i].style.fontWeight = "";
                optionsButtons[i].style.backgroundImage = "";
                if(ojt){
                    optionsButtons[i].textContent = "OJT";
                    optionsButtons[i].style.backgroundColor = ojtColour;
                    optionsCount++;
                }
                if(ph){
                    if(optionsCount > 0) optionsButtons[i].textContent += " + ";
                    optionsButtons[i].textContent += "PH";
                    optionsButtons[i].style.backgroundColor = phColour;
                    
                    optionsCount++;
                }
                if(wm){
                    if(optionsCount > 0) optionsButtons[i].textContent += " + ";
                    optionsButtons[i].textContent += "WM";
                    optionsButtons[i].style.backgroundColor = wmColour;
                    optionsCount++;
                }
                //set gradient colour for multiple options
                if(optionsCount > 0) {
                    let cssGradient = "linear-gradient(to right";
                    if(ojt) cssGradient += "," + ojtColour;
                    if(ph) cssGradient += "," + phColour;
                    if(wm) cssGradient += "," + wmColour;
                    if(sick) cssGradient += "," + sickColour;
                    cssGradient += ")";
                    optionsButtons[i].style.backgroundImage = cssGradient;
                }
            }
            else{
                optionsButtons[i].textContent = "Normal";
                optionsButtons[i].style.color = "black";
                optionsButtons[i].style.backgroundColor = "";
                optionsButtons[i].style.fontWeight = "";
                optionsButtons[i].style.backgroundImage = "";
            }
        }   
    }
}

function toggleOptionsShelf(day) {
    if($(".shift-options-shelf")[day].style.display == "block"){ //close
        $(".shift-options-shelf")[day].style.display = "";
        updateOptionsButtons();
    }
    else {                                                      //open
        closeAllOptionsShelves();
        $(".shift-options-shelf")[day].textContent = ""; //clear existing buttons
        $(".shift-options-shelf")[day].style.display = "block";
        updateOptionsButtons();
        generateOptionsShelfButtons(day);
    }
}

function refreshOptionsShelf(day) {
    if($(".shift-options-shelf")[day].style.display == "block"){ //if open, refresh
        $(".shift-options-shelf")[day].textContent = ""; //clear existing buttons
        updateOptionsButtons();
        generateOptionsShelfButtons(day);
    }
    else {                                                      //if closed, do not
        console.warn("Options shelf on day " + day + " is closed!");
    }
}

function closeAllOptionsShelves() {
    for(let i = 0; i < $(".shift-options-shelf").length; i++){ //close all shelves first
        $(".shift-options-shelf")[i].style.display = "";
    }
    updateOptionsButtons();
}

function generateOptionsShelfButtons(day) {
    let shelf = $(".shift-options-shelf")[day];

    //OJT button
    let ojtButton = document.createElement("a");
    ojtButton.textContent = "OJT";
    ojtButton.setAttribute("class", "button ojt-button");
    if(shifts[day].ojt) {//if OJT
        ojtButton.addEventListener("click", function(){
            shifts[day].ojt = false;
            refreshOptionsShelf(day);
        });
        ojtButton.style.background = "";
        ojtButton.style.color = "black";
    }
    else {//if not OJT
        ojtButton.addEventListener("click", function(){
            shifts[day].ojt = true;
            shifts[day].sick = false;
            refreshOptionsShelf(day);
        });
        ojtButton.style.background = "none";
    }

    //Public Holiday button
    let phButton = document.createElement("a");
    phButton.textContent = "Public Holiday";
    phButton.setAttribute("class", "button ph-button");
    if(shifts[day].ph) {//if PH
        phButton.addEventListener("click", function(){
            shifts[day].ph = false;
            refreshOptionsShelf(day);
        });
        phButton.style.background = "";
        phButton.style.color = "black";
    }
    else {//if not PH
        phButton.addEventListener("click", function(){
            shifts[day].ph = true;
            shifts[day].sick = false;
            refreshOptionsShelf(day);
        });
        phButton.style.background = "none";
    }

    //Wasted Meal button
    let wmButton = document.createElement("a");
    wmButton.textContent = "Wasted Meal";
    wmButton.setAttribute("class", "button wm-button");
    if(shifts[day].wm) {//if WM
        wmButton.addEventListener("click", function(){
            shifts[day].wm = false;
            refreshOptionsShelf(day);
        });
        wmButton.style.background = "";
        wmButton.style.color = "black";
    }
    else {//if not WM
        wmButton.addEventListener("click", function(){
            shifts[day].wm = true;
            shifts[day].sick = false;
            refreshOptionsShelf(day);
        });
        wmButton.style.background = "none";
    }

    //Sick Meal button
    let sickButton = document.createElement("a");
    sickButton.textContent = "Sick";
    sickButton.setAttribute("class", "button sick-button");
    if(shifts[day].sick) {//if sick
        sickButton.addEventListener("click", function(){
            shifts[day].sick = false;
            refreshOptionsShelf(day);
        });
        sickButton.style.background = "";
        sickButton.style.color = "black";
    }
    else {//if not sick
        sickButton.addEventListener("click", function(){
            shifts[day].sick = true;
            shifts[day].ph = false;
            shifts[day].wm = false;
            shifts[day].ojt = false;
            refreshOptionsShelf(day);
        });
        sickButton.style.background = "none";
    }

    //append buttons to shelf
    shelf.appendChild(ojtButton);
    shelf.appendChild(phButton);
    shelf.appendChild(wmButton);
    shelf.appendChild(sickButton);
}

function timeChanged(field) {
    if(timeField()[field].value.length == 4) {
        updateHoursPerShift();
    }
    else {
        shifts[fieldToShift(field)].setNilHours();
    }
    printShiftHours();
    updateOptionsButtons();
    updateShiftPayTable();
    updateResults();
}

function setFormColour(colour) {
    for(let i = 0; i < $(".container").length; i++) {
        $(".container")[i].style.backgroundColor = colour;
    }
}

function updateGrade() {
    let selectedGrade = document.forms.payGradeForm.payGrade.value;
    switch(selectedGrade) {
        case "spot": 
            selectedGradeRates = spotRates;
            setFormColour("#4691db");
            break;
        case "level1":
            selectedGradeRates = driverLevel1Rates;
            setFormColour("rgb(114, 99, 191)");
            break;
        case "trainee":
            selectedGradeRates = traineeRates;
            setFormColour("rgb(56, 149, 149)");
            break;
        case "conversion":
            selectedGradeRates = conversionRates;
            setFormColour("rgb(207, 133, 50)");
            break;
        default: selectedGradeRates = undefined;
    }
}

function updateHoursPerShift() {
    let times = timeField();
    //shifts = [];
    for(let i = 0; i < times.length; i += 2) {
        if(times[i].value.length == 4 && times[i+1].value.length == 4 && times[i].checkValidity() && times[i+1].checkValidity()){
            //shifts.push(new Shift(times[i].value, times[i+1].value, "ord"));
            shifts[fieldToShift(i)].setShiftTimes(times[i].value, times[i+1].value);
        }
        else {
            //shifts.push(new Shift());
            shifts[fieldToShift(i)].setNilHours();
        }
    }
}

function updateResults() {
    let resultArea = document.getElementById("result-area");
    resultArea.innerHTML = ""; //clear existing results
    for(let i = 0; i < 14; i++) {
        if(shiftPay[i].length > 0){
            let shiftDiv = document.createElement("div");
            let shiftTitle = document.createElement("h3");
            shiftTitle.textContent = "Day " + (i+1);
            shiftDiv.appendChild(shiftTitle);
            let payElements = document.createElement("ul");
            for(let j = 0; j < shiftPay[i].length; j++) {
                let payElement = document.createElement("li");
                payElement.textContent = "Type: " + shiftPay[i][j].payType + " | Rate: " + shiftPay[i][j].rate + " | Hours: " + shiftPay[i][j].hours.toFixed(4) + " | $" + shiftPay[i][j].payAmount.toFixed(2);
                payElements.appendChild(payElement);
            }
            shiftDiv.appendChild(payElements);
            resultArea.appendChild(shiftDiv);
        }
    }
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

function getEbaRate(date, rates) {
    let wcDate = Date.parse(date);
    for(let i = rates.length - 1; i >= 0; i--) {
        if(wcDate >= Date.parse(rateDates[i])){
            return rates[i];
        }
    }
    console.error("getEbaRate() Error: Invalid date or no matching payrate");
    return 0;
}

//calculate pay elements for each shift
//currently proof of concept and under development
function updateShiftPayTable() {
    shiftPay = []; //clear pay table
    for(let i = 0; i < 14; i++) {
        shiftPay.push([]);
        if(shifts[i].hoursDecimal <= 0) { //if zero hours
            //check for shift options (PH?)
        }
        else {
            shiftPay[i].push(new PayElement("normal", shifts[i].hoursDecimal));
        }   
    }
}