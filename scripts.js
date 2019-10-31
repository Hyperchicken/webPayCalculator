"use strict";

//rates
const rateDates =           ["2018-01-01", "2018-07-01", "2019-01-01"];
const spotRates =           [49.4054,      50.6405,      51.9065];
const driverLevel1Rates =   [33.5339,      34.3723,      35.2316];
const traineeRates =        [28.7277,      29.4459,      30.1820];
const conversionRates =     [46.1015,      47.2541,      48.4354];
const ojtAllowanceRates =   [9.7237,       9.9668,       10.2159];
const mealAllowanceRates =  [11.6357,      11.9266,      12.2248];
const suburbanAllowanceRates = [8.3644,    8.5736,       8.7879];
const earlyShiftRates =     [3.2508,       3.3321,       3.4154]; //a shift which is rostered to commence at or between 0400 and 0530
const afternoonShiftRates = [3.2508,       3.3321,       3.4154]; //a shift which is rostered to commence before 1800 and conclude at or after 1830.
const nightShiftRates =     [3.8209,       3.9164,       4.0143]; //a shift which is rostered to commence at or between 1800 and 0359 hours.

//colours
const normalColour = "#00b9e8";
const ojtColour = "#ff7300";
const ddoColour = "#005229";
const phColour = "#44c600";
const wmColour = "#aa60d5";
const sickColour = "#ff0000";
const bonusColour = "#e79e00";
const alColour = "#1c4ab3";
const buttonBackgroundColour = "#5554";


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
        this.phExtraPay = false; //ph extra pay. extra leave if false.
        this.wm = false; //wasted meal
        this.sick = false; //sick full day
        this.sickPart = false; //worked but went home sick partway through shift
        this.al = false; //annual leave
        this.ddo = false; //DDO
        this.bonus = false;
        this.bonusHours = 0.0; //bonus payment hours
        this.shiftNumber = 0;
        this.shiftWorkedNumber = 0;
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

    get endHour48() {
        let hours = this.endHour - this.startHour;
        let minutes = this.endMinute - this.startMinute;
        if(hours < 0 || (hours == 0 && minutes < 0)) return this.endHour + 24;
        else return this.endHour;
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
    constructor(payType, hours, ojt) {
            this.payType = payType;
            this.hours = hours;
            this.ojt = ojt;
    }
    
    get sortIndex() {
        switch(this.payType) {
            case "normal": return 1;
            case "guarantee": return 2;
            case "sick": return 3;
            case "annualLeave": return 4;
            case "phGaz": return 5;
            case "phXpay": return 6;
            case "phWorked": return 7;
            case "nonRosPH": return 8;
            case "phPen50": return 9;
            case "wePen50": return 10;
            case "wePen100": return 11;
            case "ot150": return 12;
            case "ot200": return 13;
            case "rost+50": return 14;
            case "rost+100": return 15;
            case "earlyShift": return 19;
            case "afternoonShift": return 20;
            case "nightShift": return 21;
            case "metroSig2": return 25;
            case "mealAllowance": return 30;
            case "bonusPayment": return 31;
            case "edo": return 35;
            case "leaveLoading": return 50;
            default:
                console.warn("PayElement.sortIndex: no sort index for pay type \"" + this.payType + "\"");
                return 1000;
        }
    }

    get payAmount() {
        return this.rate * this.hours;
    }

    get payClass() {
        let payClassName = "";
        switch(this.payType) {
            case "normal": payClassName = "Normal"; break;
            case "guarantee": payClassName = "Guarantee"; break;
            case "sick": payClassName = "Sick Full"; break;
            case "annualLeave": payClassName = "A/Leave"; break;
            case "phGaz": payClassName = "PH Gazette"; break;
            case "phXpay": payClassName = "PH X/Pay"; break;
            case "phWorked": payClassName = "PH Worked"; break;
            case "nonRosPH": payClassName = "Non-Ros PH"; break;
            case "phPen50": payClassName = "PhPen 50%"; break;
            case "wePen50": payClassName = "WePen 50%"; break;
            case "wePen100": payClassName = "WePen 100%"; break;
            case "ot150": payClassName = "O/T1.5 Vol"; break;
            case "ot200": payClassName = "O/T2.0 Vol"; break;
            case "rost+50": payClassName = "Rost+50%"; break;
            case "rost+100": payClassName = "Rost+100%"; break;
            case "earlyShift": payClassName = "E/Shift"; break;
            case "afternoonShift": payClassName = "A/Shift"; break;
            case "nightShift": payClassName = "N/Shift"; break;
            case "metroSig2": payClassName = "Metro Sig2"; break;
            case "mealAllowance": payClassName = "Meal Allow"; break;
            case "bonusPayment": payClassName = "Bonus Pay"; break;
            case "edo": payClassName = "EDO"; break;
            case "leaveLoading": payClassName = "Leave Ldg 20%"; break;
            default:
                payClassName = this.payType;
                console.warn("PayElement.payClass: no pay-type name defined for \"" + this.payType + "\"");
        }
        if(this.ojt) return payClassName + " (OJT)";
        else return payClassName;
    }

    get helpText() {
        let tooltipText = "";
        switch(this.payType) {
            case "normal": 
                tooltipText = "<strong>Normal</strong>"
                + "<p><em>Ordinary hours</em> at the ordinary rate. How ordinary...</p>"
                + "<ul><li>Ordinary hours are up to 8 hours per day for non-trainees and 7.6 hours for trainees.</li>"
                + "<li>Generally, ordinary hours is time worked that is not affected by penalty rates (for example: overtime, public holidays, weekends, etc).</li></ul>";
                break;
            case "guarantee": 
                tooltipText = "<strong>Guarantee</strong>"
                + "<p><em>Guaranteed</em> 8 hours pay for a shift that is less than 8 hours long.</p>"
                + "<ul><li>First 10 worked shifts eligible.</li>"
                + "<li>Paid only on <em>Normal</em> hours (ie. not Public Holidays, shiftwork penalties, etc...).</li>"
                + "<li>Trainees not eligible.</li></ul>";
                break;
            case "sick": 
                tooltipText = "<strong>Sick Full</strong>"
                + "<p>A full day of <em>personal leave</em>. </p>";
                break;
            case "annualLeave": 
                tooltipText = "<strong>Annual Leave</strong>"
                + "<p><em>Annual Leave</em> paid at 8 hours per day of leave, up to 40 hours (5 shifts) per week.</p>"
                + "<ul><li>Sick days taken during Annual Leave will be paid as <em>Sick Full</em> and not count as Annual Leave.</li>"
                + "<li>Public Holidays that occur during Annual Leave will be paid as <em>PH Gazette</em> and not count as Annual Leave.</li></ul>";
                break;
            case "phGaz": tooltipText = "<strong>PH Gazette</strong>"
                + "<p>A full day's <em>Paid leave of absence</em> for a <em>Public Holiday</em> not worked.</p>";
                break;
            case "phXpay": tooltipText = "<strong>PH X/Pay</strong>"
                + "<p><em>Public Holiday Extra Pay.</em> Additional pay at the normal rate for the hours worked on a public holiday where 'extra pay' was elected when signing-on, or if the public holiday falls on a Sunday.</p>"
                + "<ul><li>Public Holidays that fall on a Sunday are automatically <em>Extra Pay</em> as opposed to <em>Extra Leave</em>.</li></ul>";
                break;
            case "phWorked": tooltipText = "<strong>PH Worked</strong>"
                + "<p><em>Public Holiday Worked.</em> Time worked on a Public Holiday, paid at <em>normal time</em>.</p>";
                break;
            case "nonRosPH": tooltipText = "<strong>Non-Ros PH</strong>"
                + "<p><em>Non-Rostered Public Holiday.</em></p>"
                break;
            case "phPen50": tooltipText = "<strong>PhPen 50%</strong>"
                + "<p><em>Public Holiday Penalty +50%.</em> Penalty payment paid at <em>50% of normal time</em> for time worked on a public holiday.</p>"
                break;
            case "wePen50": tooltipText = "<strong>WePen 50%</strong>"
                + "<p><em>Weekend Penalty 50% (Saturday Time).</em> Penalty payment paid at <em>50% of normal time</em> for time worked on a Saturday.</p>"
                break;
            case "wePen100": tooltipText = "<strong>WePen 100%</strong>"
                + "<p><em>Weekend Penalty 100% (Sunday Time). Penalty payment paid at <em>normal time</em> for time worked on a Sunday.</em></p>"
                break;
            case "ot150": tooltipText = "<strong>O/T1.5 Vol</strong>"
                + "<p><em>Excess Shift Overtime x1.5.</em> Time worked on the 11th and 12th shifts of the fortnight, paid at <em>time and half</em>.</p>"
                break;
            case "ot200": tooltipText = "<strong>O/T2.0 Vol</strong>"
                + "<p><em>Excess Shift Overtime x2.</em> Time worked on the 13th and 14th shifts of the fortnight, or the 11th or 12th shift if it falls on a Saturday, paid at <em>double time</em>.</p>"
                break;
            case "rost+50": tooltipText = "<strong>Rost+50%</strong>"
                + "<p><em>Excess Hours Overtime x1.5.</em> Time worked on an ordinary shift in excess of 8 hours, paid at <em>time and a half</em> for for the first three excess hours.</p>"
                break;
            case "rost+100": tooltipText = "<strong>Rost+100%</strong>"
                + "<p><em>Excess Hours Overtime x2.</em> Time worked on an ordinary shift in excess of 11 hours, paid at <em>double time.</em></p>"
                break;
            case "earlyShift": tooltipText = "<strong>E/Shift</strong>"
                + "<p><em>Early Shift.</em> Penalty payment for a shift that commences at or between 0400 and 0530.</p>"
                + "<ul><li>Rounded to the nearest whole hour.</li></ul>";
                break;
            case "afternoonShift": tooltipText = "<strong>A/Shift</strong>"
                + "<p><em>Afternoon Shift.</em> Penalty payment for a shift that commences before 1800 and concludes at or after 1830.</p>"
                + "<ul><li>Rounded to the nearest whole hour.</li></ul>";
                break;
            case "nightShift": tooltipText = "<strong>N/Shift</strong>"
                + "<p><em>Night Shift.</em> Penalty payment for a shift that commences at or between 1800 and 0359.</p>"
                + "<ul><li>Rounded to the nearest whole hour.</li></ul>";
                break;
            case "metroSig2": tooltipText = "<strong>Metro Sig2</strong>"
                + "<p><em>Suburban Allowance.</em> The following excerpt is taken from the 2015-2019 EA section 4.7:</p>"
                + "<blockquote><p>Employees regularly employed driving suburban electric trains in the Melbourne Metropolitan Rail Network and who are qualified to drive under the Metrol Signalling and Safe Working System are to be paid a Suburban Allowance in accordance with Schedule C of the Agreement, per shift for all rostered shifts for which they are ready willing and able to perform all of the functions required of that position. This allowance does not apply to Trainee Drivers.</p></blockquote>";
                break;
            case "mealAllowance": tooltipText = "<strong>Meal Allow</strong>"
                + "<p><em>Meal Allowance.</em> Paid where the employee has had a wasted meal, or if they have worked more than 2 hours of overtime that shift.</p>"
                break;
            case "bonusPayment": tooltipText = "<strong>Bonus Pay</strong>"
                + "<p><em>Bonus Payment</em> paid where the company has offered an incentive payment on a particular shift.</p>"
                + "<ul><li>The name of this payment on your payslip will be different!</li>"
                + "<li>In the past, bonus payments have been offered on days such as White Night and New Years.</li></ul>";
                break;
            case "edo": tooltipText = "<strong>EDO</strong>"
                + "<p><em>Discretionary Day Off</em>. +4 hours paid on a DDO fortnight, -4 hours deducted otherwise.</p>"
                break;
            case "leaveLoading": tooltipText = "<strong>Leave Ldg 20%</strong>"
                + "<p><em>Leave Loading 20%.</em> Additional 20% loading paid on Annual Leave taken.</p>"
                break;
            default:
                tooltipText = "";
                console.warn("PayElement.tooltipText: no tooltip-text defined for \"" + this.payType + "\"");
        }
        if(this.ojt) return tooltipText + "<p><em>OJT rate</em></p>";
        else return tooltipText;
    }

    get payClassRaw() {
        if(this.ojt) return this.payType + "_OJT";
        else return this.payType;
    }

    get rate() {
        let selectedDate = $("#week-commencing-date").datepicker("getDate");
        let rate = 0;
        if(this.ojt) rate += getEbaRate(selectedDate, ojtAllowanceRates); //apply OJT allowance
        switch(this.payType) {
            case "normal": //Normal rate
            case "sick":
            case "guarantee": //pay guarantee to 8 hours
            case "edo":
            case "wePen100":
            case "phGaz":
            case "phWorked":
            case "phXpay":
            case "nonRosPH": //8 hours pay for NOT working on Easter Saturday but NOT UNDERLINED
            case "annualLeave":
            case "bonusPayment":
                rate += getEbaRate(selectedDate, selectedGradeRates);
                break;
            case "wePen50":
            case "phPen50":
                rate += getEbaRate(selectedDate, selectedGradeRates);
                rate /= 2;
                break;
            case "ot150":
            case "rost+50":
                rate += getEbaRate(selectedDate, selectedGradeRates);
                rate *= 1.5;
                break;
            case "ot200":
            case "rost+100":
                rate += getEbaRate(selectedDate, selectedGradeRates);
                rate *= 2;
                break;
            case "earlyShift":
                rate += getEbaRate(selectedDate, earlyShiftRates);
                break;
            case "afternoonShift":
                rate += getEbaRate(selectedDate, afternoonShiftRates);
                break;
            case "nightShift":
                rate += getEbaRate(selectedDate, nightShiftRates);
                break;
            case "metroSig2":
                rate += getEbaRate(selectedDate, suburbanAllowanceRates);
                break;
            case "mealAllowance":
                rate += getEbaRate(selectedDate, mealAllowanceRates);
                break;
            case "leaveLoading":
                rate += getEbaRate(selectedDate, selectedGradeRates);
                rate *= 0.2;
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
let additionalPayments = []; //an array to store non-shift-specific pay elements such as DDO or other additional payments.
let selectedGradeRates;
let selectBonusTextbox; //keep track of elements to select in future
let day14ph = false;
for (let i = 0; i < 14; i++) shifts.push(new Shift()); //init shifts array with 0 length shifts
let timeField = function() {return document.querySelectorAll(".time")}; //alias for time input boxes
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//init on document load
$(document).ready(function() { 
    initButtons();
    updateGrade();

    //setup datepicker
    let daysToLastFortnight = ((new Date().getDay()) * -1) -14;
    $("#week-commencing-date").datepicker({
        dateFormat: "d/m/yy",
        altField: "#date-button",
        firstDay: 0,
        defaultDate: daysToLastFortnight,
        beforeShowDay: function(date){
            let day = date.getDay();
            if(day == 0) {
                return [true , "" ];
            }
            else {
                return [false, "" ];
            }
        },
        onSelect: function(){
            updateDates();
            printShiftHours();
            updateOptionsButtons();
            updateShiftPayTable();
            updateResults();
            toggleDatepicker();
        }
    });
    //update any existing data on page load
    updateDates();
    updateShiftTable();
    updateShiftWorkedCount();
    printShiftHours();
    updateOptionsButtons();
    updateShiftPayTable();
    updateResults();

    let timeField = $(".time");
    for(let i = 0; i < timeField.length; i++) { //close shelves on time field focus
        timeField[i].addEventListener("focus", function(){closeAllOptionsShelves();});
    } 
});

//initialise options buttons
function initButtons() {
    let optionsButtons = $(".options-button");
    for(let i = 0; i < optionsButtons.length; i++) {
        optionsButtons[i].addEventListener("click", function(){toggleOptionsShelf(i)});
        optionsButtons[i].textContent = "Options";
    }
    $(".last-sunday").hide();
    $("#lastSunPhNo").on("click", function(){toggleDay14ph();});
    $("#lastSunPhYes").on("click", function(){toggleDay14ph();});
    updateOptionsButtons();
}

//toggles if Day 14 (sunday after last day of fortnight) is a pubnlic holiday
function toggleDay14ph() {
    if(day14ph) day14ph = false;
    else day14ph = true;
    updateOptionsButtons();
    updateShiftPayTable();
    updateResults();
}

//show/hide the datepicker
function toggleDatepicker() {
    //$( "#week-commencing-date" ).slideToggle(300); //animated slide. looks a bit jerky on mobile
    $( "#week-commencing-date" ).toggle();
}

//Update all options buttons with the appropriate colours/text/icons based on each Shift.
function updateOptionsButtons() {
    let optionsButtons = $(".options-button");
    for(let i = 0; i < optionsButtons.length; i++) {
        let s = shifts[i];
        let buttonIcon = document.createElement("i");
        if($(".shift-options-shelf:eq("+i+")").is(":visible")) { //set appropriate button icon
            buttonIcon.setAttribute("class", "button-icon fas fa-lg fa-angle-up");
        }
        else {
            buttonIcon.setAttribute("class", "button-icon fas fa-lg fa-angle-down");
        }
        let buttonText = document.createElement("span");
        optionsButtons[i].textContent = "";
        buttonText.style.fontWeight = "bold";
        optionsButtons[i].style.backgroundImage = "";
        let buttonColours = [];
        let setButton = (label, ...colours) => {
            if(buttonColours.length > 0) buttonText.innerHTML += "<br>";
            buttonText.innerHTML += label;
            for(let i=0; i < colours.length; i++) {
                buttonColours.push(colours[i]);
            }
        }
        if(s.hoursDecimal <= 0){ //if ZERO HOURS
            if(s.sick) {
                if(s.ph) {
                    setButton("Sick&nbsp(PH)", sickColour, phColour);
                }
                else {
                    setButton("Sick", sickColour);
                }
            }
            else if(s.al) { //annual leave
                if(s.ph) {
                    setButton("PH&nbsp(AL)", alColour, phColour);
                }
                else {
                    setButton("A/Leave", alColour);
                }
            }
            else if(s.ph || s.ddo || (s.bonus && s.bonusHours > 0)) {
                if(s.ph) 
                    setButton("PH-OFF", phColour);
                if(s.ddo) 
                    setButton("DDO-OFF", ddoColour);
                if(s.bonus && s.bonusHours > 0) 
                    setButton("Bonus&nbspPay", bonusColour);
            }
            else {
                if(s.ojt || s.wm || s.bonus) //if any shift options selected, show this on the main option button.
                    setButton("OFF&nbsp(+)", "black");
                else
                    setButton("OFF", "black");
            }
        }
        else { //if actual shift
            if(s.sick) {
                setButton("Sick", sickColour);
            }
            else if(s.ojt || s.ph || s.wm || s.ddo || s.bonus){
                if(s.ojt)
                    setButton("OJT", ojtColour);
                if(s.ddo)
                    setButton("DDO-Worked", ddoColour);
                if(s.ph){
                    if(s.phExtraPay)
                        setButton("PH-XPay", phColour);
                    else
                        setButton("PH-XLeave", phColour);
                }
                if(s.wm)
                    setButton("Wasted&nbspMeal", wmColour);
                if(s.bonus && s.bonusHours > 0)
                    setButton("Bonus&nbspPay", bonusColour);
            }
            if(buttonColours.length == 0) {
                setButton("Normal", normalColour);
            }
        }
        //set gradient colour for multiple options
        optionsButtons[i].style.backgroundImage = "";
        optionsButtons[i].style.backgroundColor = "";
        if(buttonColours.length == 1) {
            optionsButtons[i].style.backgroundColor = buttonColours[0];
        }
        else if(buttonColours.length > 1) {
            let cssGradient = "linear-gradient(to right";
            for(let i = 0; i < buttonColours.length; i++) {
                cssGradient += "," + buttonColours[i];
            }
            cssGradient += ")";
            optionsButtons[i].style.backgroundImage = cssGradient;
        }
        else {
            optionsButtons[i].style.backgroundColor = "white";
            console.warn("No button options set! Setting button " + i + "to white!");
        }
        optionsButtons[i].appendChild(buttonText);
        optionsButtons[i].appendChild(buttonIcon);
    }
    if(day14ph) {
        $("#lastSunPhNo")[0].style.backgroundColor = buttonBackgroundColour;
        $("#lastSunPhYes")[0].style.backgroundColor = phColour;
    }
    else {
        $("#lastSunPhNo")[0].style.backgroundColor = "#c60000";
        $("#lastSunPhYes")[0].style.backgroundColor = buttonBackgroundColour;
    }
}

function toggleOptionsShelf(day) {
    /*if($(".shift-options-shelf")[day].style.display == "block"){ //close
        $(".shift-options-shelf")[day].style.display = "";
        updateOptionsButtons();
    }
    else {                                                      //open
        closeAllOptionsShelves();
        $(".shift-options-shelf")[day].textContent = ""; //clear existing buttons
        $(".shift-options-shelf")[day].style.display = "block";
        updateOptionsButtons();
        generateOptionsShelfButtons(day);
    } */
    if($(".shift-options-shelf:eq("+day+")").is(":hidden")){ //open
        closeAllOptionsShelves();
        $(".shift-options-shelf")[day].textContent = ""; //clear existing buttons
        generateOptionsShelfButtons(day);
        //$(".shift-options-shelf:eq("+day+")").slideDown(150);
        $(".shift-options-shelf:eq("+day+")").toggle();
        updateOptionsButtons();
    }
    else {                                                      //close
        //$(".shift-options-shelf:eq("+day+")").slideUp(150, updateOptionsButtons);
        $(".shift-options-shelf:eq("+day+")").toggle();
        updateOptionsButtons();
        //$(".options-button")[day].style.border = "none";
    }
}

function refreshOptionsShelf(day) {
    if($(".shift-options-shelf:eq("+day+")").is(":visible")){ //if open, refresh
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
        if($(".shift-options-shelf:eq("+i+")").is(":visible")) {
            //$(".shift-options-shelf:eq("+i+")").slideUp(150, updateOptionsButtons);
            $(".shift-options-shelf:eq("+i+")").toggle();
            updateOptionsButtons();
        }
    }

}

function generateOptionsShelfButtons(day) {
    let shelf = $(".shift-options-shelf")[day];
    const reloadPageData = () => {
        refreshOptionsShelf(day);
        updateShiftWorkedCount();
        printShiftHours();
        updateShiftPayTable();
        updateResults();
    }

    //OJT button
    let ojtButton = document.createElement("a");
    ojtButton.textContent = "OJT";
    ojtButton.setAttribute("class", "button ojt-button shelf-button");
    if(shifts[day].ojt) {//if OJT
        ojtButton.addEventListener("click", function(){
            shifts[day].ojt = false;
            reloadPageData();
        });
        ojtButton.style.background = "";
    }
    else {//if not OJT
        ojtButton.addEventListener("click", function(){
            shifts[day].ojt = true;
            reloadPageData();
        });
        ojtButton.style.background = buttonBackgroundColour;
    }

    //DDO button
    let ddoButton = document.createElement("a");
    ddoButton.textContent = "DDO";
    ddoButton.setAttribute("class", "button ddo-button shelf-button");
    if(shifts[day].ddo) {//if DDO
        ddoButton.addEventListener("click", function(){
            shifts[day].ddo = false;
            reloadPageData();
        });
        ddoButton.style.background = "";
    }
    else {//if not DDO
        ddoButton.addEventListener("click", function(){
            shifts[day].ddo = true;
            reloadPageData();
        });
        ddoButton.style.background = buttonBackgroundColour;
    }

    //Public Holiday button
    let phSpan = document.createElement("span");
    let phButton = document.createElement("a");
    phButton.textContent = "Public Holiday";
    phButton.setAttribute("class", "button ph-button shelf-button");
    phSpan.appendChild(phButton);
    if(shifts[day].ph) {//if PH
        phButton.addEventListener("click", function(){
            shifts[day].ph = false;
            reloadPageData();
        });
        phButton.style.background = "";
        if(shifts[day].hoursDecimal > 0) {
            let xLeaveButton = document.createElement("a");
            let xPayButton = document.createElement("a");
            xLeaveButton.setAttribute("class", "button ph-button shelf-button dual-button-l");
            xPayButton.setAttribute("class", "button ph-button shelf-button dual-button-r");
            xLeaveButton.textContent = "Extra Leave";
            xPayButton.textContent = "Extra Pay";
            phSpan.appendChild(xLeaveButton);
            phSpan.appendChild(xPayButton);
            if(day == 0 || day == 7) { //force extra pay on sunday as per EBA
                xLeaveButton.addEventListener("click", function() {
                    //add tooltip functionality explaining reason you cant have extra leave on a sunday
                });
                xLeaveButton.style.background = "#808080ad";
                xLeaveButton.style.color = "black";
                xPayButton.style.background = "";
            }
            else {
                if(shifts[day].phExtraPay) {
                    xLeaveButton.addEventListener("click", function() {
                        shifts[day].phExtraPay = false;
                        reloadPageData();
                    });
                    xLeaveButton.style.background = buttonBackgroundColour;
                    xPayButton.style.background = "";
                } else {
                    xPayButton.addEventListener("click", function() {
                        shifts[day].phExtraPay = true;
                        reloadPageData();
                    });
                    xLeaveButton.style.background = "";
                    xPayButton.style.background = buttonBackgroundColour;
                }
            }
        }
    }
    else {//if not PH
        phButton.addEventListener("click", function(){
            shifts[day].ph = true;
            if(day == 0 || day == 7) {
                shifts[day].phExtraPay = true;
            }
            reloadPageData();
        });
        phButton.style.background = buttonBackgroundColour;
    }

    //Wasted Meal button
    let wmButton = document.createElement("a");
    wmButton.textContent = "Wasted Meal";
    wmButton.setAttribute("class", "button wm-button shelf-button");
    if(shifts[day].wm) {//if WM
        wmButton.addEventListener("click", function(){
            shifts[day].wm = false;
            reloadPageData();
        });
        wmButton.style.background = "";
    }
    else {//if not WM
        wmButton.addEventListener("click", function(){
            shifts[day].wm = true;
            reloadPageData();
        });
        wmButton.style.background = buttonBackgroundColour;
    }

    //Sick button
    let sickButton = document.createElement("a");
    sickButton.textContent = "Sick";
    sickButton.setAttribute("class", "button sick-button shelf-button");
    if(shifts[day].sick) {//if sick
        sickButton.addEventListener("click", function(){
            shifts[day].sick = false;
            reloadPageData();
        });
        sickButton.style.background = "";
    }
    else {//if not sick
        sickButton.addEventListener("click", function(){
            shifts[day].sick = true;
            reloadPageData();
        });
        sickButton.style.background = buttonBackgroundColour;
    }

    //Annual leave button
    let alButton = document.createElement("a");
    alButton.textContent = "Annual Leave";
    alButton.setAttribute("class", "button annual-leave-button shelf-button");
    if(shifts[day].al) {//if AL
        alButton.addEventListener("click", function(){
            shifts[day].al = false;
            reloadPageData();
        });
        alButton.style.background = "";
    }
    else {//if not AL
        alButton.addEventListener("click", function(){
            shifts[day].al = true;
            reloadPageData();
        });
        alButton.style.background = buttonBackgroundColour;
    }

    //Bonus Payment button
    let bonusButton = document.createElement("span"); //is a span instead of an anchor for provision of textbox
    let bonusButtonText = document.createElement("a");
    let bonusTextbox = document.createElement("input");
    bonusButtonText.textContent = "Bonus Payment";
    bonusButton.setAttribute("class", "button bonus-button shelf-button");
    bonusTextbox.setAttribute("type", "tel");
    bonusTextbox.pattern = "\\d{1,2}(\\.\\d{0,2})?";
    bonusTextbox.maxLength = "5";
    bonusButton.appendChild(bonusButtonText);
    if(shifts[day].bonus) { //if bonus payment
        let bonusHrsText = document.createElement("a");
        bonusHrsText.textContent = "hrs";
        bonusTextbox.value = shifts[day].bonusHours;
        bonusButton.appendChild(bonusTextbox);
        bonusButton.appendChild(bonusHrsText);
        bonusButtonText.addEventListener("click", function(){
            shifts[day].bonus = false;
            reloadPageData();
        });
        bonusTextbox.addEventListener("input", function(){
            if(this.validity.valid && parseFloat(this.value)) { //only accept valid input for bonus hours.
                shifts[day].bonusHours = parseFloat(this.value);
            }
            else {
                shifts[day].bonusHours = 0.0;
            }
            updateOptionsButtons();
            updateShiftPayTable();
            updateResults();
        });
    }
    else {
        bonusButton.addEventListener("click", function(){
            shifts[day].bonus = true;
            selectBonusTextbox = true;
            reloadPageData();
        });
        bonusButton.style.background = buttonBackgroundColour;
    }
    

    //append buttons to shelf
    shelf.appendChild(ojtButton);
    shelf.appendChild(ddoButton);
    shelf.appendChild(wmButton);
    shelf.appendChild(sickButton);
    shelf.appendChild(phSpan);
    shelf.appendChild(alButton);
    shelf.appendChild(bonusButton);

    //set focus if any
    if(selectBonusTextbox) {
        bonusTextbox.select();
        selectBonusTextbox = false;
    }
}

function timeChanged(field) {
    if(timeField()[field].value.length == 4) {
        if(field < 27) timeField()[field + 1].focus();
    }
    updateShiftTable();
    updateShiftWorkedCount();
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

function getPayGrade() {
    return document.forms.payGradeForm.payGrade.value;
}

function updateGrade() {
    switch(getPayGrade()) {
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
    printShiftHours();
    updateOptionsButtons();
    updateShiftPayTable();
    updateResults();
}

function updateShiftTable() {
    let times = timeField();
    for(let i = 0; i < times.length; i += 2) {
        let currentShift = fieldToShift(i);
        if(times[i].value.length == 4 && times[i+1].value.length == 4 && times[i].checkValidity() && times[i+1].checkValidity()){
            shifts[currentShift].setShiftTimes(times[i].value, times[i+1].value);
        }
        else {
            shifts[currentShift].setNilHours();
        }
    }
    if((shifts[13].endHour48 - 24) + (shifts[13].endMinute / 60) > 0) $(".last-sunday").show();
        else $(".last-sunday").hide();
    updateShiftWorkedCount();
}

function updateShiftWorkedCount() {
    let shiftsCount = 0;
    let shiftsWorkedCount = 0;
    if(ddoWeek()) shiftsWorkedCount = 1;
    for(let i = 0; i < shifts.length; i++) {
        //determine if shift
        if(shifts[i].hoursDecimal > 0 || shifts[i].sick || shifts[i].ph) {
            shifts[i].shiftNumber = ++shiftsCount;
        } else shifts[i].shiftNumber = 0;

        //determine if worked shift
        if(shifts[i].hoursDecimal > 0 && !shifts[i].sick) {
            shifts[i].shiftWorkedNumber = ++shiftsWorkedCount;
        } else shifts[i].shiftWorkedNumber = 0;
    }
}

function updateResults() {
    let resultArea = document.getElementById("result-area");
    let resultsViewFormat = document.forms.resultsViewForm.resultsView.value;
    let totalValue = 0.0;
    let selectedDate = $("#week-commencing-date").datepicker("getDate");
    let dateDiv = document.querySelector(".week-commencing");
    //create grouped elements table for combined view
    let groupedElements = [];
    shiftPay.forEach(function(day){
        day.forEach(function(element){
            let elementIndex = groupedElements.findIndex(function(elem){return element.payClass == elem.payClass;});
            if(elementIndex == -1) {
                groupedElements.push(new PayElement(element.payType, element.hours, element.ojt));
            }
            else {
                groupedElements[elementIndex].hours += element.hours;
            }
        });
    });
    additionalPayments.forEach(function(element){
        let elementIndex = groupedElements.findIndex(function(elem){return element.payClass == elem.payClass;});
            if(elementIndex == -1) {
                groupedElements.push(new PayElement(element.payType, element.hours, element.ojt));
            }
            else {
                groupedElements[elementIndex].hours += element.hours;
            }
    });

    resultArea.innerHTML = ""; //clear existing results
    if(!selectedDate) {
        dateDiv.style.borderStyle = "solid";
        dateDiv.style.background = "";
        let dateErrorElement = document.createElement("h3");
        dateErrorElement.textContent = "Please set Week Commencing date!";
        resultArea.appendChild(dateErrorElement);
    }
    else {
        dateDiv.style.borderStyle = "none";
        dateDiv.style.background = "none";

        if(resultsViewFormat == "grouped"){
            let listDiv = document.createElement("div");
            let elementTable = document.createElement("table");
            elementTable.className = "pay-element-table";
            let headerRow = document.createElement("tr");
            headerRow.innerHTML = "<th>Pay Class</th><th>Rate</th><th>Hours</th><th>Amount</th>";
            elementTable.appendChild(headerRow);
            groupedElements.sort(function(a,b){return a.sortIndex - b.sortIndex}); //sort pay elements according to defined sort order (defined in Pay Elements class)
            groupedElements.forEach(function(e){
                let payElementRow = document.createElement("tr");
                //payElement.textContent = e.payClass.padEnd(14, " ") + " | Rate: " + e.rate.toFixed(4).padEnd(8, " ") + " | Hours: " + e.hours.toFixed(4).padEnd(8, " ") + " | $" + e.payAmount.toFixed(2);
                let elemClass = document.createElement("td");
                let elemRate = document.createElement("td");
                let elemHours = document.createElement("td");
                let elemAmount = document.createElement("td");
                elemClass.textContent = e.payClass.padEnd(14, " ");
                elemRate.textContent = e.rate.toFixed(4).padEnd(8, " ");
                elemHours.textContent = e.hours.toFixed(4).padEnd(8, " ");
                elemAmount.textContent = "$" + e.payAmount.toFixed(2);
                elemClass.className = "pay-element-class";
                payElementRow.appendChild(elemClass);
                payElementRow.appendChild(elemRate);
                payElementRow.appendChild(elemHours);
                payElementRow.appendChild(elemAmount);
                elementTable.appendChild(payElementRow);
                totalValue += e.payAmount;
                if(e.helpText) {
                    elemClass.addEventListener("click", function(){
                        $(".pay-element-table > tr").css("background-color", ""); //clear existing highlights
                        document.getElementById("helpDiv").innerHTML = e.helpText;
                        payElementRow.style.backgroundColor = "#00000040"; //highlight clicked element
                        window.location.replace("#helpDiv"); //scroll to help box
                    });
                }
            });
            listDiv.appendChild(elementTable);
            resultArea.appendChild(listDiv);
            
            //subtotal
            listDiv.appendChild(document.createElement("hr"));
            let totalElement = document.createElement("h3");
            totalElement.setAttribute("id", "totalElement");
            totalElement.textContent = "Total Gross: $" + totalValue.toFixed(2);
            resultArea.appendChild(totalElement);
        }
        else if(resultsViewFormat == "split") {
            let elementTable = document.createElement("table");
            elementTable.className = "pay-element-table";
            let firstDay = true;
            for(let i = 0; i < 14; i++) {
                if(shiftPay[i].length > 0){ //if any pay elements for current day
                    shiftPay[i].sort(function(a,b){return a.sortIndex - b.sortIndex}); //sort pay elements as per defined sort index
                    let shiftHeaderRow = document.createElement("tr");
                    let shiftTitle = document.createElement("td");
                    shiftHeaderRow.className = "splitview-title";
                    shiftTitle.className = "splitview-title-data";
                    shiftTitle.textContent = $(".day-of-week")[i].textContent;
                    //shiftTitle.textContent += " | Shift " + shifts[i].shiftNumber + " | Shift Worked: " + shifts[i].shiftWorkedNumber;
                    shiftTitle.colSpan = 4;
                    shiftHeaderRow.appendChild(shiftTitle);
                    elementTable.appendChild(shiftHeaderRow);
                    if(firstDay) {
                        firstDay = false;
                        shiftTitle.className += " first";
                        let payHeaderRow = document.createElement("tr");
                        payHeaderRow.innerHTML = "<th>Pay Class</th><th>Rate</th><th>Hours</th><th>Amount</th>";
                        elementTable.appendChild(payHeaderRow);
                    }
                    for(let j = 0; j < shiftPay[i].length; j++) {
                        let payElementRow = document.createElement("tr");
                        let elemClass = document.createElement("td");
                        let elemRate = document.createElement("td");
                        let elemHours = document.createElement("td");
                        let elemAmount = document.createElement("td");
                        elemClass.textContent = shiftPay[i][j].payClass;
                        elemRate.textContent = shiftPay[i][j].rate.toFixed(4);
                        elemHours.textContent = shiftPay[i][j].hours.toFixed(4);
                        elemAmount.textContent = "$" + shiftPay[i][j].payAmount.toFixed(2);
                        elemClass.className = "pay-element-class";
                        payElementRow.appendChild(elemClass);
                        payElementRow.appendChild(elemRate);
                        payElementRow.appendChild(elemHours);
                        payElementRow.appendChild(elemAmount);
                        elementTable.appendChild(payElementRow);
                        totalValue += shiftPay[i][j].payAmount;
                        if(shiftPay[i][j].helpText) {
                            elemClass.addEventListener("click", function(){
                                $(".pay-element-table > tr").css("background-color", ""); //clear existing highlights
                                document.getElementById("helpDiv").innerHTML = shiftPay[i][j].helpText;
                                payElementRow.style.backgroundColor = "#00000040"; //highlight clicked element
                                window.location.replace("#helpDiv"); //scroll to help box
                            });
                        }
                    }
                    let lastRow = document.createElement("tr");
                    let lastRowData = document.createElement("td");
                    lastRowData.colSpan = 4;
                    lastRowData.className = "last-row";
                    lastRow.appendChild(lastRowData);
                    elementTable.appendChild(lastRow);
                }
            }
            if(additionalPayments.length > 0) {
                let shiftHeaderRow = document.createElement("tr");
                let shiftTitle = document.createElement("td");
                shiftHeaderRow.className = "splitview-title";
                shiftTitle.className = "splitview-title-data";
                shiftTitle.textContent = "Other Payments";
                shiftTitle.colSpan = 4;
                shiftHeaderRow.appendChild(shiftTitle);
                elementTable.appendChild(shiftHeaderRow);
                if(firstDay) {
                    firstDay = false;
                    shiftTitle.className += " first";
                    let payHeaderRow = document.createElement("tr");
                    payHeaderRow.innerHTML = "<th>Pay Class</th><th>Rate</th><th>Hours</th><th>Amount</th>";
                    elementTable.appendChild(payHeaderRow);
                }
                for(let j = 0; j < additionalPayments.length; j++) {
                    let payElementRow = document.createElement("tr");
                        let elemClass = document.createElement("td");
                        let elemRate = document.createElement("td");
                        let elemHours = document.createElement("td");
                        let elemAmount = document.createElement("td");
                        elemClass.textContent = additionalPayments[j].payClass;
                        elemRate.textContent = additionalPayments[j].rate.toFixed(4);
                        elemHours.textContent = additionalPayments[j].hours.toFixed(4);
                        elemAmount.textContent = "$" + additionalPayments[j].payAmount.toFixed(2);
                        payElementRow.appendChild(elemClass);
                        payElementRow.appendChild(elemRate);
                        payElementRow.appendChild(elemHours);
                        payElementRow.appendChild(elemAmount);
                        elementTable.appendChild(payElementRow);
                        totalValue += additionalPayments[j].payAmount;
                        if(additionalPayments[j].helpText) {
                            elemClass.addEventListener("click", function(){
                                $(".pay-element-table > tr").css("background-color", ""); //clear existing highlights
                                document.getElementById("helpDiv").innerHTML = additionalPayments[j].helpText;
                                payElementRow.style.backgroundColor = "#00000040"; //highlight clicked element
                                window.location.replace("#helpDiv"); //scroll to help box
                            });
                        }
                }
            }
            resultArea.appendChild(elementTable);
            resultArea.appendChild(document.createElement("hr"));
            let totalElement = document.createElement("h3");
            totalElement.setAttribute("id", "totalElement");
            totalElement.textContent = "Total Gross: $" + totalValue.toFixed(2);
            resultArea.appendChild(totalElement);
        }
        else {
            let shiftTitle = document.createElement("h3");
            shiftTitle.textContent = "Error displaying results: invalid view format '" + resultsViewFormat + "'";
            resultArea.appendChild(shiftTitle);
        }
        //element help tips
        let helpDiv = document.createElement("div");
        helpDiv.id = "helpDiv";
        helpDiv.innerHTML = "<p>Click or touch a <em>Pay Class</em> above to see its definition here!</p>";
        resultArea.appendChild(helpDiv);
    }
}

function updateDates() { //updates day of week fields
    let dayOfWeekFields = document.querySelectorAll(".day-of-week");
    let inputDate = $("#week-commencing-date").datepicker("getDate");
    if(!inputDate){ //if date invalid, blank the dates
        for(let i = 0; i < dayOfWeekFields.length; i++){
            dayOfWeekFields[i].innerHTML = daysOfWeek[i%7];
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

function ddoWeek() {
    for(let i = 0; i < shifts.length; i++) {
        if(shifts[i].ddo) return true;
    }
    return false;
}

//calculates pay elements for each shift in the shift table and places them into the pay table (shiftPay[])
function updateShiftPayTable() {
    let alShifts = [0, 0]; //[week1, week2]  //shifts counted as annual leave. designed to avoid using annual leave when sick or ph.
    let sickPhShifts = [0, 0]; //[week1, week2] //counters to keep track of shifts that would override an annual leave shift should there be a full week of annual leave
    let ordinaryHours = 8;
    if(getPayGrade() == "trainee") ordinaryHours = 7.6;
    shiftPay = []; //clear pay table
    additionalPayments = [];
    let weekNo = (day) => {
        if(day < 7) return 0;
        else return 1;
    }
    //pay calculation: pass 1. calculate everything except AL
    for(let day = 0; day < 14; day++) {
        let s = shifts[day]; //alias
        shiftPay.push([]);
        let shiftHours = s.hoursDecimal;
        if(shiftHours <= 0) { //if shift has zero hours
            if(s.al) {
                alShifts[weekNo(day)]++;
            }
            if(s.sick) {
                sickPhShifts[weekNo(day)]++;
                if(s.ph) {
                    shiftPay[day].push(new PayElement("phGaz", ordinaryHours));
                }
                else {
                    shiftPay[day].push(new PayElement("sick", ordinaryHours));
                }
            }
            else if(s.ph) {
                sickPhShifts[weekNo(day)]++;
                shiftPay[day].push(new PayElement("phGaz", ordinaryHours));
            }
        }
        else { //if shift has hours
            let todayNormalHours = 0.0;
            let tomorrowNormalHours = 0.0;
            let normalHours;
            let todayPhHours = 0.0;
            let tomorrowPhHours = 0.0;
            let tomorrowPh;

            //categorise hours into today/tomorrow and ph/nonPh
            if((day + 1) == 14) tomorrowPh = day14ph;
                else tomorrowPh = shifts[day + 1].ph;
            if(s.endHour48 > 23) {
                let todayHours = 24 - (s.startHour + (s.startMinute / 60));
                let tomorrowHours = (s.endHour48 - 24) + (s.endMinute / 60);
                if(s.ph) todayPhHours += todayHours;
                    else todayNormalHours += todayHours;
                if(tomorrowPh) tomorrowPhHours += tomorrowHours;
                    else tomorrowNormalHours += tomorrowHours;
            } 
            else if(s.ph) {
                todayPhHours += shiftHours;
            }
            else {
                todayNormalHours += shiftHours;
            }
            normalHours = todayNormalHours + tomorrowNormalHours;

            if(s.sick) {
                if(s.sick) shiftPay[day].push(new PayElement("sick", ordinaryHours)); //force 8 hours sick pay if sick pay set regardless of hours entered. TEMP BEHVIOUR until sick-part implemented.
            }
            else {
                //Public Holidays
                let phWorkedHours = 0.0;
                let phXpayHours = 0.0;
                if(todayPhHours > 0.0) {
                    phWorkedHours += todayPhHours;
                    if(s.phExtraPay || day == 0 || day == 7) phXpayHours += todayPhHours;
                }
                if(tomorrowPhHours > 0.0) {
                    phWorkedHours += tomorrowPhHours;
                    if(s.phExtraPay || day == 6 || day == 13) phXpayHours += tomorrowPhHours;
                }
                if(phWorkedHours > 0.0) {
                    shiftPay[day].push(new PayElement("phWorked", phWorkedHours, s.ojt));
                    shiftPay[day].push(new PayElement("phPen50", phWorkedHours, s.ojt));
                }
                if(phXpayHours > 0.0) shiftPay[day].push(new PayElement("phXpay", phXpayHours, s.ojt));

                //Normal hours
                if(s.shiftWorkedNumber <= 10 && normalHours > 0.0){ 
                    shiftPay[day].push(new PayElement("normal", Math.min(normalHours, ordinaryHours), s.ojt));
                }

                //Guarantee
                if(s.shiftWorkedNumber <= 10 && s.hoursDecimal < 8) {
                    if(getPayGrade() == "trainee") {
                        if(s.hoursDecimal < 7.6) {
                            let guaranteeHours = 7.6 - s.hoursDecimal;
                            shiftPay[day].push(new PayElement("guarantee", guaranteeHours, s.ojt));
                        }
                    }
                    else {
                        let guaranteeHours = 8 - s.hoursDecimal;
                        shiftPay[day].push(new PayElement("guarantee", guaranteeHours, s.ojt));
                    }
                }

                //Weekend Penalties
                if(s.shiftWorkedNumber <= 10) { //not OT shift only
                    if(day == 5 || day == 12) { //friday shift
                        if(tomorrowNormalHours > 0.0) { //time into saturday
                            shiftPay[day].push(new PayElement("wePen50", tomorrowNormalHours, s.ojt));
                        }
                    }
                    else if(day == 6 || day == 13) { //saturday shift
                        if(todayNormalHours > 0.0) { //saturday time
                            shiftPay[day].push(new PayElement("wePen50", todayNormalHours, s.ojt));
                        }
                        if(tomorrowNormalHours > 0.0) { //sunday time
                            shiftPay[day].push(new PayElement("wePen100", tomorrowNormalHours, s.ojt));
                        }
                    }
                    else if(day == 0 || day == 7) { //sunday
                        if(todayNormalHours > 0.0) { //sunday time
                            shiftPay[day].push(new PayElement("wePen100", todayNormalHours, s.ojt));
                        }
                    }
                }

                //Excess Hours Overtime
                let overtimeThreshold = 8; //hours worked before OT penalties begin
                if(getPayGrade() == "trainee") overtimeThreshold = 7.6; //adjust for trainee
                if(normalHours > overtimeThreshold) {
                    let overtimeHours = normalHours - overtimeThreshold;
                    if(overtimeHours > 3) {
                        shiftPay[day].push(new PayElement("rost+50", 3, s.ojt));
                        shiftPay[day].push(new PayElement("rost+100", overtimeHours - 3, s.ojt));
                    }
                    else {
                        shiftPay[day].push(new PayElement("rost+50", overtimeHours, s.ojt));
                    }
                    if(overtimeHours > 2) {
                        shiftPay[day].push(new PayElement("mealAllowance", 1));
                    }
                }

                //Excess Shift Overtime
                if(s.shiftWorkedNumber > 10){
                    let ot150Hours = 0.0;
                    let ot200Hours = 0.0;
                    if(day == 12 && tomorrowNormalHours > 0.0) { //friday with saturday time
                        ot150Hours += todayNormalHours;
                        ot200Hours += tomorrowNormalHours;
                    }
                    else if(day == 13 || s.shiftWorkedNumber > 12) { //saturday or 13th/14th shift
                        ot200Hours += normalHours;
                    }
                    else { //all other excess shifts
                        ot150Hours += normalHours;
                    }
                    if(ot150Hours > 0.0) shiftPay[day].push(new PayElement("ot150", Math.min(ot150Hours, ordinaryHours), s.ojt));
                    if(ot200Hours > 0.0) shiftPay[day].push(new PayElement("ot200", Math.min(ot200Hours, ordinaryHours), s.ojt));
                }

                //Shiftwork Allowances
                
                //calculate shiftwork allowances
                if(s.shiftWorkedNumber < 11 && day != 6 && day != 13) { //excess shifts and saturdays not eligible
                    let shiftworkHours = 0.0;
                    if((day == 0 || day == 7) && tomorrowNormalHours > 0.0) { //sunday into monday
                        shiftworkHours +=  tomorrowNormalHours;
                    }
                    else if((day == 5 || day == 12) && todayNormalHours > 0.0) { //friday into saturday
                        shiftworkHours += todayNormalHours;
                    }
                    else if([1,2,3,4,5,8,9,10,11,12].includes(day) && normalHours > 0.0) { 
                        shiftworkHours += normalHours;
                    }
                    shiftworkHours = Math.round(Math.min(shiftworkHours, 8)); //capped at 8 hours. rounded to nearest whole hour
                    if(shiftworkHours > 0.0) {
                        if(s.startHour == 4 || (s.startHour == 5 && s.startMinute <= 30)) { //early shift
                            shiftPay[day].push(new PayElement("earlyShift", shiftworkHours));
                        }
                        if(s.startHour < 18 && (s.endHour48 > 18 || (s.endHour48 == 18 && s.endMinute >= 30))) { //afternoon shift
                            shiftPay[day].push(new PayElement("afternoonShift", shiftworkHours));
                        }
                        if((s.startHour >= 18 && s.startHour <= 23) || (s.startHour >= 0 && s.startHour <= 3)) { //night shift
                            shiftPay[day].push(new PayElement("nightShift", shiftworkHours));
                        }
                    }
                }
            }
        }
        if(s.bonus) {
            if(s.bonusHours > 0) {
                shiftPay[day].push(new PayElement("bonusPayment", s.bonusHours)); 
            }
        }
        if(getPayGrade() != "trainee" && s.shiftWorkedNumber > 0) { //suburban allowance
            shiftPay[day].push(new PayElement("metroSig2", 1));
        }
        if(s.wm) { //wasted meal
            shiftPay[day].push(new PayElement("mealAllowance", 1));
        }   
    }

    //pay calculation: pass 2. determine and cap which days to pay annual leave on.
    //AL capped at 5 days per week, with any sick or PH-off day during annual leave to be paid in place of annual leave.
    for(let i = 0; i < 2; i++) {
        let endWeekDay = [7, 14];
        if(alShifts[i] > 0) {
            if(alShifts[i] > 5) alShifts[i] = 5; //cap at 5 annual leave shifts if more than 5 shifts are set to annual leave
            if(alShifts[i] + sickPhShifts[i] > 5) {
                alShifts[i] -= sickPhShifts[i]; //deduct any sick or PH-OFF shifts from annual leave count
            }
            for(let j = endWeekDay[i] - 7; j < endWeekDay[i]; j++) {
                if(shifts[j].al && (!shifts[j].ph || !shifts[j].sick) && alShifts[i] > 0) {
                    alShifts[i]--;
                    shiftPay[j].push(new PayElement("annualLeave", ordinaryHours));
                    shiftPay[j].push(new PayElement("leaveLoading", ordinaryHours));
                }
            }
        }
    }
    
    //pay calculation: DDO. determine how to pay DDO
    if(getPayGrade() != "trainee") {
        if(ddoWeek()) {
            additionalPayments.push(new PayElement("edo", 4));
        }
        else {
            additionalPayments.push(new PayElement("edo", -4));
        }
    }
}

function isWeekday(day) { //only for values 0-13. returns True outside of this range.
    switch(day) {
        case 0:
        case 6:
        case 7:
        case 13:
            return false;
        default:
            return true;
    }
}

function toggleKnownIssues() {
    $("#known-issues-ul").toggle();
}