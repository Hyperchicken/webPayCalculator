"use strict";

const calcVersion = "0.71";
const calcLastUpdateDate = "07/01/2020";

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
const phcColour = "#3d1cb3";
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
        this.phc = false; //public holiday credit day off
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
            case "phCredit": return 32;
            case "edo": return 35;
            case "leaveLoading": return 50;
            default:
                console.warn("PayElement.sortIndex: no sort index for pay type \"" + this.payType + "\"");
                return 1000;
        }
    }

    get payAmount() {
        return parseFloat((this.rate * parseFloat(this.hours.toFixed(4))).toFixed(2));
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
            case "phCredit": payClassName = "PH Credit"; break;
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
                + "<p><em>Guaranteed</em> pay up to Ordinary Hours (7.6 hours for Trainees, Part-Time and Job Share. Otherwise 8 hours.).</p>"
                + "<ul><li>First 10 worked shifts eligible.</li>"
                + "<li>Paid only on <em>Normal</em> hours (ie. not Public Holidays, shiftwork penalties, etc...).</li>"
                + "</ul>";
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
                + "<p>Overtime worked on a Sunday is also paid at this rate.</p>"
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
            case "phCredit": tooltipText = "<strong>PH Credit</strong>"
            + "<p><em>Publc Holiday Credit.</em> Day off taken in lieu of a worked public holiday where extra-leave was accrued.</p>";
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
            case "phCredit":
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

    let timeFields = document.querySelectorAll(".time");
    for(let i = 0; i < timeFields.length; i++) {
        timeFields[i].addEventListener("blur", function(){
            validateTimeFields();
        });
    }
    //setup datepicker
    let evenPayWeekYears = [2018, 2019, 2020];
    let oddPayWeekYears = [2021];
    let daysSinceLastWeekCommencing = () => {
        let todaysDate = new Date();
        let daysDifference = (todaysDate.getDay()) * -1;
        if(evenPayWeekYears.includes(todaysDate.getFullYear())) {
            if(todaysDate.getWeek() % 2 == 1) {//if not pay week
                if (todaysDate.getDay() == 0) return -14;
                else return daysDifference - 7;
            }
            else {
                if (todaysDate.getDay() == 0) return -7;
                else return daysDifference - 14;
            }   
        }
        else if(oddPayWeekYears.includes(todaysDate.getFullYear())) {
            if(todaysDate.getWeek() % 2 == 0) {//if not pay week
                if (todaysDate.getDay() == 0) return -14;
                else return daysDifference - 7;
            }
            else {
                if (todaysDate.getDay() == 0) return -7;
                else return daysDifference - 14;
            }   
        }
        else {
            console.warn("datepicker defaultDate: Unable to automatically select a date to place into week-commencing date field.");
            return ((new Date().getDay()) * -1) -14; //return last fortnight sunday, even if not a pay week
        }
    }
    //((new Date().getDay()) * -1) -14
    $("#week-commencing-date").datepicker({
        dateFormat: "d/m/yy",
        altField: "#date-button",
        firstDay: 0,
        defaultDate: daysSinceLastWeekCommencing(),
        beforeShowDay: function(date){ //Restrict calendar date selection to only first day of the fortnight.
            if(date.getDay() == 0) { //set which week is a valid 'week commencing' week
                if(evenPayWeekYears.includes(date.getWeekYear()) && date.getWeek() % 2 == 1) {
                    return [true , "" ];
                }
                else if (oddPayWeekYears.includes(date.getWeekYear()) && date.getWeek() % 2 == 0) {
                    return [true , "" ];
                }
                else if (!evenPayWeekYears.includes(date.getWeekYear()) && !oddPayWeekYears.includes(date.getWeekYear())) return [true , "" ];
            }
            return [false, "" ];
        },
        onSelect: function(){
            updateDates();
            loadSavedData();
            updateGrade();
            updateShiftTable();
            updateShiftWorkedCount();
            printShiftHours();
            validateTimeFields();
            updateOptionsButtons();
            updateShiftPayTable();
            updateResults();
            toggleDatepicker();
        }
    });
    //update any existing data on page load
    updateDates();
    loadSavedData(); //load any save data (previously entered data, attatched to the set date)
    updateGrade();
    updateShiftTable();
    updateShiftWorkedCount();
    printShiftHours();
    validateTimeFields()
    updateOptionsButtons();
    updateShiftPayTable();
    updateResults();

    //dropdown menu event listeners
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
    $("#helpMenuButton").on("click", function(){
        topHelpBoxPreset("gettingStarted");
        closeMenu();
        $(".dropbtn").removeClass("active");
    });
    $("#resetMenuButton").on("click", function(){
        if(confirm("Clear sign-on/off times and shift options for the current fortnight?")) {
            resetForm();
        }
        closeMenu();
    });
    $("#saveInfoMenuButton").on("click", function(){
        topHelpBoxPreset("saveInfo");
        closeMenu();
    });
    $("#deleteSaveMenuButton").on("click", function(){
        topHelpBoxPreset("deleteSave");
        closeMenu();
    });
    $("#changelogMenuButton").on("click", function(){
        topHelpBoxPreset("changelog");
        closeMenu();
    });
    $("#aboutMenuButton").on("click", function(){
        topHelpBoxPreset("about");
        closeMenu();
    });
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn') && !event.target.matches('.dropbtn-icon')) {
            closeMenu();
        }
    } 

    //top helpbox close button
    $(".helpbox-close-button").on("click", function(){
        $("#topHelpDiv").removeClass("show-top-helpbox");
    });

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

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }
  
  // Returns the four-digit year corresponding to the ISO week of the date.
  Date.prototype.getWeekYear = function() {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
  }

//toggles if Day 14 (sunday after last day of fortnight) is a public holiday
function toggleDay14ph() {
    if(day14ph) {
        day14ph = false;
        setSaveData("day14ph", "false");
    }
    else {
        day14ph = true;
        setSaveData("day14ph", "true");
    }
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
            let offButton = true;
            if(s.ddo) {
                setButton("DDO-OFF", ddoColour);
                offButton = false;
            }
            if(s.sick) {
                setButton("Sick", sickColour);
                offButton = false;
            }
            if(s.al) {
                setButton("A/Leave", alColour);
                offButton = false;
            }
            if(s.phc) {
                setButton("PH&nbspCredit", phcColour);
                offButton = false;
            }
            if(s.ph) {
                setButton("PH-OFF", phColour);
                offButton = false;
            }
            if(s.wm) {
                setButton("Wasted&nbspMeal", wmColour);
                offButton = false;
            }
            if(s.bonus && s.bonusHours > 0.0) {
                setButton("Bonus&nbspPay", bonusColour);
                offButton = false;
            }
            if(offButton) {
                if(s.ojt || (s.bonus && s.bonusHours <= 0.0)) {
                    setButton("OFF&nbsp(+)", "black");
                }
                else {
                    setButton("OFF", "black");
                }
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

    const saveToStorage = (name, value) => {
        setSaveData("day" + day + name, value);
    }

    //OJT button
    let ojtButton = document.createElement("a");
    ojtButton.textContent = "OJT";
    ojtButton.setAttribute("class", "button ojt-button shelf-button");
    if(shifts[day].ojt) {//if OJT
        ojtButton.addEventListener("click", function(){
            shifts[day].ojt = false;
            reloadPageData();
            saveToStorage("ojt", "false");
        });
        ojtButton.style.background = "";
    }
    else {//if not OJT
        ojtButton.addEventListener("click", function(){
            shifts[day].ojt = true;
            reloadPageData();
            saveToStorage("ojt", "true");
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
            saveToStorage("ddo", "false");
        });
        ddoButton.style.background = "";
    }
    else {//if not DDO
        ddoButton.addEventListener("click", function(){
            shifts[day].ddo = true;
            reloadPageData();
            saveToStorage("ddo", "true");
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
            saveToStorage("ph", "false");
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
                        saveToStorage("phxp", "false");
                    });
                    xLeaveButton.style.background = buttonBackgroundColour;
                    xPayButton.style.background = "";
                } else {
                    xPayButton.addEventListener("click", function() {
                        shifts[day].phExtraPay = true;
                        reloadPageData();
                        saveToStorage("phxp", "true");
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
                saveToStorage("phxp", "true");
            }
            reloadPageData();
            saveToStorage("ph", "true");
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
            saveToStorage("wm", "false");
        });
        wmButton.style.background = "";
    }
    else {//if not WM
        wmButton.addEventListener("click", function(){
            shifts[day].wm = true;
            reloadPageData();
            saveToStorage("wm", "true");
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
            saveToStorage("sick", "false");
        });
        sickButton.style.background = "";
    }
    else {//if not sick
        sickButton.addEventListener("click", function(){
            shifts[day].sick = true;
            reloadPageData();
            saveToStorage("sick", "true");
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
            saveToStorage("al", "false");
        });
        alButton.style.background = "";
    }
    else {//if not AL
        alButton.addEventListener("click", function(){
            shifts[day].al = true;
            reloadPageData();
            saveToStorage("al", "true");
        });
        alButton.style.background = buttonBackgroundColour;
    }

    //PH Credit button
    let phcButton = document.createElement("a");
    phcButton.textContent = "PH Credit";
    phcButton.setAttribute("class", "button phc-button shelf-button");
    if(shifts[day].phc) {//if phc
        phcButton.addEventListener("click", function(){
            shifts[day].phc = false;
            reloadPageData();
            saveToStorage("phc", "false");
        });
        phcButton.style.background = "";
    }
    else {//if not phc
        phcButton.addEventListener("click", function(){
            shifts[day].phc = true;
            reloadPageData();
            saveToStorage("phc", "true");
        });
        phcButton.style.background = buttonBackgroundColour;
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
            saveToStorage("bonus", "false");
        });
        bonusTextbox.addEventListener("input", function(){
            if(this.validity.valid && parseFloat(this.value)) { //only accept valid input for bonus hours.
                shifts[day].bonusHours = parseFloat(this.value);
                saveToStorage("bonusHours", parseFloat(this.value).toString());
            }
            else {
                shifts[day].bonusHours = 0.0;
                saveToStorage("bonusHours", "0");
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
            saveToStorage("bonus", "true");
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
    shelf.appendChild(phcButton);
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
    setSaveData("field" + field.toString(), timeField()[field].value);
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
            setSaveData("paygrade", "spot", false);
            setSaveData("paygrade", "spot");
            $("#payClassWarning").hide();
            break;
        case "level1":
            selectedGradeRates = driverLevel1Rates;
            setFormColour("rgb(114, 99, 191)");
            setSaveData("paygrade", "level1", false);
            setSaveData("paygrade", "level1");
            $("#payClassWarning").hide();
            break;
        case "trainee":
            selectedGradeRates = traineeRates;
            setFormColour("rgb(56, 149, 149)");
            setSaveData("paygrade", "trainee", false);
            setSaveData("paygrade", "trainee");
            $("#payClassWarning").show();
            break;
        case "conversion":
            selectedGradeRates = conversionRates;
            setFormColour("rgb(207, 133, 50)");
            setSaveData("paygrade", "conversion", false);
            setSaveData("paygrade", "conversion");
            $("#payClassWarning").show();
            break;
        default: 
            selectedGradeRates = undefined;
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
    groupedElements.sort(function(a,b){return a.sortIndex - b.sortIndex}); //sort pay elements according to defined sort order (defined in Pay Elements class)

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
                if(e.helpText) {
                    elemClass.addEventListener("click", function(){
                        $(".pay-element-table > tr").css("background-color", ""); //clear existing highlights
                        $(".hoursWorked").css("background-color", "");
                        document.getElementById("resultsHelpDiv").innerHTML = e.helpText;
                        payElementRow.style.backgroundColor = "#00000040"; //highlight clicked element
                        window.location.replace("#resultsHelpDiv"); //scroll to help box
                    });
                }
            });
            listDiv.appendChild(elementTable);
            resultArea.appendChild(listDiv);
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
                        if(shiftPay[i][j].helpText) {
                            elemClass.addEventListener("click", function(){
                                $(".pay-element-table > tr").css("background-color", ""); //clear existing highlights
                                $(".hoursWorked").css("background-color", "");
                                document.getElementById("resultsHelpDiv").innerHTML = shiftPay[i][j].helpText;
                                payElementRow.style.backgroundColor = "#00000040"; //highlight clicked element
                                window.location.replace("#resultsHelpDiv"); //scroll to help box
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
                        elemClass.classList.add("pay-element-class");
                        elemClass.textContent = additionalPayments[j].payClass;
                        elemRate.textContent = additionalPayments[j].rate.toFixed(4);
                        elemHours.textContent = additionalPayments[j].hours.toFixed(4);
                        elemAmount.textContent = "$" + additionalPayments[j].payAmount.toFixed(2);
                        payElementRow.appendChild(elemClass);
                        payElementRow.appendChild(elemRate);
                        payElementRow.appendChild(elemHours);
                        payElementRow.appendChild(elemAmount);
                        elementTable.appendChild(payElementRow);
                        if(additionalPayments[j].helpText) {
                            elemClass.addEventListener("click", function(){
                                $(".pay-element-table > tr").css("background-color", ""); //clear existing highlights
                                $(".hoursWorked").css("background-color", "");
                                document.getElementById("resultsHelpDiv").innerHTML = additionalPayments[j].helpText;
                                payElementRow.style.backgroundColor = "#00000040"; //highlight clicked element
                                window.location.replace("#resultsHelpDiv"); //scroll to help box
                            });
                        }
                }
            }
            resultArea.appendChild(elementTable);
        }
        else {
            let shiftTitle = document.createElement("h3");
            shiftTitle.textContent = "Error displaying results: invalid view format '" + resultsViewFormat + "'";
            resultArea.appendChild(shiftTitle);
        }

        resultArea.appendChild(document.createElement("hr"));

        //hours paid
        let hoursPaid = 0.0;

        //subtotal
        let totalValue = 0.0; 
        groupedElements.forEach(function(e){
            totalValue += e.payAmount;
        });
        let totalElement = document.createElement("h3");
        totalElement.setAttribute("id", "totalElement");
        totalElement.textContent = "Total Gross: $" + totalValue.toFixed(2);
        resultArea.appendChild(totalElement);

        //actual hours worked
        let actualHoursWorked = 0.0;
        groupedElements.forEach(function(e){
            if(["normal", "phWorked", "ot150", "ot200", "rost+50", "rost+100"].includes(e.payType)) actualHoursWorked += e.hours;
        });
        let actualHoursWorkedElement = document.createElement("p");
        actualHoursWorkedElement.classList.add("hoursWorked")
        actualHoursWorkedElement.textContent = "Physical Hours Worked: " + actualHoursWorked.toFixed(2);
        resultArea.appendChild(actualHoursWorkedElement);
        actualHoursWorkedElement.addEventListener("click", function(){
            $(".pay-element-table > tr").css("background-color", ""); //clear existing highlights
            $(".hoursWorked").css("background-color", "");
            actualHoursWorkedElement.style.backgroundColor = "#00000040"; //highlight clicked element
            document.getElementById("resultsHelpDiv").innerHTML = "<strong>Physical Hours Worked</strong><p>Reflects the hours spent physically at work and NOT what is displayed on the payslip's 'Hours worked' section." 
            + " The payslip includes time that wasn't really worked, including Guarantee and A/Leave.</p>";
            window.location.replace("#resultsHelpDiv"); //scroll to help box
        });

        //payslip hours worked
        let payslipHoursWorked = 0.0;
        groupedElements.forEach(function(e){
            if(["normal", "phWorked", "phGaz", "nonRosPh", "sick", "ot150", "ot200", "rost+50", "rost+100", "annualLeave", "guarantee", "edo", "bonusPayment", "phCredit"].includes(e.payType)) payslipHoursWorked += e.hours;
        });
        let payslipHoursWorkedElement = document.createElement("p");
        payslipHoursWorkedElement.classList.add("hoursWorked");
        payslipHoursWorkedElement.textContent = "Payslip Hours Worked: " + payslipHoursWorked.toFixed(2);
        resultArea.appendChild(payslipHoursWorkedElement);
        payslipHoursWorkedElement.addEventListener("click", function(){
            $(".pay-element-table > tr").css("background-color", ""); //clear existing highlights
            $(".hoursWorked").css("background-color", "");
            payslipHoursWorkedElement.style.backgroundColor = "#00000040"; //highlight clicked element
            document.getElementById("resultsHelpDiv").innerHTML = "<strong>Payslip Hours Worked</strong><p>Calculates the value that appears in the <em>Hours Worked</em> section on the <em>payslip</em>." 
            + " This includes time that wasn't physically worked such as Guarantee, A/Leave, and even EDO (+ and -)!.</p> <p>Use <em>Payslip Hours Worked</em> to compare with the <em>Hours Worked</em> section on your payslip.</p>";
            window.location.replace("#resultsHelpDiv"); //scroll to help box
        });
        
        //element help tips
        let resultsHelpDiv = document.createElement("div");
        resultsHelpDiv.id = "resultsHelpDiv";
        resultsHelpDiv.innerHTML = "<p>Click or touch a <em>Pay Class</em> above to see its definition here!</p>";
        resultArea.appendChild(resultsHelpDiv);
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

function topHelpBox(title, helpText) {
    document.getElementById("helpboxTitle").textContent = title;
    document.getElementById("helpboxContent").innerHTML = helpText;
    $("#topHelpDiv").addClass("show-top-helpbox");
}

function topHelpBoxPreset(presetName) {
    let helpTitle = "";
    let helpText = "";
    switch(presetName) {
        case "gettingStarted":
            helpTitle = "Help Guide";
            helpText = "<p><strong>Fornight Commencing</strong><br />Set the <em>Fortnight Commencing</em> by clicking on the date box (with the <i class='far fa-calendar-alt'></i> icon), then use the date-picker that appears to select the first Sunday of the fortnight you wish to calculate your pay. The date that is selected as the <em>Fortnight Commencing</em> date is used for two purposes: determining the base pay-rate the calculator will use, and saving the data you have entered to the selected date. See <a href='javascript:topHelpBoxPreset(\"saveInfo\");'>Data Saving Info</a> for more information.</p>"
            + "<p><strong>Shift Input</strong><br />There are two parts to entering the details for each shift: <em>Shift Options</em> and <em>Sign-On/Sign-Off times</em>. You can set either in any order, you don't need to put shift times in first or vice-versa."
            + "<ul><li>To set shift options, click the shift options button (looks like this: <a class=\"button\" style=\"background-color: black; display: inline-block; border: none; cursor: default;\"><span style=\"font-weight: bold;\">OFF</span><i class=\"button-icon fas fa-lg fa-angle-down\"></i></a> or <a class=\"button\" style=\"background-color: #00b9e8; display: inline-block; border: none; cursor: default;\"><span style=\"font-weight: bold;\">Normal</span><i class=\"button-icon fas fa-lg fa-angle-down\"></i></a>)"
            + ", then click the relevant options to toggle them on and off for that shift.</li>"
            + "<li>Enter sign-on and off times as four-digit 24-hour time with no colon, for example: 0330 or 2100</li></ul></p>"
            + "<p><strong>DDOs and Public Holidays: Worked or OFF?</strong>"
            + "<br />There is no separate button to distinguish OFF vs. Worked shifts. The calculator determines if your DDO or PH is worked or OFF depending on if you have entered sign-on and sign-off times for that day. For instance, if you worked your DDO, set the DDO shift option and enter valid sign-on and sign-off times for that shift.</p>"
            + "<p><strong>Results</strong><br />Results from the calculation appear as you enter in each of your shifts. You can view the results in two ways: <em>Grouped</em> or <em>Split</em>. <em>Grouped</em> is the default view and shows each of the pay elements like they would appear on your payslip, while <em>split</em> view will divide the results into individual days."
            + " You can also click/tap on any of the pay elements to view an explanation of that pay element.</p>";
            break;
        case "deleteSave":
            helpTitle = "Delete Save Data";
            helpText = "<p>The following button will delete all calculator save data that is stored in the current browser. Shift sign-on/sign-off times and shift-options for all dates will be deleted. It is not possible to undo this action.</p>"
            + "<p><a class='button delete-save-button' onclick='confirmDeleteData()'>Delete All Save Data</a><p>";
            break;
        case "saveInfo":
            helpTitle = "About Data Saving";
            helpText = "<p>All shift-times and shift-options entered are automatically saved to the currently selected 'Fortnight Commencing' date. In other words, the calculator will remember all the details you enter every time you use it."
            + "<br />Data saving allows you to do things like enter in shifts as you go, so you don't have to enter them all at once at the end of a pay cycle. You can also change the Fortnight Commencing date to load any data you entered in a different fortnight! </p>"
            + "<p>Some extra things to know about the data saving feature:</p>"
            + "<ul><li>There is no 'save button'. Everything is saved instantly and automatically.</li>"
            + "<li>Data is saved locally to your web browser and not sent anywhere over the internet.</li>"
            + "<li>Saved data will <strong>not</strong> carry over to a different web browser or device.</li>"
            + "<li>Using incognito/private browsing mode will prevent data saving.</li>"
            + "<li>Clearing your browser's cookies will delete any saved data.</li>"
            + "</ul>";
            break;
        case "about":
            helpTitle = "About the pay calculator";
            helpText = "<p>A web-based calculator tool to help you check if you've been paid correctly!</p>"
            + "<p>While I've taken care to try and make this calculator accurate, I cannot guarantee that it will be perfect. Some parts of the EA can be interpreted with ambiguity and debated, bugs in the code may be present, and not all scenarios are covered by this calculator."
            + "<br />If you notice any problems with the calculator, I'd love to hear about it. Find me on the Facebook page <i class='far fa-grin-alt'></i></p>"
            + "<ul>"
            + "<li>Developed by Petar Stankovic</li>"
            + "<li>Version: " + calcVersion + "</li>"
            + "<li>Last Update: " + calcLastUpdateDate +"</li>"
            + "</ul>";
            break;
        case "changelog":
            helpTitle = "Changelog and Known Issues";
            helpText = "<ul><strong>Known Issues</strong>"
            + "<li>Conversion and Trainee calculations not yet verified. Likely to be inaccurate.</li>"
            + "<li>Page doesn't fit correctly on some devices with smaller screens.</li>"
            + "</ul><ul><strong>Latest Updates</strong>"
            + "<li>01/01/2020 🎆 - Version 0.71<ul>"
            + "<li>Transfer to new domain warning. This version is only for the old domain.</li>"
            + "<li>01/01/2020 🎆 - Version 0.70<ul>"
            + "<li>Adjusted results table alignment.</li>"
            + "<li>Fixed Bonus Pay button text colour bug.</li>"
            + "<li>Various text/phrasing adjustments and corrections.</li>"
            + "<li>Added temporary warning for Trainee and Conversion pay-grades.</li>"
            + "</ul></li>"
            + "<li>20/12/2019 - Version 0.67<ul>"
            + "<li>Added new title bar and menu with several new guides and options.</li>"
            + "<li>Added bookmark icons.</li>"
            + "<li>Added PH Credit leave shift option.</li>"
            + "<li>Fixed DDO during Annual Leave calculation issue.</li>"
            + "<li>Improved 'Hours Worked' section.</li>"
            + "</ul></li>"
            + "<li>18/11/2019 - Version 0.66<ul>"
            + "<li>Adjusted rounding behaviour and fixed input validation highlighting bug when changing dates.</li>"
            + "<li>Added 'hours worked'. The payslip's 'hours worked' does not reflect the real hours worked (it includes guarantee and annual leave for some reason??). I'll expand on this in a future update.</li>"
            + "<li>Pay grades now save to the selected date.</li>"
            + "<li>Fixed calculation error when working overtime on a Sunday past midnight.</li>"
            + "<li>Added more visual time input validation.</li>"
            + "<li>Restricted date selection to fortnightly instead of weekly.</li>"
            + "</ul></li>"
            + "</ul>"
            break;
        case "newDomainWarning":
            helpTitle = "New Page Address";
            helpText = "<p><i class='fas fa-exclamation-circle fa-2x' style='color: lightcoral; margin: 0 5px 5px 0; float: left;'></i>This Pay Calculator is moving to a new web address: <a href='https://hyperchicken.com/paycalc'>hyperchicken.com/paycalc</a>."
            + " Please begin using the new web address to access this pay calculator as the one at <em>exetel.com.au</em> will <strong>no longer be updated</strong>, will pop-up with this semi-annoying message every time, and will soon be decommissioned.</p>"
            + "<p>Please note that any saved data will not automatically transfer across to the new page. You will need to manually enter any historical shifts into the new page if you so desire."
            + "<br /> Also remember to update any bookmarks to the new address!</p>";
            break;
        default:
            console.warn("topHelpBoxPreset(): invalid preset '" + presetName + "'");
    }
    topHelpBox(helpTitle, helpText);
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
    let timeField = document.querySelectorAll(".time");
    for(let i = 0; i < shifts.length; i++) {
        if(timeField[i*2].checkValidity() && timeField[(i*2)+1].checkValidity() && !(timeField[i*2].value == timeField[(i*2)+1].value && timeField[i*2].value != "")) {
            hoursField[i].innerHTML = shifts[i].hoursString;
        }
    }
}

function validateTimeFields() {
    let hoursField = document.querySelectorAll(".shift-hours");
    let timeField = document.querySelectorAll(".time");
    for(let i = 0; i < shifts.length; i++) {
        let errorSpan = document.createElement("span");
        let errorIcon = document.createElement("i");
        let errorPopup = document.createElement("span");
        errorSpan.className = "popup";
        errorIcon.className = "fas fa-exclamation-triangle fa-lg yellow-colour";
        errorSpan.addEventListener("click", function(){
            errorPopup.classList.toggle("show");
        });
        errorPopup.className = "popuptext";
        errorPopup.textContent = "Sign-on and sign-off times must be 4 digits and between 0000 and 2359";
        errorSpan.appendChild(errorIcon);
        errorSpan.appendChild(errorPopup);
        if(!timeField[i*2].checkValidity() || !timeField[(i*2)+1].checkValidity()) {
            hoursField[i].innerHTML = "";
            hoursField[i].appendChild(errorSpan);
        }
        if(!timeField[i*2].checkValidity()) {
            timeField[i*2].style.backgroundColor = "#ffd4d4";
        } 
        else {
            timeField[i*2].style.backgroundColor = "";
        }
        if(!timeField[(i*2)+1].checkValidity()) {
            timeField[(i*2)+1].style.backgroundColor = "#ffd4d4";
        } 
        else {
            timeField[(i*2)+1].style.backgroundColor = "";
        }
        if(timeField[i*2].value == timeField[(i*2)+1].value && timeField[i*2].value != "") {
            timeField[i*2].style.backgroundColor = "#ffd4d4";
            timeField[(i*2)+1].style.backgroundColor = "#ffd4d4";
            hoursField[i].innerHTML = "";
            errorPopup.textContent = "Sign-on and sign-off time cannot be the same"
            hoursField[i].appendChild(errorSpan);
        }
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
    let deductLeaveShifts = [0, 0]; //[week1, week2] //counters to keep track of shifts that would override an annual leave shift should there be a full week of annual leave
    let ordinaryHours = 8;
    let alDdoDeducted = false;
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
                deductLeaveShifts[weekNo(day)]++;
                if(s.ph) {
                    shiftPay[day].push(new PayElement("phGaz", ordinaryHours));
                }
                else {
                    shiftPay[day].push(new PayElement("sick", ordinaryHours));
                }
            }
            else if(s.ph) {
                deductLeaveShifts[weekNo(day)]++;
                shiftPay[day].push(new PayElement("phGaz", ordinaryHours));
            }
            else if(s.phc) {
                deductLeaveShifts[weekNo(day)]++;
                shiftPay[day].push(new PayElement("phCredit", ordinaryHours));
            }
            if(s.ddo && !alDdoDeducted) {
                deductLeaveShifts[weekNo(day)]++;
                alDdoDeducted = true;
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
                            shiftPay[day].push(new PayElement("wePen50", Math.min(tomorrowNormalHours, ordinaryHours), s.ojt));
                        }
                    }
                    else if(day == 6 || day == 13) { //saturday shift
                        let penaltyTimeRemaining = ordinaryHours;
                        if(todayNormalHours > 0.0) { //saturday time
                            shiftPay[day].push(new PayElement("wePen50", Math.min(todayNormalHours, ordinaryHours), s.ojt));
                            penaltyTimeRemaining -= todayNormalHours;
                        }
                        if(tomorrowNormalHours > 0.0 && penaltyTimeRemaining > 0.0) { //sunday time
                            shiftPay[day].push(new PayElement("wePen100", Math.min(penaltyTimeRemaining, ordinaryHours), s.ojt));
                        }
                    }
                    else if(day == 0 || day == 7) { //sunday
                        if(todayNormalHours > 0.0) { //sunday time
                            shiftPay[day].push(new PayElement("wePen100", Math.min(todayNormalHours, ordinaryHours), s.ojt));
                        }
                    }
                }

                //Excess Hours Overtime
                if(normalHours > ordinaryHours) {
                    let overtimeHours = normalHours - ordinaryHours;
                    let todayOvertimeHours = 0.0;
                    let tomorrowOvertimeHours = 0.0;
                    let rost50hours = 0.0;
                    let rost100hours = 0.0;
                    if(todayNormalHours > ordinaryHours){
                        todayOvertimeHours = todayNormalHours - ordinaryHours;
                    }
                    tomorrowOvertimeHours = overtimeHours - todayOvertimeHours;
                    if((day == 6 || day == 13) && tomorrowOvertimeHours > 0.0) {
                        if(todayOvertimeHours > 3) {
                            rost50hours = 3;
                            rost100hours = overtimeHours - 3;
                        }
                        else {
                            rost50hours = todayOvertimeHours;
                            rost100hours = tomorrowOvertimeHours;
                        }
                    }
                    else if(day == 0 || day == 7 && todayOvertimeHours > 0.0) {
                        if(overtimeHours > 3) {
                            rost100hours = todayOvertimeHours;
                            rost50hours = Math.max(0, 3 - todayOvertimeHours)
                            rost100hours += tomorrowOvertimeHours - rost50hours;
                        }
                        else {
                            rost50hours = tomorrowOvertimeHours;
                            rost100hours = todayOvertimeHours
                        }
                    }
                    else {
                        if(overtimeHours > 3) {
                            rost50hours = 3;
                            rost100hours = overtimeHours - 3;
                        }
                        else {
                            rost50hours = overtimeHours;
                        }
                    }

                    if(rost50hours > 0.0) shiftPay[day].push(new PayElement("rost+50", rost50hours, s.ojt));
                    if(rost100hours > 0.0) shiftPay[day].push(new PayElement("rost+100", rost100hours, s.ojt));
                    if(overtimeHours > 2) shiftPay[day].push(new PayElement("mealAllowance", 1));
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
            if(alShifts[i] + deductLeaveShifts[i] > 5) {
                alShifts[i] -= deductLeaveShifts[i]; //deduct any sick or PH-OFF shifts from annual leave count
            }
            for(let j = endWeekDay[i] - 7; j < endWeekDay[i]; j++) {
                if(shifts[j].al && (!shifts[j].ph && !shifts[j].sick && !shifts[j].phc && !shifts.ddo) && alShifts[i] > 0) {
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

//data storage
//function to check if browser storage is available
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

//save a single data to local storage, automatically appending the week commencing prefix.
function setSaveData(field, value, prefixDate = true) {
    if(!storageAvailable('localStorage')) {
        console.alert("setSaveData: no local storage available!");
    }
    else {
        let weekCommencingDate = $("#week-commencing-date").datepicker("getDate");
        let datePrefix = "";
        if(prefixDate){ //date will be automatically prefixed to save key unless specified in parameters. date prefix binds the save data to the currently set date.
            datePrefix += weekCommencingDate.getFullYear().toString() + (weekCommencingDate.getMonth() + 1).toString().padStart(2, "0") + weekCommencingDate.getDate().toString();
        }
        if(value === "" || value === "false") {
            localStorage.removeItem(datePrefix + field);
            //console.debug("setSaveData(): Data deleted! " + datePrefix + field);
        }
        else {
            try {
                localStorage.setItem((datePrefix + field), value);
                //console.debug("setSaveData(): Data saved! " + datePrefix + field + ":" + value);
            }
            catch(ex) {
                console.warn("setSaveData(): unable to save data. exception thrown:");
                console.warn(ex.message)
            }
        }
    }
}

function getSaveData(field, prefixDate = true) {
    let weekCommencingDate = $("#week-commencing-date").datepicker("getDate");
    let datePrefix = "";
    if(prefixDate){ //date will be automatically prefixed to save key unless specified in parameters. date prefix binds the save data to the currently set date.
        datePrefix += weekCommencingDate.getFullYear().toString() + (weekCommencingDate.getMonth() + 1).toString().padStart(2, "0") + weekCommencingDate.getDate().toString();
    }
    //console.debug("getSaveData(): getting save data: " + datePrefix + field + ":" + localStorage.getItem((datePrefix + field)));
    return localStorage.getItem((datePrefix + field));
}

//populates fields with any saved data on the selected date. using no date parameter will load from the current date.
function loadSavedData(datePrefix = "") {
    closeAllOptionsShelves();
    //first reset all shifts
    shifts = [];
    for (let i = 0; i < 14; i++) shifts.push(new Shift());

    if(datePrefix === "") {
        let weekCommencingDate = $("#week-commencing-date").datepicker("getDate");
        datePrefix += weekCommencingDate.getFullYear().toString() + (weekCommencingDate.getMonth() + 1).toString().padStart(2, "0") + weekCommencingDate.getDate().toString();
    }
    let savedPayGrade = getSaveData("paygrade");
    if(savedPayGrade == null) savedPayGrade = getSaveData("paygrade", false);
    switch(savedPayGrade) {
        case "spot":
            document.forms.payGradeForm.payGrade[0].checked = true;
            break;
        case "level1":
            document.forms.payGradeForm.payGrade[1].checked = true;
            break;
        case "trainee":
            document.forms.payGradeForm.payGrade[2].checked = true;
            break;
        case "conversion":
            document.forms.payGradeForm.payGrade[3].checked = true;
            break;
    }
    //shift options save data
    for(let day = 0; day < 14; day++) {
        let ojtSave = getSaveData("day" + day + "ojt");
        let ddoSave = getSaveData("day" + day + "ddo");
        let wmSave = getSaveData("day" + day + "wm");
        let sickSave = getSaveData("day" + day + "sick");
        let phSave = getSaveData("day" + day + "ph");
        let phxpSave = getSaveData("day" + day + "phxp");
        let alSave = getSaveData("day" + day + "al");
        let phcSave = getSaveData("day" + day + "phc")
        let bonusSave = getSaveData("day" + day + "bonus");
        let bonusHoursSave = getSaveData("day" + day + "bonusHours");

        if(ojtSave == "true") shifts[day].ojt = true;
        if(ddoSave == "true") shifts[day].ddo = true;
        if(wmSave == "true") shifts[day].wm = true;
        if(sickSave == "true") shifts[day].sick = true;
        if(phSave == "true") shifts[day].ph = true;
        if(phxpSave == "true") shifts[day].phExtraPay = true;
        if(alSave == "true") shifts[day].al = true;
        if(phcSave == "true") shifts[day].phc = true;
        if(bonusSave == "true") shifts[day].bonus = true;
        if(bonusHoursSave) shifts[day].bonusHours = parseFloat(bonusHoursSave);
    }

    //shift times save data
    for(let field = 0; field < 28; field++) {
        let saveData = getSaveData("field" + field);
        if(saveData) timeField()[field].value = saveData;
        else timeField()[field].value = "";
    }

    let day14phSave = getSaveData("day14ph");
    if(day14phSave == "true") day14ph = true;
    else day14ph = false;
}

function confirmDeleteData() {
    if(confirm("Are you sure you want to delete ALL of your saved data from ALL dates?")){
        localStorage.clear();
        alert("All save data has been deleted!");
        location.reload();
    }
}

function resetForm() {
    for(let field = 0; field < 28; field++) {
        timeField()[field].value = "";
        setSaveData("field" + field.toString(), timeField()[field].value);
    }
    for(let day = 0; day < 14; day++) {
        setSaveData("day" + day + "ojt", "");
        setSaveData("day" + day + "ddo", "");
        setSaveData("day" + day + "wm", "");
        setSaveData("day" + day + "sick", "");
        setSaveData("day" + day + "ph", "");
        setSaveData("day" + day + "phxp", "");
        setSaveData("day" + day + "al", "");
        setSaveData("day" + day + "phc", "")
        setSaveData("day" + day + "bonus", "");
        setSaveData("day" + day + "bonusHours", "");
        

        shifts[day].ojt = false;
        shifts[day].ddo = false;
        shifts[day].wm = false;
        shifts[day].sick = false;
        shifts[day].ph = false;
        shifts[day].phExtraPay = false;
        shifts[day].al = false;
        shifts[day].phc = false;
        shifts[day].bonus = false;
        shifts[day].bonusHours = 0.0;
    }
    setSaveData("day14ph", "");
    day14ph = false;

    updateShiftTable();
    updateShiftWorkedCount();
    printShiftHours();
    validateTimeFields()
    updateOptionsButtons();
    updateShiftPayTable();
    updateResults();
    closeAllOptionsShelves();
}