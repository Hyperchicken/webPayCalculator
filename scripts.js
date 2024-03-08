/*
    Web-based Pay Calculator by Petar Stankovic
    Github Respository - https://github.com/Hyperchicken/webPayCalculator
    scripts.js - All of the calculator logic and page interactiveness is programmed into this file.
*/

"use strict";

//version
const calcVersion = "1.40";
const calcLastUpdateDate = "20/01/2024";

//message of the day. topHelpBox message that appears once per calcVersion.
//set to blank string ("") to disable message of the day
var motd = "Calculator updated to version " + calcVersion + " on " + calcLastUpdateDate + "<ul id='motd'></ul>";

//colours
const normalColour = "#00b9e8";
const ojtColour = "#ff7300";
const ddoColour = "#005229";
const phColour = "#44c600";
const wmColour = "#aa60d5";
const sickColour = "#ff0000";
const bonusColour = "#e79e00";
const teamLeaderColour = "#e70082";
const alColour = "#1c4ab3";
const lslColour = "#601cb3";
const phcColour = "#3d1cb3";
const higherDutiesColour = "#00b391";
const buttonBackgroundColour = "#5554";

//define a fortnightly pay-cycle to start on either an odd or even week of a given year
const evenPayWeekYears = [2016, 2017, 2018, 2019, 2020, 2027, 2028, 2029, 2030];
const oddPayWeekYears = [2015, 2021, 2022, 2023, 2024, 2025, 2026];

//define Classes
/**
 * Shift class.
 * 
 * Holds all the information about a shift including sign/off times and any shift options.
 */
class Shift {
    /**
     * Initialise a Shift
     * @param {string} signOn - sign-on time as 4 character string representing 24hr time between 0000-2359
     * @param {string} signOff - sign-off time as 4 character string representing 24hr time between 0000-2359
     */
    constructor(signOn, signOff, shiftDate) {
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
        if(shiftDate) {
            this.date = shiftDate.stripTime();
        }
        else {
            this.date = null;
        }
        this.ojt = false; //OJT shift
        this.ph = false; //public holiday
        this.phExtraPay = false; //ph extra pay. extra leave if false.
        this.phOffRoster = false; //PH off roster (rostered OFF on a PH). 'true' indicates shift converted to PH
        this.phOffRosterNoPay = false; //Ph off roster where paid leave of absence is not paid.
        this.wm = false; //wasted meal
        this.sick = false; //sick full day
        this.sickPart = false; //worked but went home sick partway through shift
        this.al = false; //annual leave
        this.lsl = false; //long service leave
        this.lslHalfPay = false; //long service leave half pay option
        this.phc = false; //public holiday credit day off
        this.unpaidLeave = false; //unpaid leave - normally rostered
        this.extendedShift = false; //shift extended for part-time OT purposes per 3.11(d)(iv)
        this.extendedShiftStartTime = ""; //either the time the shift was rostered to finish before it was extended, or the new extended sign-off time. 4 character string representing 24hr time (0000-2359)
        this.ddo = false; //DDO
        this.bonus = false; //bonus payment
        this.bonusHours = 0.0; //bonus payment hours
        this.teamLeader = false; //DAO team leader
        this.relievingExpenses = false; //relieving expenses allowance
        this.disruption = false; //disruption to work allowance
        this.suburbanGroupWorking = false; //suburban group working allowance
        this.higherDuties = false; //working in higher duties
        this.higherDutiesGrade = ""; //higher duties grade. Shift will be paid at the selected grade's rates.
        this.shiftWorkedNumber = 0;
        this.rosteredShiftNumber = 0;
    }    

    get extendedEndHour() {
        return this.endHour + Math.floor(this.calcExtendedShiftMinutes()/60);
    }

    get extendedEndMinute() {
        return this.endMinute + this.calcExtendedShiftMinutes()%60;
    }

    get daoTeamLeader() {
        if(getPayGrade() == "dao" && this.teamLeader) {
            return true;
        }
        else {
            return false;
        }
    }

    get ojtShift() {
        if(getPayGrade() == "spot" && this.ojt) {
            return true;
        }
        else {
            return false;
        }
    }

    get higherDutiesShift() {
        if(this.higherDuties == true && grades[getPayGrade()].higherDutiesGroup ) {
            if(higherDutiesGroups[grades[getPayGrade()].higherDutiesGroup].includes(this.higherDutiesGrade)) {
                return true;
            }
            return false
        }
        return false;

    }

    /**
     * Calculate shift hours as a decimal number
     * @returns {number} hours worked as decimal (ie 7.6 hours)
     */
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

    /**
     * Get the shift-end hour in 48-hour time. Useful for when a shift works into the following day.
     * @returns {number} end-hour in 48-hour time
     */
    get endHour48() {
        let hours = this.endHour - this.startHour;
        let minutes = this.endMinute - this.startMinute;
        if(hours < 0 || (hours == 0 && minutes < 0)) return this.endHour + 24;
        else return this.endHour;
    }

    /**
     * getter for calcHoursString()
     */
    get hoursString() {
        return this.calcHoursString();
    }

    get extendedShiftMinutes() {
        return this.calcExtendedShiftMinutes();
    }

    /**
     * Shift's work hours as a formatted string.
     * @returns {string} shift hours in the format H:MM
     */
    calcHoursString() {
        let hours = this.endHour - this.startHour;
        let minutes = this.endMinute - this.startMinute;
        if(this.extendedShift && (minutes > 0 || hours > 0)) minutes += this.calcExtendedShiftMinutes();
        if(hours < 0 || (hours == 0 && minutes < 0)) hours += 24;
        if(minutes < 0) {
            minutes += 60;
            hours--;
        }
        if(minutes >= 60) {
            hours += Math.floor(minutes/60);
            minutes = minutes%60;
        }
        if(hours || minutes) return hours + ":" + minutes.toString().padStart(2, "0");
        else return "";
    }

    calcExtendedShiftMinutes() {
        let extTimeHour = parseInt(this.extendedShiftStartTime.substring(0,2));
        let extTimeMinute = parseInt(this.extendedShiftStartTime.substring(2,4));
        if(isNaN(extTimeHour) || isNaN(extTimeMinute)) return 0;
        let totalMinutes = 0.0;
        let hours;
        let minutes;
        hours = extTimeHour - this.endHour;
        minutes = extTimeMinute - this.endMinute;
        
        if(hours < 0 || (hours == 0 && minutes < 0)) hours += 24;
        if(minutes < 0) {
            minutes += 60;
            hours--;
        }
        totalMinutes = (hours * 60) + minutes;
        return totalMinutes;
    }

    /**
     * Reset the shift sign-on/off times to zero
     */
    setNilHours() {
        this.startHour = 0;
        this.endHour = 0;
        this.startMinute = 0;
        this.endMinute = 0;
    }

    /**
     * Sets the sign-on and off times of the shift
     * @param {string} signOn - sign-on time in format 0123
     * @param {string} signOff sign-off time in format 0123
     */
    setShiftTimes(signOn, signOff) {
        if(signOn && signOff) {
            this.startHour = parseInt(signOn.substring(0,2));
            this.startMinute = parseInt(signOn.substring(2,4));
            this.endHour = parseInt(signOff.substring(0,2));
            this.endMinute = parseInt(signOff.substring(2,4));
        }
        else console.error("Shift setShiftTimes(): insufficient parameters");
    }

    setShiftDate(shiftDate) {
        if(shiftDate) {
            this.date = shiftDate.stripTime();
        }
        else console.warn("Shift setDate(): Shift date not set - parameter invalid");
    }
}

/**
 * PayElement class.
 * 
 * Represents a payslip pay element
 */
class PayElement { 
    /**
     * Create a PayElement
     * @param {string} payType - the internal name of the pay element as defined in this class's functions (for example: "wePen50")
     * @param {number} hours - the number of hours this pay element is worth
     * @param {number} fcDateOffset - fortnight-commencing date offset. The number of days this pay element is offset from the fortnight-commencing date 
     * @param {boolean} ojt - apply OJT rate to pay element
     * @param {boolean} higherDuties - flag PayElement as higher duties
     * @param {object} rateTables - an object of with the following rate table keys: gradeRates, earlyShiftRates, afternoonShiftRates, nightShiftRates
     */
    constructor(payType, hours, fcDateOffset, rateTables, ojt, higherDuties) {
        this.payType = payType;
        this.hours = parseFloat(hours.toFixed(4));
        this.rateTables = rateTables;
        this.ojt = ojt;
        this.higherDuties = higherDuties;
        this.fcDateOffset = fcDateOffset; //week commencing date offset. the number of days this shift is offset from the week-commencing date
        this.value = this.calculateValue(); //used to keep track of the pay amount when grouping elements together
    }

    /**
     * Calculates the value of this pay element
     * @returns {number} the element's pay value
     */
    calculateValue() {
        let val = parseFloat((this.rate * parseFloat(this.hours.toFixed(4))));
        if(["annualLeave", "longServiceLeaveFull", "longServiceLeaveHalf", "phCredit", "sickFull", "sickPart"].includes(this.payType)) {
            return parseFloat(val.toFixed(2)); //adjust precision for annual leave as payroll rounds to 2 decimal places for EACH DAY of Leave.
        } 
        else return val;
    }
    
    /**
     * Get the sort index of this pay element.
     * @returns {number} the sorting index of this element
     */
    get sortIndex() {
        let sortOrder = [ //array to define the order in which pay elements should be sorted in the results.
            "normal",
            "overtime",
            "guarantee",
            "sickFull",
            "sickPart",
            "annualLeave",
            "longServiceLeaveFull",
            "longServiceLeaveHalf",
            "phGaz",
            "phXpay",
            "phWorked",
            "edo",
            "phPen50",
            "phPen150",
            "wePen50",
            "wePen100",
            "ot150",
            "ot200",
            "rost+50",
            "rost+100",
            "ot250",
            "newPHCD",
            "nonRosPH",
            "phCredit",
            "bonusPayment",
            "disruption",
            "earlyShift",
            "afternoonShift",
            "nightShift",
            "metroSig2",
            "relExp",
            "suburbanGroupWorking",
            "mealAllowanceWasted",
            "mealAllowanceOT",
            "leaveLoading"
        ];
        let sortIndex = sortOrder.indexOf(this.payType);
        if(sortIndex < 0) {
            console.warn("PayElement.sortIndex: no sort index for pay type \"" + this.payType + "\"");
            return 5000;
        }
        else {
            return sortIndex;
        }
    }

    /**
     * Get the pay amount rounded to two decimal places
     */
    get payAmount() {
        return this.calculateValue().toFixed(2);
    }

    /**
     * Get the formatted name of the element's type
     */
    get payClass() {
        let payClassName = "";
        switch(this.payType) {
            case "normal": payClassName = "Normal"; break;
            case "overtime": payClassName = "Overtime"; break;
            case "guarantee": payClassName = "Guarantee"; break;
            case "sickFull": payClassName = "Sick Full"; break;
            case "sickPart": payClassName = "Sick Part"; break;
            case "annualLeave": payClassName = "A/Leave"; break;
            case "longServiceLeaveFull": payClassName = "LSL Full"; break;
            case "longServiceLeaveHalf": payClassName = "LSL (Half)"; break;
            case "phGaz": payClassName = "PH Gazette"; break;
            case "phXpay": payClassName = "PH X/Pay"; break;
            case "phWorked": payClassName = "PH Worked"; break;
            case "nonRosPH": payClassName = "NON ROS PH"; break;
            case "phPen50": payClassName = "PhPen 50%"; break;
            case "phPen150": payClassName = "PhPen 150%"; break
            case "wePen50": payClassName = "WePen 50%"; break;
            case "wePen100": payClassName = "WePen 100%"; break;
            case "ot150": payClassName = "O/T1.5 Vol"; break;
            case "ot200": payClassName = "O/T2.0 Vol"; break;
            case "ot250": payClassName = "OT 2.5"; break;
            case "rost+50": payClassName = "Rost+50%"; break;
            case "rost+100": payClassName = "Rost+100%"; break;
            case "earlyShift": payClassName = "E/Shift"; break;
            case "afternoonShift": payClassName = "A/Shift"; break;
            case "nightShift": payClassName = "N/Shift"; break;
            case "metroSig2": payClassName = "Metro Sig2"; break;
            case "relExp": payClassName = "Rel-Exp"; break;
            case "suburbanGroupWorking": payClassName = "Sub Group"; break;
            case "mealAllowanceWasted": payClassName = "Meal Allow"; break;
            case "mealAllowanceOT": payClassName = "Meal Allow (OT)"; break;
            case "disruption": payClassName = "Disruption"; break;
            case "bonusPayment": payClassName = "Bonus Pay"; break;
            case "phCredit": payClassName = "NewPH/lieu"; break;
            case "newPHCD": payClassName = "New PHCD"; break;
            case "edo": payClassName = "EDO"; break;
            case "leaveLoading": payClassName = "Leave Ldg 20%"; break;
            default:
                payClassName = this.payType;
                console.warn("PayElement.payClass: no pay-type name defined for \"" + this.payType + "\"");
        }
        if(this.ojt) payClassName += "*";
        if(this.higherDuties) payClassName += "^";
        return payClassName;
    }

    /**
     * Get the pay element's information text
     * @returns {string} HTML formatted information text
     */
    get helpText() {
        let tooltipText = "";
        switch(this.payType) {
            case "normal": 
                tooltipText = "<strong>Normal</strong>"
                + "<p><em>Ordinary hours</em> at the ordinary rate.</p>"
                + "<ul><li>Ordinary hours are up to 8 hours per day (7.6 hours for trainees and part-time).</li>"
                + "<li>Generally, ordinary hours is time worked that is not affected by penalty rates (for example: overtime, public holidays, weekends, etc).</li></ul>";
                break;
            case "overtime":
                tooltipText = "<strong>Overtime</strong>";  //to be completed
                break;
            case "guarantee": 
                tooltipText = "<strong>Guarantee</strong>"
                + "<p><em>Guaranteed</em> pay up to Ordinary Hours (7.6 hours for Trainees, Part-Time and Job Share. Otherwise 8 hours.).</p>"
                + "<ul><li>First 10 worked shifts eligible.</li>"
                + "<li>Paid only on <em>Normal</em> hours (ie. not Public Holidays, shiftwork penalties, etc...).</li>"
                + "</ul>";
                break;
            case "sickFull": 
                tooltipText = "<strong>Sick Full</strong>"
                + "<p>A full day of <em>personal leave</em>. </p>";
                break;
            case "sickPart": 
                tooltipText = "<strong>Sick Part</strong>"
                + "<p>A part day of <em>personal leave</em>. </p>";
                break;
            case "annualLeave": 
                tooltipText = "<strong>Annual Leave</strong>"
                + "<p><em>Annual Leave</em> paid at 8 hours per day of leave, up to 40 hours (5 shifts) per week.</p>"
                + "<ul><li>Sick days taken during Annual Leave will be paid as <em>Sick Full</em> and not count as taking Annual Leave for full-time.</li>"
                + "<li>Public Holidays that you would normally be rostered to work according to your rotation if you weren't on Annual Leave will be paid as <em>PH Gazette</em> and not count as Annual Leave. Ensure you set the Public Holiday - Converted to PH shift options together with the Annual Leave shift option.</li></ul>";
                break;
            case "longServiceLeaveFull": 
                tooltipText = "<strong>LSL (Full Pay)</strong>"
                + "<p><em>Long Service Leave (Full Pay)</em> paid at 8 hours per day of leave, up to 40 hours (5 shifts) per week for full-time.</p>"
                + "<li>Public Holidays that you would normally be rostered to work according to your rotation if you weren't on Long Service Leave will be paid as <em>PH Gazette</em> and not count as Long Service Leave. Ensure you set the Public Holiday - Converted to PH shift options together with the Long Service shift option.</li></ul>";
                break;
            case "longServiceLeaveHalf": 
                tooltipText = "<strong>LSL (Half Pay)</strong>"
                + "<p><em>Long Service Leave (Half Pay)</em> paid at 4 hours per day of leave, up to 40 hours (5 shifts) per week for full-time.</p>"
                + "<li>Public Holidays that you would normally be rostered to work according to your rotation if you weren't on Long Service Leave will be paid as <em>PH Gazette</em> and not count as Long Service Leave. Ensure you set the Public Holiday - Converted to PH shift options together with the Long Service shift option.</li></ul>";
                break;
            case "phGaz": tooltipText = "<strong>PH Gazette</strong>"
                + "<p>A full day's (ordinary hours) <em>Paid leave of absence</em> for a <em>Public Holiday</em> where one was originally rostered but the shift was converted to PH.</p>"
                + "<p>Part-time employees are paid for the hours that they were originally rostred instead of a flat 'full-day'.</p>";
                break;
            case "phXpay": tooltipText = "<strong>PH X/Pay</strong>"
                + "<p><em>Public Holiday Extra Pay.</em> Ordinary hours worth of additional pay at the normal rate on a public holiday where 'extra pay' was elected when signing-on, or if the public holiday falls on a Sunday.</p>"
                + "<ul><li>Public Holidays that fall on a Sunday are automatically <em>Extra Pay</em> as opposed to <em>Extra Leave</em>.</li>"
                + "<li>CALCULATION NOTE: The way PH Extra Pay is calculated by this calculator is different to the Enterprise Agreement to better reflect what payroll does in reality. The EA states that PH Extra Pay should be paid on the PH hours worked, however payroll currently pays a full 8 hours (7.6 hours for trainee/part-time) when Extra Pay is elected. The current payroll method is generally fairer overall.</li></ul>";
                break;
            case "phWorked": tooltipText = "<strong>PH Worked</strong>"
                + "<p><em>Public Holiday Worked.</em> Time worked on a Public Holiday, paid at <em>normal time</em>.</p>";
                break;
            case "nonRosPH": tooltipText = "<strong>Non-Ros PH</strong>"
                + "<p><em>Non-Rostered Public Holiday.</em> A day's paid leave of absence for a public holiday where you are not normally rostered to work on that day.</p>"
                + "<ul><li>If you are not rostered to work and not available for duty (annual leave, sick for a continuous week or longer, accident leave with pay, etc), then paid leave of absence does not apply.</li>"
                + "<li>For Easter Saturday, if you are OFF roster and not available to work (ie: underlined), then paid leave of absence does not apply.</li>"
                + "<li>For ANZAC Day, if ANZAC Day falls on a Saturday or a Sunday and you are OFF roster (regardless if you're underlined/available to work or not), then paid leave of absence does not apply.</li></ul>";
                break;
            case "phPen50": tooltipText = "<strong>PhPen 50%</strong>"
                + "<p><em>Public Holiday Penalty +50%.</em> Penalty payment paid at <em>50% of normal time</em> for time worked on a public holiday.</p>";
                break;
            case "phPen150": tooltipText = "<strong>PhPen 150%</strong>"
                + "<p><em>Public Holiday Penalty +150%.</em> Penalty payment paid at <em>150% of normal time</em> for time worked on a public holiday that falls on a Sunday.</p>";
                break;
            case "wePen50": tooltipText = "<strong>WePen 50%</strong>"
                + "<p><em>Weekend Penalty 50% (Saturday Time).</em> Penalty payment paid at <em>50% of normal time</em> for time worked on a Saturday.</p>";
                break;
            case "wePen100": tooltipText = "<strong>WePen 100%</strong>"
                + "<p><em>Weekend Penalty 100% (Sunday Time).</em> Penalty payment paid at <em>normal time</em> for time worked on a Sunday.</p>";
                break;
            case "ot150": tooltipText = "<strong>O/T1.5 Vol</strong>"
                + "<p><em>Excess Shift Overtime x1.5.</em> Time worked on the 11th and 12th shifts of the fortnight, paid at <em>time and half</em>.</p>";
                break;
            case "ot200": tooltipText = "<strong>O/T2.0 Vol</strong>"
                + "<p><em>Excess Shift Overtime x2.</em> Time worked on the 13th and 14th shifts of the fortnight, or the 11th or 12th shift if it falls on a Saturday, paid at <em>double time</em>.</p>";
                break;
            case "ot250": tooltipText = "<strong>OT 2.5</strong>"
                + "<p><em>Excess Hours Overtime x2.5.</em> Time worked in excess of ordinary hours on a public holiday, paid at <em>double time and a half</em>.</p>";
                break;
            case "rost+50": tooltipText = "<strong>Rost+50%</strong>"
                + "<p><em>Excess Hours Overtime x1.5.</em> Time worked on an ordinary shift in excess of 8 hours, paid at <em>time and a half</em> for for the first three excess hours.</p>";
                break;
            case "rost+100": tooltipText = "<strong>Rost+100%</strong>"
                + "<p><em>Excess Hours Overtime x2.</em> Time worked on an ordinary shift in excess of 11 hours (12 hrs for operations grades), paid at <em>double time.</em></p>"
                + "<p>Overtime worked on a Sunday is also paid at this rate.</p>";
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
            case "mealAllowanceWasted": tooltipText = "<strong>Meal Allow</strong>"
                + "<p><em>Meal Allowance.</em> Paid where the employee has claimed a wasted meal.</p>"
                break;
            case "mealAllowanceOT": tooltipText = "<strong>Meal Allow</strong>"
                + "<p><em>Meal Allowance.</em> Paid where the employee has worked more than 2 hours of overtime that shift.</p>"
                break;
            case "bonusPayment": tooltipText = "<strong>Bonus Pay</strong>"
                + "<p><em>Bonus Payment</em> paid where the company has offered an incentive payment on a particular shift.</p>"
                + "<ul><li>The name of this payment on your payslip will be different!</li>"
                + "<li>In the past, bonus payments have been offered on days such as White Night and New Years.</li></ul>";
                break;
            case "phCredit": tooltipText = "<strong>PH Credit</strong>"
                + "<p><em>Publc Holiday Credit.</em> Day off taken in lieu of a worked public holiday where extra-leave was accrued.</p>";
                break;
            case "newPHCD": tooltipText = "<strong>New PHCD</strong>"
                + "<p><em>New Publc Holiday Credit.</em> PH credits added to your leave balance as a result of choosing Extra Leave on a public holiday.</p>";
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

    /**
     * Get the internal name for the pay element
     */
    get payClassRaw() {
        if(this.ojt) return this.payType + "_OJT";
        else return this.payType;
    }

    /**
     * Calculate the rate of the pay element based on it's payType
     * @returns {number} the calculated pay-rate of this pay element
     */
    get rate() {
        let shiftDate = $("#week-commencing-date").datepicker("getDate").stripTime();
        shiftDate.setDate(shiftDate.getDate() + this.fcDateOffset);
        let rate = 0;
        if(this.ojt) rate += getEbaRate(shiftDate, ojtAllowanceRates); //apply OJT allowance
        switch(this.payType) {
            case "normal":
            case "overtime":
            case "sickFull":
            case "sickPart":
            case "guarantee":
            case "edo":
            case "wePen100":
            case "phGaz":
            case "phWorked":
            case "phXpay":
            case "nonRosPH": 
            case "annualLeave":
            case "phCredit":
            case "bonusPayment":
            case "longServiceLeaveFull":
            case "longServiceLeaveHalf":
                rate += getEbaRate(shiftDate, this.rateTables.gradeRates); //single rate
                break;
            case "wePen50":
            case "phPen50":
                rate += getEbaRate(shiftDate, this.rateTables.gradeRates); //half rate
                rate /= 2;
                break;
            case "ot150":
            case "rost+50":
            case "phPen150":
                rate += getEbaRate(shiftDate, this.rateTables.gradeRates); //time and a half
                rate *= 1.5;
                break;
            case "ot200":
            case "rost+100":
                rate += getEbaRate(shiftDate, this.rateTables.gradeRates); //double time
                rate *= 2;
                break;
            case "ot250":
                rate += getEbaRate(shiftDate, this.rateTables.gradeRates); //double time and a half
                rate *= 2.5;
                break;
            case "earlyShift":
                rate += getEbaRate(shiftDate, this.rateTables.earlyShiftRates);
                break;
            case "afternoonShift":
                rate += getEbaRate(shiftDate, this.rateTables.afternoonShiftRates);
                break;
            case "nightShift":
                rate += getEbaRate(shiftDate, this.rateTables.nightShiftRates);
                break;
            case "metroSig2":
                rate += getEbaRate(shiftDate, suburbanAllowanceRates);
                break;
            case "relExp":
                rate += getEbaRate(shiftDate, relievingExpensesRates);
                break;
            case "suburbanGroupWorking":
                rate += getEbaRate(shiftDate, suburbanGroupWorkingRates);
                break;
            case "mealAllowanceWasted":
            case "mealAllowanceOT":
                rate += getEbaRate(shiftDate, mealAllowanceRates);
                break;
            case "disruption":
                rate += getEbaRate(shiftDate, disruptionAllowanceRates);
                break;
            case "leaveLoading":
                rate += getEbaRate(shiftDate, this.rateTables.gradeRates); //20%
                rate *= 0.2;
                break;
            case "newPHCD":
                rate = 0;
                break;
            default:
                console.error("PayElement.rate: unable to get rate for payType \"" + this.payType + "\"");
                return null;
        }
        return parseFloat(rate.toFixed(4));
    }
}

/**
 * TaxElement class.
 * 
 * Represents a payslip tax element
 */
class TaxElement { 
    /**
     * Initialise a TaxElement
     * @param {string} description - name of the tax element that will be displayed in the results table
     * @param {number} value - value of this tax element in dollars and cents (eg: 123.98)
     * @param {number} sortIndex - Optional. Default: 1000. Determines how this element show be sorted. Lower values are displayed first. 
     * @param {boolean} postTaxDeduction - Optional. Default: false. Flag for indicating that this is a post-tax deduction (taken from net pay)
     */
    constructor(description, value, sortIndex = 1000, postTaxDeduction = false) {
        this.description = description;
        this.value = parseFloat(value.toFixed(2));
        this.sortIndex = sortIndex;
        this.postTaxDeduction = postTaxDeduction;
    }
}

/*-----------------------
Calculator initialisation
-----------------------*/
/**
 * @type {Shift[]} array of Shifts for the fortnight. Array index represents the day number (zero-based) of each shift
 */
let shifts = [];

/**
 * @type {PayElement[][]} array of PayElement objects. First dimension represents the day-number (0-13); second dimension represents the pay element index for that day.
 */
let shiftPay = [[]];

/**
 * @type {TaxElement[]} array of PayElement objects that are not tied to a specific shift/date
 */
let taxPay = [];

let focusBonusTextbox; //used keep track of bonus-pay option button textbox to be selected when loading pay-options buttons.
let focusExtendedShiftTextbox;
let day14ph = false; //day 14 public holiday
for (let i = 0; i < 14; i++) shifts.push(new Shift(i)); //init shifts array with 0 length shifts
let timeField = function() {return document.querySelectorAll(".time")}; //alias for time input boxes
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; //define shorthand names for days of the week
let numberOfCustomPreTaxFields = 4;
let numberOfCustomPostTaxFields = 4;

//init on document load
$(document).ready(function() { 
    populateGradeSelectList();
    initButtons();
    let timeFields = document.querySelectorAll(".time");
    for(let i = 0; i < timeFields.length; i++) {
        timeFields[i].addEventListener("blur", function(){
            validateTimeFields();
        });
        timeFields[i].addEventListener("focus", function(){
            addShortcutButton(i);
        });
        timeFields[i].addEventListener("keyup", function(event) {
            if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault();
                //console.log(`enter key pressed on field ${i}`);
                //document.getElementsByClassName('shortcut-button')[0].click();
            }
        });
    }

    //helpbox scroll listener to detect scrollable indicator
    helpboxContent.onscroll = function() {
        if(helpboxContent.scrollTop >= (helpboxContent.scrollHeight - helpboxContent.clientHeight)) {
            $(".scroll-indicator").hide();
        }
        else {
            $(".scroll-indicator").show();
        }
    };

    let startDate = () => { //returns the number of days to the most recent fortnight start date (a negative number in most cases)
        let todaysDate = new Date();
        //todaysDate.setDate(todaysDate.getDate() +1);
        let daysDifference = (todaysDate.getDay()) * -1; //number of days to the most recent sunday (0 if sunday is today)
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
    
    $("#week-commencing-date").datepicker({
        dateFormat: "d/m/yy",
        altField: "#date-button",
        firstDay: 0,
        defaultDate: startDate(),
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
    //update date to saved date if ahead of the deafult date
    let savedFortnight = new Date(getSaveData("lastSelectedFortnight", false));
    let datepickerDate = $("#week-commencing-date").datepicker("getDate");
    if(datepickerDate < savedFortnight) {
        $("#week-commencing-date").datepicker("setDate", savedFortnight);
    }
    //update any existing data on page load
    updateDates();
    loadSavedData(); //load any save data (previously entered data, attatched to the set date)
    updateGrade();
    updateShiftTable();
    updateShiftWorkedCount();
    printShiftHours();
    validateTimeFields();
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
    $("#importExportMenuButton").on("click", function(){
        importExportMenu();
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
    /*$("#deleteSaveMenuButton").on("click", function(){
        topHelpBoxPreset("deleteSave");
        closeMenu();
    });*/
    /*$("#bulkLeaveMenuButton").on("click", function(){
        bulkLeaveMenu();
        closeMenu();
    });*/
    $("#taxConfigurationMenuButton").on("click", function(){
        taxConfigurator();
        closeMenu();
    });
    $("#changelogMenuButton").on("click", function(){
        //topHelpBoxPreset("changelog");
        topHelpBox("Changelog", "Loading...");
        $.ajax({
            url: 'changelog.html?v=' + calcVersion,
            dataType: "html",
            success: function (data) {
                topHelpBox("Changelog", data);
            }
        });
        closeMenu();
    });
    $("#feedbackMenuButton").on("click", function(){
        topHelpBoxPreset("feedback");
        closeMenu();
    });
    $("#payclassWarningFeedbackLink").on("click", function(){
        topHelpBoxPreset("feedback");
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

    //set title superscript
    $("#titleSuperscript").text("v" + calcVersion);

    //check and display message of the day
    let lastVersion = getSaveData("lastCalcVersion", false);
    if(lastVersion != calcVersion && motd != "") {
        topHelpBox("Calculator Update Notes", motd);
        $.ajax({
            url: 'changelog.html?v=' + calcVersion,
            dataType: "html",
            success: function (data) {
                let dataDOM = new DOMParser().parseFromString(data, "text/html");
                $("#motd").html(dataDOM.getElementById(calcVersion).innerHTML);
            }
        });
    }
    setSaveData("lastCalcVersion", calcVersion, false);

    let timeField = $(".time");
    for(let i = 0; i < timeField.length; i++) { //close shelves on time field focus
        timeField[i].addEventListener("focus", function(){closeAllOptionsShelves();});
    } 
});

/**
 * Initialise all shift options 'dropdown' buttons.
 * Adds click event listeners to each button, including the day 14 PH yes/no toggle
 */
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

/**
 * @returns {Date} the date with the time set to zero
 */
Date.prototype.stripTime = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    return date;
}

Date.prototype.toDDMMYYYY = function() {
    var date = new Date(this.getTime());
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

Date.prototype.toYYYYMMDD = function() {
    var date = new Date(this.getTime());
    return "" + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
}

function getFortnightCommencingDate(fromDate = new Date()) { //returns the fortnight commencing date from a given date
    let daysDifference = (fromDate.getDay()) * -1; //number of days to the most recent sunday (0 if sunday is today)
    let shiftedDate = new Date(fromDate); //shift the date one day forward as weeks start on a Monday by default in JS Date
    shiftedDate.setDate(fromDate.getDate() + 1);
    let fortnightCommencingDate = new Date(fromDate)

    if(evenPayWeekYears.includes(fromDate.getFullYear())) {
        if(shiftedDate.getWeek() % 2 == 1) {//if not pay week
            daysDifference -= 7;
        }  
    }
    else if(oddPayWeekYears.includes(fromDate.getFullYear())) {
        if(shiftedDate.getWeek() % 2 == 0) {//if not pay week
            daysDifference -= 7;
        } 
    }
    else {
        console.warn("getFortnightCommencingDate(): Error calculating fortnight commencing date");
        return ((new Date().getDay()) * -1) -14; //return last fortnight sunday, even if not a pay week
    }

    fortnightCommencingDate.setDate(fortnightCommencingDate.getDate() + daysDifference);

    return fortnightCommencingDate;
}

/**
 * Toggle the day14ph variable, save the new result, and refresh the calculator
 */
function toggleDay14ph() {
    if(day14ph) {
        day14ph = false;
        setSaveData("day14ph", "false");
    }
    else {
        day14ph = true;
        setSaveData("day14ph", "true");
    }
    //update calculator data
    updateOptionsButtons();
    updateShiftPayTable();
    updateResults();
}

/**
 * Show/hide the jQuery datepicker
 */
function toggleDatepicker() {
    //$( "#week-commencing-date" ).slideToggle(300); //animated slide. looks a bit jerky on mobile
    $( "#week-commencing-date" ).toggle();
}

/**
 * Shift the datepicker date (fortnight-commencing date) by the specified number of days
 * @param {number} shiftValue the number of days to shift the datepicker date
 */
function datepickerShiftDays(shiftValue) {
    let currentDate = $("#week-commencing-date").datepicker("getDate");
    currentDate.setDate(currentDate.getDate() + shiftValue);
    $("#week-commencing-date").datepicker("setDate", currentDate);
    
    //load any save data from the newly set date and update all relevant calculator data
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
}

/**
 * Update and refresh all shift options dropdown buttons with the appropriate colour, text and icons; based on the shift-options on each shift.
 */
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
        optionsButtons[i].style.backgroundImage = "";
        let buttonColours = [];

        /**
         * Append new option label to button and add relevant colour(s) to buttonColours[]
         * @param {string} label - text to append to the options button
         * @param  {...string} colours - colour to add to the button
         */
        let setButton = (label, ...colours) => {
            if(buttonColours.length > 0) buttonText.innerHTML += "<br>";
            buttonText.innerHTML += label;
            for(let i=0; i < colours.length; i++) {
                buttonColours.push(colours[i]);
            }
        }
        if(s.hoursDecimal <= 0){ //if ZERO HOURS
            let offButton = true;
            if(s.ddo && grades[getPayGrade()].ddo && getEmploymentType() == "fulltime") {
                if(grades[getPayGrade()].drivingGrade) {
                    setButton("DDO-OFF", ddoColour);
                }
                else {
                    setButton("EDO-OFF", ddoColour);
                }
                offButton = false;
            }
            if(s.sick) {
                setButton("Sick-Full", sickColour);
                offButton = false;
            }
            if(s.al) {
                setButton("A/Leave", alColour);
                offButton = false;
            }
            if(s.lsl) {
                if(s.lslHalfPay) {
                    setButton("LSL-Half", lslColour);
                    offButton = false;
                }
                else {
                    setButton("LSL-Full", lslColour);
                    offButton = false;
                }
            }
            if(s.phc) {
                setButton("PH&nbspCredit", phcColour);
                offButton = false;
            }
            if(s.relievingExpenses && grades[getPayGrade()].relievingExpenses) {
                setButton("Rel Exp", teamLeaderColour);
            }
            if(s.higherDutiesShift && s.higherDutiesGrade /*&& grades[getPayGrade()].higherDutiesGroup*/) {
                setButton(grades[s.higherDutiesGrade].shortname, higherDutiesColour);
            }
            /*if(s.suburbanGroupWorking && grades[getPayGrade()].suburbanGroupWorking) {
                setButton("Grp Working", ojtColour);
            }*/
            if(s.ph) {
                if(s.phOffRoster) {
                    if(s.phOffRosterNoPay) {
                        setButton("PH No Pay", phColour);
                    }
                    else {
                        setButton("PH-OFF", phColour);
                    }
                }
                else {
                    setButton("PH-Gazette", phColour);
                }
                offButton = false;
            }
            if(s.wm && grades[getPayGrade()].drivingGrade) {
                setButton("Wasted Meal", wmColour);
                offButton = false;
            }
            if(s.bonus && s.bonusHours > 0.0) {
                setButton("Bonus&nbspPay", bonusColour);
                offButton = false;
            }
            if(offButton) {
                if(s.ojtShift || (s.bonus && s.bonusHours <= 0.0) || s.higherDutiesShift) {
                    setButton("OFF&nbsp(+)", "black");
                }
                else {
                    setButton("OFF", "black");
                }
            }
        }
        else { //if actual shift
            if(s.ojtShift || s.ph || s.sick || s.phc || s.wm || s.ddo || s.bonus || s.daoTeamLeader || s.relievingExpenses || s.suburbanGroupWorking || s.higherDutiesShift || s.extendedShift || s.disruption) {
                if(s.sick) {
                    /*if(s.hoursDecimal > 4.0) {
                        setButton("Sick-Part", sickColour);
                    }
                    else {
                        setButton("Sick-Full", sickColour);
                    }*/
                    if(getEmploymentType() == "parttime") {
                        setButton("Sick-Full", sickColour);
                    }
                    else {
                        setButton("Sick-Part", sickColour);
                    }
                }
                if(s.ojtShift) {
                    setButton("OJT", ojtColour);
                }
                if(s.phc && !grades[getPayGrade()].drivingGrade && getEmploymentType() == "parttime") {
                    setButton("PH&nbspCredit", phcColour);
                }
                if(s.relievingExpenses && grades[getPayGrade()].relievingExpenses) {
                    setButton("Rel-Exp", teamLeaderColour);
                }
                /*if(s.suburbanGroupWorking && grades[getPayGrade()].suburbanGroupWorking) {
                    setButton("Grp-Working", ojtColour);
                }*/
                if(s.higherDutiesShift && s.higherDutiesGrade /*&& grades[getPayGrade()].higherDutiesGroup*/) {
                    setButton(grades[s.higherDutiesGrade].shortname, higherDutiesColour);
                }
                if(s.extendedShift && s.extendedShiftStartTime && !grades[getPayGrade()].drivingGrade && getEmploymentType() == "parttime") {
                    setButton("+" + s.extendedShiftMinutes + "min OT", bonusColour);
                }
                if(s.daoTeamLeader) {
                    setButton("Team&nbspLeader", teamLeaderColour);
                }
                if(s.ddo && grades[getPayGrade()].ddo && getEmploymentType() == "fulltime") {
                    if(grades[getPayGrade()].drivingGrade) {
                        setButton("DDO-Work", ddoColour);
                    }
                    else {
                        setButton("EDO-Work", ddoColour);
                    }
                }
                if(s.ph){
                    if(getEmploymentType() == "parttime") {
                        if(s.phExtraPay) {
                            setButton("PH-XPay", phColour);
                        }
                        else if (s.phOffRoster) {
                            setButton("PH-Gazette", phColour);
                        }
                        else {
                            setButton("PH-XLeave", phColour);
                        }
                    }
                    else {
                        if(s.phExtraPay) {
                            setButton("PH-XPay", phColour);
                        }
                        else {
                            setButton("PH-XLeave", phColour);
                        }
                    }
                }
                if(s.wm && grades[getPayGrade()].drivingGrade) {
                    setButton("Wasted Meal", wmColour);
                }
                if(s.bonus && s.bonusHours > 0) {
                    setButton("Bonus&nbspPay", bonusColour);
                }
                if(s.disruption && !grades[getPayGrade()].drivingGrade)
                {
                    setButton("Disruption", wmColour);
                }
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

/**
 * Toggle the state of an options shelf for a particular day between open and closed.
 * Toggling an options shelf open will close any other open shelves first.
 * @param {number} day - the day number of the options shelf to toggle open/close
 */
function toggleOptionsShelf(day) {
    if($(".shift-options-shelf:eq("+day+")").is(":hidden")){ //open
        closeAllOptionsShelves();
        $(".shift-options-shelf")[day].textContent = ""; //clear existing buttons
        generateOptionsShelfButtons(day);
        $(".shift-options-shelf:eq("+day+")").toggle();
        updateOptionsButtons();
    }
    else {                                                      //close
        $(".shift-options-shelf:eq("+day+")").toggle();
        updateOptionsButtons();
    }
}

/**
 * Regenerate the contents of an already open options shelf
 * @param {number} day - the day number of the options shelf to regenerate
 */
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

/**
 * Close any options shelves that are currently open
 */
function closeAllOptionsShelves() {
    for(let i = 0; i < $(".shift-options-shelf").length; i++){ //close all shelves first
        if($(".shift-options-shelf:eq("+i+")").is(":visible")) {
            //$(".shift-options-shelf:eq("+i+")").slideUp(150, updateOptionsButtons);
            $(".shift-options-shelf:eq("+i+")").toggle();
            updateOptionsButtons();
        }
    }

}

/**
 * Generate the options shelf buttons for the specified day.
 * @param {number} day - the day number of the options shelf
 */
function generateOptionsShelfButtons(day) {
    let shelf = $(".shift-options-shelf")[day];

    /**
     * Shortcut function to reload relevant page and calculator data
     */
    const reloadPageData = () => {
        refreshOptionsShelf(day);
        updateShiftWorkedCount();
        printShiftHours();
        updateShiftPayTable();
        updateResults();
    }

    /**
     * Shortcut function to save data to storage with "day" + day number prepended to the key
     * @param {string} name - name of the save data key
     * @param {string} value - value to be saved to the key
     */
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

    //Relieving Expenses button
    let relExpensesButton = document.createElement("a");
    relExpensesButton.textContent = "Relieving Expenses";
    relExpensesButton.setAttribute("class", "button team-leader-button shelf-button");
    if(shifts[day].relievingExpenses) {//if Rel Expenses
        relExpensesButton.addEventListener("click", function(){
            shifts[day].relievingExpenses = false;
            reloadPageData();
            saveToStorage("relievingExpenses", "false");
        });
        relExpensesButton.style.background = "";
    }
    else {//if not relExp
        relExpensesButton.addEventListener("click", function(){
            shifts[day].relievingExpenses = true;
            reloadPageData();
            saveToStorage("relievingExpenses", "true");
        });
        relExpensesButton.style.background = buttonBackgroundColour;
    }

    //Disruption Allowance button
    let disruptionButton = document.createElement("a");
    disruptionButton.textContent = "Disruption";
    disruptionButton.setAttribute("class", "button wm-button shelf-button");
    if(shifts[day].disruption) {//if disruption
        disruptionButton.addEventListener("click", function(){
            shifts[day].disruption = false;
            reloadPageData();
            saveToStorage("disruption", "false");
        });
        disruptionButton.style.background = "";
    }
    else {//if not disruption
        disruptionButton.addEventListener("click", function(){
            shifts[day].disruption = true;
            reloadPageData();
            saveToStorage("disruption", "true");
        });
        disruptionButton.style.background = buttonBackgroundColour;
    }

    //Suburban Group Working button
    /*let suburbanGroupWorkingButton = document.createElement("a");
    suburbanGroupWorkingButton.textContent = "Group Working";
    suburbanGroupWorkingButton.setAttribute("class", "button ojt-button shelf-button");
    if(shifts[day].suburbanGroupWorking) {//if suburban group working
        suburbanGroupWorkingButton.addEventListener("click", function(){
            shifts[day].suburbanGroupWorking = false;
            reloadPageData();
            saveToStorage("suburbanGroupWorking", "false");
        });
        suburbanGroupWorkingButton.style.background = "";
    }
    else {//if not Suburban Group Working
        suburbanGroupWorkingButton.addEventListener("click", function(){
            shifts[day].suburbanGroupWorking = true;
            reloadPageData();
            saveToStorage("suburbanGroupWorking", "true");
        });
        suburbanGroupWorkingButton.style.background = buttonBackgroundColour;
    }*/

    //DAO Team Leader button
    let teamLeaderButton = document.createElement("a");
    teamLeaderButton.textContent = "Team Leader";
    teamLeaderButton.setAttribute("class", "button team-leader-button shelf-button");
    if(shifts[day].teamLeader) {//if Team Leader
        teamLeaderButton.addEventListener("click", function(){
            shifts[day].teamLeader = false;
            reloadPageData();
            saveToStorage("teamLeader", "false");
        });
        teamLeaderButton.style.background = "";
    }
    else {//if not Team Leader
        teamLeaderButton.addEventListener("click", function(){
            shifts[day].teamLeader = true;
            reloadPageData();
            saveToStorage("teamLeader", "true");
        });
        teamLeaderButton.style.background = buttonBackgroundColour;
    }

    //DDO button
    let ddoButton = document.createElement("a");
    if(grades[getPayGrade()].drivingGrade) {
        ddoButton.textContent = "DDO";
    }
    else {
        ddoButton.textContent = "EDO";
    }
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

    //Extended shift button (part-time non-driver only)
    let extendedShiftButton = document.createElement("span"); //is a span instead of an anchor for provision of textbox
    let extendedShiftButtonText = document.createElement("a");
    let extendedShiftTextbox = document.createElement("input");
    extendedShiftButtonText.textContent = "Shift Extended";
    extendedShiftButtonText.setAttribute("class", "bonus-button-text");
    extendedShiftButton.setAttribute("class", "button bonus-button shelf-button");
    extendedShiftTextbox.setAttribute("type", "text");
    extendedShiftTextbox.setAttribute("inputmode", "decimal");
    extendedShiftTextbox.setAttribute("placeholder", "0000");
    extendedShiftTextbox.pattern = "([0-1][0-9]|2[0-3])[0-5][0-9]";
    extendedShiftTextbox.maxLength = "4";
    extendedShiftButton.appendChild(extendedShiftButtonText);
    if(shifts[day].extendedShift) { //if extended shift
        let extendedShiftTimeText = document.createElement("a");
        extendedShiftTimeText.textContent = "sign-off";
        extendedShiftTimeText.setAttribute("class", "bonus-button-text");
        if(shifts[day].extendedShiftStartTime){
            extendedShiftTextbox.value = shifts[day].extendedShiftStartTime;
        }
        extendedShiftButton.appendChild(extendedShiftTextbox);
        extendedShiftButton.appendChild(extendedShiftTimeText);
        extendedShiftButtonText.addEventListener("click", function(){
            shifts[day].extendedShift = false;
            reloadPageData();
            saveToStorage("extendedShift", "false");
        });
        extendedShiftTextbox.addEventListener("input", function(){
            if(this.validity.valid) { //only accept valid input for time input.
                shifts[day].extendedShiftStartTime = this.value.toString();
                saveToStorage("extendedShiftStartTime", this.value.toString());
            }
            else {
                shifts[day].extendedShiftStartTime = "";
                saveToStorage("extendedShiftStartTime", "");
            }
            printShiftHours();
            updateOptionsButtons();
            updateShiftPayTable();
            updateResults();
        });
    }
    else {
        extendedShiftButton.addEventListener("click", function(){
            shifts[day].extendedShift = true;
            focusExtendedShiftTextbox = true;
            reloadPageData();
            saveToStorage("extendedShift", "true");
        });
        extendedShiftButton.style.background = buttonBackgroundColour;
    }

    //Public Holiday button
    let phDiv = document.createElement("div");
    let phSpan = document.createElement("span");
    let phButton = document.createElement("a");
    phButton.textContent = "Public Holiday";
    phButton.setAttribute("class", "button ph-button shelf-button");
    phDiv.appendChild(phButton);
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
            let phRosterButton = document.createElement("a");
            xLeaveButton.setAttribute("class", "button ph-button shelf-button dual-button-l");
            xPayButton.setAttribute("class", "button ph-button shelf-button dual-button-r");
            phRosterButton.setAttribute("class", "button ph-button shelf-button dual-button-r");
            xLeaveButton.textContent = "Extra Leave";
            xPayButton.textContent = "Extra Pay";
            phRosterButton.textContent = "PH Roster"
            phSpan.appendChild(xLeaveButton);
            phSpan.appendChild(xPayButton);
            phDiv.appendChild(phSpan);
            if(getEmploymentType() == "parttime") { //special PH options button configuration for part-time grade
                phSpan.appendChild(phRosterButton);
                xPayButton.classList.remove("dual-button-r");
                xPayButton.classList.add("dual-button-m");
                if(day == 0 || day == 7) { //force extra pay on sunday as per EBA
                    xLeaveButton.style.background = "#808080ad";
                    xLeaveButton.style.color = "black";
                    if(shifts[day].phExtraPay) {
                        phRosterButton.addEventListener("click", function() {
                            shifts[day].phExtraPay = false;
                            shifts[day].phOffRoster = true;
                            reloadPageData();
                            saveToStorage("phxp", "false");
                            saveToStorage("phor", "true");
                        });
                        xPayButton.style.background = "";
                        phRosterButton.style.background = buttonBackgroundColour;
                    }
                    else if(shifts[day].phOffRoster) {
                        xPayButton.addEventListener("click", function() {
                            shifts[day].phExtraPay = true;
                            shifts[day].phOffRoster = false;
                            reloadPageData();
                            saveToStorage("phxp", "true");
                            saveToStorage("phor", "false");
                        });
                        xPayButton.style.background = buttonBackgroundColour;
                        phRosterButton.style.background = "";
                    }
                }
                else {
                    if(shifts[day].phExtraPay) {
                        xLeaveButton.addEventListener("click", function() {
                            shifts[day].phExtraPay = false;
                            shifts[day].phOffRoster = false;
                            reloadPageData();
                            saveToStorage("phxp", "false");
                            saveToStorage("phor", "false");
                        });
                        phRosterButton.addEventListener("click", function() {
                            shifts[day].phExtraPay = false;
                            shifts[day].phOffRoster = true;
                            reloadPageData();
                            saveToStorage("phxp", "false");
                            saveToStorage("phor", "true");
                        });
                        xLeaveButton.style.background = buttonBackgroundColour;
                        xPayButton.style.background = "";
                        phRosterButton.style.background = buttonBackgroundColour;
                    } else if(shifts[day].phOffRoster) {
                        xPayButton.addEventListener("click", function() {
                            shifts[day].phExtraPay = true;
                            shifts[day].phOffRoster = false;
                            reloadPageData();
                            saveToStorage("phxp", "true");
                            saveToStorage("phor", "false");
                        });
                        xLeaveButton.addEventListener("click", function() {
                            shifts[day].phExtraPay = false;
                            shifts[day].phOffRoster = false;
                            reloadPageData();
                            saveToStorage("phxp", "false");
                            saveToStorage("phor", "false");
                        });
                        xLeaveButton.style.background = buttonBackgroundColour;
                        xPayButton.style.background = buttonBackgroundColour;
                        phRosterButton.style.background = "";
                    }
                    else {
                        xPayButton.addEventListener("click", function() {
                            shifts[day].phExtraPay = true;
                            shifts[day].phOffRoster = false;
                            reloadPageData();
                            saveToStorage("phxp", "true");
                            saveToStorage("phor", "false");
                        });
                        phRosterButton.addEventListener("click", function() {
                            shifts[day].phExtraPay = false;
                            shifts[day].phOffRoster = true;
                            reloadPageData();
                            saveToStorage("phxp", "false");
                            saveToStorage("phor", "true");
                        });
                        xLeaveButton.style.background = "";
                        xPayButton.style.background = buttonBackgroundColour;
                        phRosterButton.style.background = buttonBackgroundColour;
                    }
                }
            }
            else {
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
                            shifts[day].phOffRoster = false;
                            reloadPageData();
                            saveToStorage("phxp", "false");
                        });
                        xLeaveButton.style.background = buttonBackgroundColour;
                        xPayButton.style.background = "";
                    } else {
                        xPayButton.addEventListener("click", function() {
                            shifts[day].phExtraPay = true;
                            shifts[day].phOffRoster = false;
                            reloadPageData();
                            saveToStorage("phxp", "true");
                        });
                        xLeaveButton.style.background = "";
                        xPayButton.style.background = buttonBackgroundColour;
                    }
                }
            }
        }
        else { //if no hours
            let offRosterButton = document.createElement("a");
            let phRosterButton = document.createElement("a");
            let offRosterNoPayButton = document.createElement("a");
            phRosterButton.setAttribute("class", "button ph-button shelf-button dual-button-l");
            offRosterButton.setAttribute("class", "button ph-button shelf-button dual-button-m");
            offRosterNoPayButton.setAttribute("class", "button ph-button shelf-button dual-button-r");
            phRosterButton.textContent = "Converted to PH";
            offRosterButton.textContent = "OFF Roster";
            offRosterNoPayButton.textContent = "OFF No Pay";
            phSpan.appendChild(phRosterButton);
            phSpan.appendChild(offRosterButton);
            phSpan.appendChild(offRosterNoPayButton);
            phDiv.appendChild(phSpan);
            if(shifts[day].phOffRoster && !shifts[day].phOffRosterNoPay) {
                phRosterButton.addEventListener("click", function() {
                    shifts[day].phOffRoster = false;
                    shifts[day].phOffRosterNoPay = false;
                    reloadPageData();
                    saveToStorage("phor", "false");
                });
                offRosterNoPayButton.addEventListener("click", function() {
                    shifts[day].phOffRoster = true;
                    shifts[day].phOffRosterNoPay = true;
                    reloadPageData();
                    saveToStorage("phor", "nopay");
                });
                phRosterButton.style.background = buttonBackgroundColour;
                offRosterButton.style.background = "";
                offRosterNoPayButton.style.background = buttonBackgroundColour;
            } 
            else if(shifts[day].phOffRoster && shifts[day].phOffRosterNoPay) {
                phRosterButton.addEventListener("click", function() {
                    shifts[day].phOffRoster = false;
                    shifts[day].phOffRosterNoPay = false;
                    reloadPageData();
                    saveToStorage("phor", "false");
                });
                offRosterButton.addEventListener("click", function() {
                    shifts[day].phOffRoster = true;
                    shifts[day].phOffRosterNoPay = false;
                    reloadPageData();
                    saveToStorage("phor", "true");
                });
                phRosterButton.style.background = buttonBackgroundColour;
                offRosterButton.style.background = buttonBackgroundColour;
                offRosterNoPayButton.style.background = "";
            }
            else {
                offRosterButton.addEventListener("click", function() {
                    shifts[day].phOffRoster = true;
                    shifts[day].phOffRosterNoPay = false;
                    reloadPageData();
                    saveToStorage("phor", "true");
                });
                offRosterNoPayButton.addEventListener("click", function() {
                    shifts[day].phOffRoster = true;
                    shifts[day].phOffRosterNoPay = true;
                    reloadPageData();
                    saveToStorage("phor", "nopay");
                });
                phRosterButton.style.background = "";
                offRosterButton.style.background = buttonBackgroundColour;
                offRosterNoPayButton.style.background = buttonBackgroundColour;
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

    //Higher duties button
    let higherDutiesButton = document.createElement("span"); //span instead of an anchor for provision of select box
    if(grades[getPayGrade()].higherDutiesGroup) { //only generate button if applicable to current grade
        let higherDutiesText = document.createElement("a");
        higherDutiesText.textContent = "Higher Duties";
        higherDutiesText.setAttribute("class", "bonus-button-text");
        higherDutiesButton.setAttribute("class", "button higher-duties-button shelf-button");
        higherDutiesButton.appendChild(higherDutiesText);
        if(shifts[day].higherDuties) { //if higher duties
            let higherDutiesSelectbox = document.createElement("select");
            for(let i = 0; i < higherDutiesGroups[grades[getPayGrade()].higherDutiesGroup].length; i++){
                let higherDutiesOption = document.createElement("option");
                higherDutiesOption.textContent = grades[higherDutiesGroups[grades[getPayGrade()].higherDutiesGroup][i]].shortname;
                higherDutiesOption.setAttribute("value", higherDutiesGroups[grades[getPayGrade()].higherDutiesGroup][i]);
                higherDutiesSelectbox.appendChild(higherDutiesOption);
            }
            if(shifts[day].higherDutiesGrade == "") {
                if(getSaveData("lastHigherDutiesGrade", false)) {
                    shifts[day].higherDutiesGrade = getSaveData("lastHigherDutiesGrade", false);
                }
                else {
                    shifts[day].higherDutiesGrade = getPayGrade();
                }
                    updateOptionsButtons();
                    updateShiftPayTable();
                    updateResults();
                    saveToStorage("higherDutiesGrade", shifts[day].higherDutiesGrade);
                    setSaveData("lastHigherDutiesGrade", shifts[day].higherDutiesGrade, false)
            }
            higherDutiesSelectbox.value = shifts[day].higherDutiesGrade;
            higherDutiesButton.appendChild(higherDutiesSelectbox);
            higherDutiesText.addEventListener("click", function(){
                shifts[day].higherDuties = false;
                reloadPageData();
                saveToStorage("higherDuties", "");
            });
            higherDutiesSelectbox.addEventListener("input", function(){
                if(this.validity.valid) { //only accept valid input.
                    shifts[day].higherDutiesGrade = this.value;
                    saveToStorage("higherDutiesGrade", this.value);
                    setSaveData("lastHigherDutiesGrade", this.value, false)
                }
                else {
                    shifts[day].higherDutiesGrade = "";
                    saveToStorage("higherDutiesGrade", "");
                }
                updateOptionsButtons();
                updateShiftPayTable();
                updateResults();
            });
        }
        else {
            higherDutiesButton.addEventListener("click", function(){
                shifts[day].higherDuties = true;
                reloadPageData();
                saveToStorage("higherDuties", "true");
            });
            higherDutiesButton.style.background = buttonBackgroundColour;
        }
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

    //Long service leave button
    let lslSpan = document.createElement("span");
    let lslButton = document.createElement("a");
    lslButton.textContent = "Long Service";
    lslButton.setAttribute("class", "button lsl-button shelf-button");
    lslSpan.appendChild(lslButton);
    if(shifts[day].lsl) {//if LSL
        lslButton.addEventListener("click", function(){
            shifts[day].lsl = false;
            reloadPageData();
            saveToStorage("lsl", "false");
        });
        lslButton.style.background = "";

        let fullPayButton = document.createElement("a");
        let halfPayButton = document.createElement("a");
        fullPayButton.setAttribute("class", "button lsl-button shelf-button dual-button-l");
        halfPayButton.setAttribute("class", "button lsl-button shelf-button dual-button-r");
        fullPayButton.textContent = "Full Pay";
        halfPayButton.textContent = "Half Pay";
        lslSpan.appendChild(fullPayButton);
        lslSpan.appendChild(halfPayButton);
        if(shifts[day].lslHalfPay) {
            fullPayButton.addEventListener("click", function() {
                shifts[day].lslHalfPay = false;
                reloadPageData();
                saveToStorage("lslHalfPay", "false");
            });
            halfPayButton.style.background = "";
            fullPayButton.style.background = buttonBackgroundColour;
        } else {
            halfPayButton.addEventListener("click", function() {
                shifts[day].lslHalfPay = true;
                reloadPageData();
                saveToStorage("lslHalfPay", "true");
            });
            fullPayButton.style.background = "";
            halfPayButton.style.background = buttonBackgroundColour;
        }
    }
    else {//if not LSL
        lslButton.addEventListener("click", function(){
            shifts[day].lsl = true;
            reloadPageData();
            saveToStorage("lsl", "true");
        });
        lslButton.style.background = buttonBackgroundColour;
    }

    //PH Credit Leave button
    let phcButton = document.createElement("a");
    phcButton.textContent = "PH Credit Leave";
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
    bonusButtonText.setAttribute("class", "bonus-button-text");
    bonusButton.setAttribute("class", "button bonus-button shelf-button");
    bonusTextbox.setAttribute("type", "text");
    bonusTextbox.setAttribute("inputmode", "decimal");
    bonusTextbox.pattern = "\\d{1,2}(\\.\\d{0,2})?";
    bonusTextbox.maxLength = "5";
    bonusButton.appendChild(bonusButtonText);
    if(shifts[day].bonus) { //if bonus payment
        let bonusHrsText = document.createElement("a");
        bonusHrsText.textContent = "hrs";
        bonusHrsText.setAttribute("class", "bonus-button-text");
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
            focusBonusTextbox = true;
            reloadPageData();
            saveToStorage("bonus", "true");
        });
        bonusButton.style.background = buttonBackgroundColour;
    }
    

    //append buttons to shelf
    if(getPayGrade() == "dao") {
        shelf.appendChild(teamLeaderButton);
    }
    if(getPayGrade() == "spot") {
        shelf.appendChild(ojtButton);
    }
    if(!grades[getPayGrade()].drivingGrade) { //not driving grade
        shelf.appendChild(relExpensesButton);
        shelf.appendChild(disruptionButton);
    }
    /*if(grades[getPayGrade()].suburbanGroupWorking) {
        shelf.appendChild(suburbanGroupWorkingButton);
    }*/
    if(grades[getPayGrade()].ddo && getEmploymentType() == "fulltime") {
        shelf.appendChild(ddoButton);
    } 
    if(!grades[getPayGrade()].drivingGrade && getEmploymentType() == "parttime") {
        shelf.appendChild(extendedShiftButton);
    }
    if(grades[getPayGrade()].drivingGrade) {
        shelf.appendChild(wmButton);
    }
    shelf.appendChild(sickButton);
    if(grades[getPayGrade()].higherDutiesGroup) {
        shelf.appendChild(higherDutiesButton);
    }
    shelf.appendChild(phDiv);
    shelf.appendChild(alButton);
    shelf.appendChild(phcButton);
    shelf.appendChild(lslSpan);
    shelf.appendChild(bonusButton);

    //set focus if any
    if(focusBonusTextbox) {
        bonusTextbox.select();
        focusBonusTextbox = false;
    }
    if(focusExtendedShiftTextbox) {
        extendedShiftTextbox.select();
        focusExtendedShiftTextbox = false;
    }
}

/**
 * Runs a when a time input field has been changed.
 * This function will advance the focus to the next time field when the current field is filled, save the changed time data to storage, and then refresh calculator data.
 * @param {number} field - the index of the time input field that has changed
 */
function timeChanged(field) {
    setSaveData("field" + field.toString(), timeField()[field].value);
    updateShiftTable();
    printShiftHours();
    updateOptionsButtons();
    updateShiftPayTable();
    updateResults();
    if(timeField()[field].value.length >= 4 && field < 27) {
        timeField()[field + 1].focus();
    }
    else if (timeField()[field].value.length == 0) {
        addShortcutButton(field);
    }
}

/**
 * Sets the background colour of the calculator
 * @param {string} colour - a valid CSS colour string
 */
function setFormColour(colour) {
    for(let i = 0; i < $(".container").length; i++) {
        $(".container")[i].style.background = colour;
    }
}


/**
 * Get the currently selected pay-grade
 * @returns {string} the currently selected pay-grade string
 */
function getPayGrade() {
    return document.getElementById("pay-grade").value;
}

function getEmploymentType() {
    return document.getElementById("employment-type").value;
}

function getSuburbanGroupWorking() {
    return document.getElementById("suburban-group-working").checked;
}

/**
 * Run when the paygrade has been set or changed. Updates all pay-rates, calculator colour, save the grade to storage and refresh the calculator
 */
function updateGrade() {
    $("#payClassWarning").hide();
    $("#sgw-row").hide();
    let selectedGrade = getPayGrade();
    let employmentType = getEmploymentType();
    let sgw = getSuburbanGroupWorking();

    if(selectedGrade == "none") {
        $("#welcomeMessage").show();
        $("#results-container").hide();
        $(".shift-input").hide();
        $(".week-commencing").hide();
    }
    else {
        $("#welcomeMessage").hide();
        $("#results-container").show();
        $(".shift-input").show();
        $(".week-commencing").show();
        if(grades[selectedGrade].suburbanGroupWorking) {
            $("#sgw-row").show();
            $("#payClassWarning").show();
        }
        setFormColour(grades[selectedGrade].colour);
        setSaveData("paygrade", selectedGrade, false);
        setSaveData("paygrade", selectedGrade);
        setSaveData("employmenttype", employmentType, false);
        setSaveData("employmenttype", employmentType);
        setSaveData("suburbanGroupWorking", sgw, false);
        setSaveData("suburbanGroupWorking", sgw);
    
        updateShiftWorkedCount(); //needed as the grade affects for phOffRoster which affects shiftWorkedCount
        closeAllOptionsShelves();
        printShiftHours();
        updateOptionsButtons();
        updateShiftPayTable();
        updateResults();
    }
}

/**
 * Converts a field index to a shift index
 * @param {number} field - field index
 */
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

/**
 * Update each shift in the shift array with the values from the time input fields. Invlid shift times will set the shift to have zero hours.
 */
function updateShiftTable() {
    let times = timeField();
    let fortnightCommencingDate = $("#week-commencing-date").datepicker("getDate");
    let shiftDate = new Date();
    for(let i = 0; i < times.length; i += 2) {
        shiftDate.setDate(fortnightCommencingDate.getDate() + fieldToShift(i));
        let currentShift = fieldToShift(i);
        if(times[i].value.length == 4 && times[i+1].value.length == 4 && times[i].checkValidity() && times[i+1].checkValidity()){
            shifts[currentShift].setShiftTimes(times[i].value, times[i+1].value);
        }
        else {
            shifts[currentShift].setNilHours();
        }
        shifts[currentShift].setShiftDate(shiftDate);
    }
    if((shifts[13].endHour48 - 24) + (shifts[13].endMinute / 60) > 0) $(".last-sunday").show();
        else $(".last-sunday").hide();
    updateShiftWorkedCount();
}

/**
 * Calculate and update the shiftWorkedNumber for each shift in the shifts table. Non-shifts are set to 0. 
 */
function updateShiftWorkedCount() {
    let rosteredShiftsCount = 0;
    let workedShiftsCount = 0;
    let leaveShiftsCount = [0, 0]; //[week 1, week 2]
    if(ddoWeek() >= 0) {
        rosteredShiftsCount = 1;
        workedShiftsCount = 1;
    }
    let weekNo = (day) => {
        if(day < 7) return 0;
        else return 1;
    }
    for(let i = 0; i < shifts.length; i++) {
        //determine if rostered shift
        if(shifts[i].hoursDecimal > 0 || shifts[i].sick || shifts[i].al || shifts[i].lsl || shifts[i].phc || (shifts[i].ph && !shifts[i].phOffRoster)) {
            if(shifts[i].al || shifts[i].lsl) {
                if(++leaveShiftsCount[weekNo(i)] <= 5) {
                    shifts[i].rosteredShiftNumber = ++rosteredShiftsCount;
                }
            }
            else {
                shifts[i].rosteredShiftNumber = ++rosteredShiftsCount;
            }
        } else shifts[i].rosteredShiftNumber = 0;
        
        //determine if worked shift
        if(((shifts[i].hoursDecimal > 0 && !shifts[i].sick) || (shifts[i].sick && shifts[i].hoursDecimal > 0)) && !(shifts[i].phOffRoster && getPayGrade() == "parttime")) {
            shifts[i].shiftWorkedNumber = ++workedShiftsCount;
        } else shifts[i].shiftWorkedNumber = 0;
    }
}

/**
 * Update the results area of the calculator with any pay element data in the shiftPay and taxPay tables.
 */
function updateResults() {
    let resultArea = document.getElementById("result-area");
    let resultsViewFormat = document.forms.resultsViewForm.resultsView.value;
    let selectedDate = $("#week-commencing-date").datepicker("getDate");
    let dateDiv = document.querySelector(".week-commencing");
    let ojtFlag = false;
    let higherDutiesFlag = false;

    //create grouped elements table for combined view, combining any elements that share the same payClass and rate
    let groupedElements = [];
    shiftPay.forEach(function(day){
        day.forEach(function(element){
            let elementIndex = groupedElements.findIndex(function(elem){return (element.payClass == elem.payClass) && (element.rate == elem.rate);});
            if(elementIndex == -1) {
                groupedElements.push(new PayElement(element.payType, element.hours, element.fcDateOffset, element.rateTables, element.ojt, element.higherDuties));
            }
            else {
                groupedElements[elementIndex].hours += element.hours;
                groupedElements[elementIndex].value += element.value;
            }
            if(element.ojt) { //set OJT flag to trigger OJT footnote
                ojtFlag = true;
            }
            if(element.higherDuties) { //set higher duties flag to trigger higher duties footnote
                higherDutiesFlag = true;
            }
        });
    });
    groupedElements.sort(function(a,b){return a.sortIndex - b.sortIndex}); //sort pay elements according to defined sort order (defined in Pay Elements class)

    resultArea.innerHTML = ""; //clear existing results

    /**
     * Add a pay element to the specified results table
     * @param {PayElement} payElement - pay element to add to the results table
     * @param {HTMLTableElement} table - results table
     */
    let addPayElementToResultsTable = (payElement, table) => {
        let payElementRow = document.createElement("tr");
        let elemClass = document.createElement("td");
        let elemRate = document.createElement("td");
        let elemHours = document.createElement("td");
        let elemAmount = document.createElement("td");
        elemClass.innerHTML = payElement.payClass;
        if(payElement.rate > -1 && payElement.rate < 1) {
            elemRate.textContent = payElement.rate.toFixed(4).substr(1); //omit leading zero
        }
        else {
            elemRate.textContent = payElement.rate.toFixed(4);
        }
        if(payElement.hours > -1 && payElement.hours < 1) {
            elemHours.textContent = payElement.hours.toFixed(4).substr(1); //omit leading zero
        }
        else {
            elemHours.textContent = payElement.hours.toFixed(4);
        }
        elemAmount.textContent = (payElement.value < 0 ? "-$" : "$") + Math.abs(payElement.value).toFixed(2);
        elemClass.className = "pay-element-class";
        payElementRow.appendChild(elemClass);
        payElementRow.appendChild(elemRate);
        payElementRow.appendChild(elemHours);
        payElementRow.appendChild(elemAmount);
        table.appendChild(payElementRow);
        if(payElement.helpText) {
            elemClass.addEventListener("click", function(){
                $(".pay-element-table > tr").css("background-color", ""); //clear existing highlights
                $(".hours-worked").css("background-color", "");
                document.getElementById("resultsHelpDiv").innerHTML = payElement.helpText;
                payElementRow.style.backgroundColor = "#00000040"; //highlight clicked element
                window.location.replace("#resultsHelpDiv"); //scroll to help box
            });
        }
    }

    if(!selectedDate) { //if no selected date
        dateDiv.style.borderStyle = "solid";
        dateDiv.style.background = "";
        let dateErrorElement = document.createElement("h3");
        dateErrorElement.textContent = "Please set Week Commencing date!";
        resultArea.appendChild(dateErrorElement);
    }
    else { //valid date
        dateDiv.style.borderStyle = "none";
        dateDiv.style.background = "none";
        if(resultsViewFormat == "grouped"){ //grouped results view
            let listDiv = document.createElement("div");
            let elementTable = document.createElement("table");
            elementTable.className = "pay-element-table";
            let headerRow = document.createElement("tr");
            headerRow.innerHTML = "<th>Pay Class</th><th>Rate</th><th>Hours</th><th>Value</th>";
            elementTable.appendChild(headerRow);
            groupedElements.forEach(function(e){
                addPayElementToResultsTable(e, elementTable);
            });
            if(ojtFlag) {
                let blankRow = document.createElement("tr");
                let blankData = document.createElement("td");
                blankData.classList.add("last-row");
                blankData.setAttribute("colspan", "4");
                blankRow.appendChild(blankData);
                elementTable.appendChild(blankRow);
                let row = document.createElement("tr");
                let data =  document.createElement("td");
                data.textContent = "* = OJT rate";
                row.appendChild(data);
                elementTable.appendChild(row);
            }
            if(higherDutiesFlag) {
                let blankRow = document.createElement("tr");
                let blankData = document.createElement("td");
                blankData.classList.add("last-row");
                blankData.setAttribute("colspan", "4");
                blankRow.appendChild(blankData);
                elementTable.appendChild(blankRow);
                let row = document.createElement("tr");
                let data =  document.createElement("td");
                data.textContent = "^ = Higher Duties";
                row.appendChild(data);
                elementTable.appendChild(row);
            }
            listDiv.appendChild(elementTable);
            resultArea.appendChild(listDiv);
        }
        else if(resultsViewFormat == "split") { //split results view
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
                    shiftTitle.textContent = $(".day-of-week > p:first-of-type")[i].textContent;
                    shiftTitle.colSpan = 4;
                    shiftHeaderRow.appendChild(shiftTitle);
                    elementTable.appendChild(shiftHeaderRow);
                    if(firstDay) {
                        firstDay = false;
                        shiftTitle.className += " first";
                        let payHeaderRow = document.createElement("tr");
                        payHeaderRow.innerHTML = "<th>Pay Class</th><th>Rate</th><th>Hours</th><th>Value</th>";
                        elementTable.appendChild(payHeaderRow);
                    }
                    for(let j = 0; j < shiftPay[i].length; j++) {
                        addPayElementToResultsTable(shiftPay[i][j], elementTable);
                    }
                    let lastRow = document.createElement("tr");
                    let lastRowData = document.createElement("td");
                    lastRowData.colSpan = 4;
                    lastRowData.className = "last-row";
                    lastRow.appendChild(lastRowData);
                    elementTable.appendChild(lastRow);
                }
            }
            if(ojtFlag) {
                let row = document.createElement("tr");
                let data =  document.createElement("td");
                data.textContent = "* = OJT rate"
                row.appendChild(data);
                elementTable.appendChild(row);
            }
            if(higherDutiesFlag) {
                let row = document.createElement("tr");
                let data =  document.createElement("td");
                data.textContent = "^ = Higher Duties rate"
                row.appendChild(data);
                elementTable.appendChild(row);
            }
            resultArea.appendChild(elementTable);
        }
        else {
            let shiftTitle = document.createElement("h3");
            shiftTitle.textContent = "Error displaying results: invalid view format '" + resultsViewFormat + "'";
            resultArea.appendChild(shiftTitle);
        }

        //calculate gross
        let totalGross = 0.0; 
        groupedElements.forEach(function(e){
            totalGross += parseFloat(e.value.toFixed(2));
        });


        //calculate tax
        let taxTotals;
        let taxCalculationEnabled = getSaveData("enableTaxCalc", false) == "yes" ? true : false;
        if(taxCalculationEnabled) {
            taxTotals = calculateTax(groupedElements);
            //calculate compulsary super contribution
            let nonOvertimePay = 0.0;
            let superRate = superRates[0];
            for(let i = superRates.length - 1; i >= 0; i--) {
                if(selectedDate.stripTime().getTime() >= new Date(superRatesDate[i]).stripTime().getTime()){
                    superRate = superRates[i];
                    break;
                }
            }
            groupedElements.forEach(function(e){ 
                if(["normal", "guarantee", "sickFull", "sickPart", "annualLeave", "phGaz", "phXpay", "phWorked", "edo", "phPen50", "phPen150", "wePen50", "wePen100", "rost+50", "rost+100", "phCredit", "earlyShift", "afternoonShift", "nightShift", "metroSig2", "leaveLoading", "longServiceLeaveFull", "longServiceLeaveHalf"].includes(e.payType)) nonOvertimePay += e.value;
            });
            if(nonOvertimePay > 0) {
                taxPay.push(new TaxElement("Super Guarantee", nonOvertimePay * superRate, 1));
            }
            taxPay.sort(function(a, b){
                return a.sortIndex - b.sortIndex;
            });
            if(taxPay.length > 0) {
                let dashedHr = document.createElement("hr");
                dashedHr.classList.add("hr-dashed");
                resultArea.appendChild(dashedHr);
                let listDiv = document.createElement("div");
                let taxTable = document.createElement("table");
                taxTable.classList.add("pay-element-table");
                let headerRow = document.createElement("tr");
                headerRow.innerHTML = "<th>Description</th><th>Value</th>";
                taxTable.appendChild(headerRow);
                taxPay.forEach(function(e){
                    let taxElementRow = document.createElement("tr");
                    let elemDescription = document.createElement("td");
                    let elemValue = document.createElement("td");
                    elemDescription.innerHTML = e.description;
                    elemValue.textContent = (e.value < 0 ? "-$" : "$") + Math.abs(e.value).toFixed(2);
                    elemDescription.className = "pay-element-class";
                    taxElementRow.appendChild(elemDescription);
                    taxElementRow.appendChild(elemValue);
                    taxTable.appendChild(taxElementRow);
                });
                listDiv.appendChild(taxTable);
                resultArea.appendChild(listDiv);
            }
        }

        resultArea.appendChild(document.createElement("hr"));

        //total gross element
        let totalGrossElement = document.createElement("h3");
        totalGrossElement.classList.add("total-element");
        totalGrossElement.textContent = "Gross Income: " + ((totalGross < 0) ? "-$" : "$") + Math.abs(totalGross).toFixed(2);
        resultArea.appendChild(totalGrossElement);

        //tax total elements
        if(taxCalculationEnabled) {

            let dashedHr = document.createElement("hr");
            dashedHr.classList.add("hr-dashed");
            resultArea.appendChild(dashedHr);

            let taxableIncomeElement = document.createElement("p");
            taxableIncomeElement.classList.add("hours-worked");
            taxableIncomeElement.textContent = "Taxable Income: " + ((taxTotals.taxableIncome < 0) ? "-$" : "$") + Math.abs(taxTotals.taxableIncome).toFixed(2);
            resultArea.appendChild(taxableIncomeElement);

            let customFixedTaxRate = parseFloat(getSaveData("fixedTaxRate", false));
            let totalTaxElement = document.createElement("p");
            totalTaxElement.classList.add("hours-worked");
            totalTaxElement.textContent = "Tax" + (customFixedTaxRate ? ' [' + customFixedTaxRate + '% fixed rate]' : "") + ": " + ((taxTotals.taxBalance < 0) ? "-$" : "$") + Math.abs(taxTotals.taxBalance).toFixed(2);
            resultArea.appendChild(totalTaxElement);

            let preTaxAllowsDeds = taxTotals.preTaxDeduction + taxTotals.preTaxAllowance;
            let preTaxDeductionElement = document.createElement("p");
            preTaxDeductionElement.classList.add("hours-worked");
            preTaxDeductionElement.textContent = "Pre-tax Allows/Deds: " + ((preTaxAllowsDeds < 0) ? "-$" : "$") + Math.abs(preTaxAllowsDeds).toFixed(2);
            resultArea.appendChild(preTaxDeductionElement);

            let postTaxDeductionElement = document.createElement("p");
            postTaxDeductionElement.classList.add("hours-worked");
            postTaxDeductionElement.textContent = "Post-tax Allows/Deds: " + ((taxTotals.postTaxDeduction < 0) ? "-$" : "$") + Math.abs(taxTotals.postTaxDeduction).toFixed(2);
            resultArea.appendChild(postTaxDeductionElement);
    
            let totalNetElement = document.createElement("h3");
            totalNetElement.classList.add("total-element");
            totalNetElement.textContent = "Net Income: " + ((taxTotals.netIncome < 0) ? "-$" : "$") + Math.abs(taxTotals.netIncome).toFixed(2);
            resultArea.appendChild(totalNetElement);
        }
        else if(!getSaveData("hideTaxSetupPrompt", false)) {
            let dashedHr = document.createElement("hr");
            dashedHr.classList.add("hr-dashed");
            resultArea.appendChild(dashedHr);
            let taxPrompt = document.createElement("p");
            taxPrompt.classList.add("tax-prompt");
            let taxConfigLink = document.createElement("a");
            taxConfigLink.textContent = "Click here to configure";
            taxConfigLink.addEventListener("click", function(){
                taxConfigurator();
            });
            let icon = document.createElement("i");
            icon.classList.add("fas", "fa-comment-dollar", "fa-2x", "tax-prompt-icon")
            taxPrompt.append(icon, "Net and tax calculation not configured. ", taxConfigLink);
            resultArea.appendChild(taxPrompt);
        }

        let dashedHr = document.createElement("hr");
        dashedHr.classList.add("hr-dashed");
        resultArea.appendChild(dashedHr);

        //payslip hours paid
        let payslipHoursPaid = 0.0;
        groupedElements.forEach(function(e){ //the elements which to sum together their hours
            switch(e.payType) {
                //0.5x
                case "phPen50":
                case "wePen50":
                    payslipHoursPaid += e.hours * 0.5;
                    break;
                //1x
                case "normal":
                case "overtime":
                case "wePen100":
                case "phWorked":
                case "phGaz":
                case "phXpay":
                case "nonRosPH":
                case "sickFull":
                case "sickPart":
                case "annualLeave":
                case "guarantee":
                case "edo":
                case "bonusPayment":
                case "phCredit":
                    payslipHoursPaid += e.hours;
                    break;
                //1.5x
                case "ot150":
                case "phPen150":
                case "rost+50":
                    payslipHoursPaid += e.hours * 1.5;
                    break;

                //2x
                case "ot200":
                case "rost+100":
                    payslipHoursPaid += e.hours * 2;
                    break;
                //2.5x
                case "ot250":
                    payslipHoursPaid += e.hours * 2.5;
                    break;
            } 
        });
        let payslipHoursPaidElement = document.createElement("p");
        payslipHoursPaidElement.classList.add("hours-worked");
        payslipHoursPaidElement.innerHTML = "Hours Paid on payslip:&nbsp&nbsp" + payslipHoursPaid.toFixed(2);
        resultArea.appendChild(payslipHoursPaidElement);


        //payslip hours worked
        let payslipHoursWorked = 0.0;
        groupedElements.forEach(function(e){ //the elements which to sum together their hours
            if(["normal", "overtime", "phWorked", "phGaz", "nonRosPH", "sickFull", "sickPart", "ot150", "ot200", "ot250", "rost+50", "rost+100", "annualLeave", "guarantee", "edo", "bonusPayment", "phCredit"].includes(e.payType)) payslipHoursWorked += e.hours;
        });
        let payslipHoursWorkedElement = document.createElement("p");
        payslipHoursWorkedElement.classList.add("hours-worked");
        payslipHoursWorkedElement.innerHTML = "Hours Worked on payslip:&nbsp&nbsp" + payslipHoursWorked.toFixed(2);
        resultArea.appendChild(payslipHoursWorkedElement);
        payslipHoursWorkedElement.addEventListener("click", function(){
            $(".pay-element-table > tr").css("background-color", ""); //clear existing highlights
            $(".hours-worked").css("background-color", "");
            payslipHoursWorkedElement.style.backgroundColor = "#00000040"; //highlight clicked element
            document.getElementById("resultsHelpDiv").innerHTML = "<strong>Payslip Hours Worked</strong><p>Calculates the value that appears in the <em>Hours Worked</em> section on the <em>payslip</em>." 
            + " This includes time that wasn't physically worked such as Guarantee, A/Leave, and even EDO (+ and -).</p> <p>Compare this value to the <em>Hours Worked</em> section on your payslip.</p>";
            window.location.replace("#resultsHelpDiv"); //scroll to help box
        });

        
        
        //element help tips
        let resultsHelpDiv = document.createElement("div");
        resultsHelpDiv.id = "resultsHelpDiv";
        resultsHelpDiv.innerHTML = "<p>Click or touch a <em>Pay Class</em> above to see its definition here!</p>";
        resultArea.appendChild(resultsHelpDiv);
    }
}

/**
 * Update the day-of-week column with the days and dates of the fortnight based on the datepicker date, append fortnight-end date to datepicker and save the lastSelectedFortnight date to storage. Public Holidays that are detected will generate a button and public holiday indication.
 */
function updateDates() {
    let dayOfWeekFields = document.querySelectorAll(".day-of-week");
    let inputDate = $("#week-commencing-date").datepicker("getDate");
    let checkPublicHoliday = (date) => {
        let checkDate = date.stripTime();
        if(publicHolidays.length > 0) { //public holidays file found in publicHolidays.js
            for(let i = 0; i < publicHolidays.length; i++) {
                for(let j = 0; j < publicHolidays[i].dates.length; j++) {
                    if(checkDate.getTime() == new Date(publicHolidays[i].dates[j]).stripTime().getTime()) {
                        return i;
                    }
                }
            }
        }
        else {
            console.warn("Unable to access publicHolidays");
        }
        return -1;
    }
    if(!inputDate){ //if date invalid, blank the dates
        for(let i = 0; i < dayOfWeekFields.length; i++){
            dayOfWeekFields[i].innerHTML = daysOfWeek[i%7];
            dayOfWeekFields[i].classList.remove("day-of-week-button");
            $(dayOfWeekFields[i]).off();
        }
    }
    else { //date valid, print dates
        if(inputDate.getDay() === 0){ //only update if week commencing dat is a Sunday (first day of the week)
            for(let i = 0; i < dayOfWeekFields.length; i++){
                dayOfWeekFields[i].innerHTML = "<p>" + daysOfWeek[i%7] + " " + inputDate.getDate() + "/" + (inputDate.getMonth() + 1) + "</p>";
                
                //public holiday detection
                let phIndex = checkPublicHoliday(inputDate);
                if(phIndex >= 0) {
                    dayOfWeekFields[i].classList.add("day-of-week-button");
                    dayOfWeekFields[i].innerHTML += "<p class='subtext'>" + publicHolidays[phIndex].name + " Public Holiday</p>";
                    $(dayOfWeekFields[i]).on("click", () => {
                        topHelpBox(publicHolidays[phIndex].infoTitle, publicHolidays[phIndex].infoText);
                        window.location.replace("#topHelpDiv");
                    });
                }
                else {
                    dayOfWeekFields[i].classList.remove("day-of-week-button");
                    $(dayOfWeekFields[i]).off();
                }
                inputDate.setDate(inputDate.getDate() + 1);
            }
        }
        else console.error("updateDates(): week commencing date is required to be a Sunday");
    }
    let endFortnightDate = $("#week-commencing-date").datepicker("getDate");
    endFortnightDate.setDate(endFortnightDate.getDate() + 13);
    $("#date-button").val($("#date-button").val() + "  to  " + endFortnightDate.getDate() + "/" + (endFortnightDate.getMonth() + 1) + "/" + endFortnightDate.getFullYear()); //append fortnight end-date to datepicker field
    setSaveData("lastSelectedFortnight", $("#week-commencing-date").datepicker("getDate").toDateString(), false); //save last selected fortnight to storage.
}

/**
 * Print the hours worked to the 'hours' column for each shift in the shift table
 */
function printShiftHours() {
    let hoursField = document.querySelectorAll(".shift-hours");
    let timeField = document.querySelectorAll(".time");
    let totalField = document.querySelector(".total-hours");
    let totalHours = 0.0;
    for(let i = 0; i < shifts.length; i++) {
        if(timeField[i*2].checkValidity() && timeField[(i*2)+1].checkValidity() && !(timeField[i*2].value == timeField[(i*2)+1].value && timeField[i*2].value != "")) {
            hoursField[i].innerHTML = shifts[i].hoursString;
            if(shifts[i].hoursDecimal >= 8.5) {
                hoursField[i].classList.add("shift-hours-high");
            }
            totalHours += shifts[i].hoursDecimal;
        }
    }
    totalField.textContent = Math.floor(totalHours) + ":" + parseInt((totalHours % 1) * 60).toString().padStart(2, "0");
}

/**
 * Perform input validation on each time input field and display an error pop-up and icon if validation fails.
 * 
 * @returns {boolean} true if time input fields are all valid, false if a field fails to validate
 */
function validateTimeFields() {
    const textboxErrorColour = "#ffd4d4";
    let valid = true;
    let hoursField = document.querySelectorAll(".shift-hours");
    let timeField = document.querySelectorAll(".time");
    for(let i = 0; i < shifts.length; i++) {
        let errorSpan = document.createElement("span");
        let errorIcon = document.createElement("i");
        let errorPopup = document.createElement("span");
        errorSpan.className = "popup";
        errorIcon.className = "fas fa-exclamation-triangle fa-lg yellow-colour"; //icon
        errorSpan.addEventListener("click", function(){
            errorPopup.classList.toggle("show");
        }, true);
        errorPopup.className = "popuptext";
        errorPopup.textContent = "Sign-on and sign-off times must be 4 digits and between 0000 and 2359. Omit the colon (:) when entering times.";
        errorSpan.appendChild(errorIcon);
        errorSpan.appendChild(errorPopup);
        if(!timeField[i*2].checkValidity() || !timeField[(i*2)+1].checkValidity()) {
            valid = false;
            hoursField[i].innerHTML = "";
            hoursField[i].appendChild(errorSpan);
            errorPopup.classList.add("show");
        }
        if(!timeField[i*2].checkValidity()) {
            timeField[i*2].style.backgroundColor = textboxErrorColour;
        } 
        else {
            timeField[i*2].style.backgroundColor = "";
        }
        if(!timeField[(i*2)+1].checkValidity()) {
            timeField[(i*2)+1].style.backgroundColor = textboxErrorColour;
        } 
        else {
            timeField[(i*2)+1].style.backgroundColor = "";
        }
        if(timeField[i*2].value == timeField[(i*2)+1].value && timeField[i*2].value != "") {
            valid = false;
            timeField[i*2].style.backgroundColor = textboxErrorColour;
            timeField[(i*2)+1].style.backgroundColor = textboxErrorColour;
            hoursField[i].innerHTML = "";
            errorPopup.textContent = "Sign-on and sign-off time cannot be the same"
            hoursField[i].appendChild(errorSpan);
            errorPopup.classList.add("show");
        }
    }
}

function addShortcutButton(field) {
    printShiftHours(); //reset shift hours fields to clear any existing buttons
    let timeFields = document.querySelectorAll(".time");
    let hoursFields = document.querySelectorAll(".shift-hours");
    let s = fieldToShift(field); //shift number
    let shortcutButton = (shift, type) => {
        let ordHours = grades[getPayGrade()].ordinaryHours;
        if(getPayGrade() == "dao") { //override shortcut button ordinary hours for DAO
            ordHours = 8.25;
        }
        let button = document.createElement("button");
        button.classList.add("shortcut-button");
        button.tabIndex = '-1';
        if(type == "nextShift") button.textContent = "Skip";
        if(type == "addOrdinaryHours") button.textContent = `+${ordHours + (getPayGrade() == "dao" ? '' : 'h')}`; //omit the 'h' if DAO so that the text fits in the button

        button.onclick = () => {
            if(type == "nextShift") {
                timeFields[(shift + 1) * 2].focus();
            }
            else if(type == "addOrdinaryHours") {
                let signonHour = parseInt(timeFields[shift * 2].value.substring(0,2));
                let signonMinute = parseInt(timeFields[shift * 2].value.substring(2,4));
                let newHour = (signonHour + Math.floor(ordHours)) % 24;
                let newMinute = (signonMinute + Math.round((ordHours - Math.floor(ordHours)) * 60));
                if(newMinute >= 60){
                    newHour++;
                    newMinute = newMinute % 60;
                }
                let newTimeString = newHour.toString().padStart(2, '0') + newMinute.toString().padStart(2, '0');
                timeFields[(shift * 2) + 1].value = newTimeString;
                timeChanged((shift * 2) + 1);
            }
        }
        return button;
    }

    if(field % 2 == 0) { //sign-on field
        if(timeFields[field].value == "" && timeFields[field + 1].value == "" && field < 26) {
            hoursFields[s].innerHTML = "";
            hoursFields[s].append(shortcutButton(s, "nextShift"))
        }
        else if(timeFields[field + 1].value == "" && timeFields[field].checkValidity() && timeFields[field].value.length == 4) {
            hoursFields[s].innerHTML = "";
            hoursFields[s].append(shortcutButton(s, "addOrdinaryHours"))
        }
    }
    else { //sign-off field
        if(timeFields[field].value == "" && timeFields[field - 1].value == "" && field < 26) {
            hoursFields[s].innerHTML = "";
            hoursFields[s].append(shortcutButton(s, "nextShift"))
        }
        else if(timeFields[field].value == "" && timeFields[field - 1].checkValidity() && timeFields[field - 1].value.length == 4) {
            hoursFields[s].innerHTML = "";
            hoursFields[s].append(shortcutButton(s, "addOrdinaryHours"))
        }
    }
}

/**
 * Get the pay rate based on a given date from an array of rates. The rates array indicies should match those of the rateDates array
 * @param {Date} date - date which to get the relevant rate
 * @param {number[]} rates - array of rates to check against the rateDates[] array
 * @returns {number} EBA pay rate
 */
function getEbaRate(date, rates) {
    date = date.stripTime();
    for(let i = rates.length - 1; i >= 0; i--) {
        if(date.getTime() >= new Date(rateDates[i]).stripTime().getTime()){
            return rates[i];
        }
    }
    console.error("getEbaRate() Error: Invalid date or no matching payrate");
    return 0;
}

/**
 * Check for a DDO in shifts[] and returns the day index of the first shift that has a DDO shift-option set to true. Returns -1 if no DDO is found.
 * @returns {number} day index of the first shift that has a DDO or -1 if no DDO is found
 */
function ddoWeek() {
    for(let i = 0; i < shifts.length; i++) {
        if(shifts[i].ddo) return i;
    }
    return -1;
}

/**
 * Calculates the pay elements for each shift in the shift table (shifts[]) and adds the pay elements into the pay table (shiftPay[]).
 * This is where all the pay calculation logic lives.
 */
function updateShiftPayTable() {
    let payGrade = grades[getPayGrade()];
    if(!payGrade) {
        if(getPayGrade() != "none") console.error("updateShiftPayTable(): invalid paygrade!")
        return;
    }
    let partTimeNonDriver = false;
    if(getEmploymentType() == "parttime" && !grades[getPayGrade()].drivingGrade) partTimeNonDriver = true;
    let alShifts = [0, 0]; //[week1 count, week2 count]  //shifts counted as annual leave. used to avoid using annual leave when sick or ph-gaz.
    let deductAnnualLeaveShifts = [0, 0]; //[week1, week2] //counters to keep track of shifts that would override an annual leave shift should there be a full week of annual leave
    let lslShifts = [0, 0]; //[week1 count, week2 count]  //shifts counted as long service leave. used to avoid using lsl when ph-gaz.
    let deductLSLShifts = [0, 0]; //[week1, week2] //counters to keep track of shifts that would override an lsl shift should there be a full week of lsl
    if(getEmploymentType() == "parttime" && grades[getPayGrade()].drivingGrade) ordinaryHours = 7.6; //override ord hours for driver part-time employees
    let ordinaryDays = payGrade.ordinaryDays; //default ordinary days of 10 worked shifts. Shifts over this number are considered overtime shifts.
    if(partTimeNonDriver) ordinaryDays = Infinity;
    let ddoFortnight = false;
    
   
    //let phOffRosterCount = 0; //PH-OFF shifts to count towards shifts worked for guarantee calculation only

    shiftPay = []; //clear pay table
    
    let weekNo = (day) => {
        if(day < 7) return 0;
        else return 1;
    }

    //pay calculation: pass 1. calculate everything except AL and LSL
    for(let day = 0; day < 14; day++) {
        let s = shifts[day]; //alias for current shift
        let shiftPayGrade; //paygrade for current shift only
        let higherDuties = false;
        if(s.higherDuties && s.higherDutiesGrade && payGrade.higherDutiesGroup) {
            shiftPayGrade = grades[s.higherDutiesGrade];
            higherDuties = true;
        }
        else {
            shiftPayGrade = payGrade;
        }
        let rateTables = { //rates for current shift
            gradeRates: shiftPayGrade.payRates,
            earlyShiftRates:  shiftPayGrade.earlyShiftRates,
            afternoonShiftRates:  shiftPayGrade.afternoonShiftRates,
            nightShiftRates:  shiftPayGrade.nightShiftRates
        };
        
        if(s.daoTeamLeader) {
            rateTables.gradeRates = so7Rates;
        }

        shiftPay.push([]); //clear the shiftPay array
        
        let shiftHours = s.hoursDecimal;
        if(shiftHours <= 0) { //if shift has zero hours
            if(s.al) { //annual leave
                alShifts[weekNo(day)]++;
            }
            if(s.lsl) {
                lslShifts[weekNo(day)]++;
            }
            if(s.sick) {
                deductAnnualLeaveShifts[weekNo(day)]++;
                if(s.ph) {
                    shiftPay[day].push(new PayElement("phGaz", shiftPayGrade.ordinaryHours, day, rateTables, false, higherDuties));
                }
                else {
                    shiftPay[day].push(new PayElement("sickFull", shiftPayGrade.ordinaryHours, day, rateTables, false, higherDuties));
                }
            }
            else if(s.ph) { //public holiday
                if(s.phOffRoster) {
                    //phOffRosterCount++;
                    if(getEmploymentType() != "parttime" && !s.al && !s.lsl && !s.phOffRosterNoPay) { //dont pay NON ROS PH to part time, when on leave, or when PH OFF No Pay is set
                        shiftPay[day].push(new PayElement("nonRosPH", shiftPayGrade.ordinaryHours, day, rateTables, false, higherDuties));
                    }
                }
                else {
                    deductAnnualLeaveShifts[weekNo(day)]++;
                    deductLSLShifts[weekNo(day)]++;
                    shiftPay[day].push(new PayElement("phGaz", shiftPayGrade.ordinaryHours, day, rateTables, false, higherDuties));
                }
            }
            else if(s.phc) { //public holiday credit leave
                deductAnnualLeaveShifts[weekNo(day)]++;
                shiftPay[day].push(new PayElement("phCredit", shiftPayGrade.ordinaryHours, day, rateTables, false, higherDuties));
            }
            if(s.ddo && !ddoFortnight) {
                deductAnnualLeaveShifts[weekNo(day)]++;
                ddoFortnight = true;
            }
        }
        else { //if shift has hours
            //categorise hours into today/tomorrow and ph/nonPh
            let todayNormalHours = 0.0;
            let tomorrowNormalHours = 0.0;
            let normalHours;
            let todayPhHours = 0.0;
            let tomorrowPhHours = 0.0;
            let phOvertimeHours = 0.0;
            let tomorrowPh;

            if((day + 1) == 14) tomorrowPh = day14ph;
                else tomorrowPh = shifts[day + 1].ph;
            if(s.endHour48 > 23) { //if shift runs into the next day
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
            normalHours = parseFloat((todayNormalHours + tomorrowNormalHours).toFixed(10));

            if(todayPhHours + tomorrowPhHours > shiftPayGrade.ordinaryHours) {
                phOvertimeHours = todayPhHours + tomorrowPhHours - shiftPayGrade.ordinaryHours;
                tomorrowPhHours -= phOvertimeHours;
                if(tomorrowPhHours < 0.0) {
                    todayPhHours += tomorrowPhHours;
                    tomorrowPhHours = 0;
                }
            }

            //sick non-driver part-timers: set working hours to zero.
            if((s.sick || s.phc) && getEmploymentType() == "parttime" && !shiftPayGrade.drivingGrade) {
                normalHours = 0.0;
                todayNormalHours = 0.0;
                tomorrowNormalHours = 0.0;
                todayPhHours = 0.0;
                tomorrowPhHours = 0.0;
                phOvertimeHours = 0.0;
            }

            //part-time PH-roster calculation
            if(getEmploymentType() == "parttime" && s.phOffRoster && s.ph) {
                shiftPay[day].push(new PayElement("phGaz", shiftHours, day, rateTables, false, higherDuties));
            }
            /*else if(s.sick && s.hoursDecimal <= 4) {
                shiftPay[day].push(new PayElement("sickFull", shiftPayGrade.ordinaryHours, day, rateTables)); //if went of sick half-way through shift or earlier, pay sick full day.
            }*/
            else {
                //Public Holidays
                let normalPhWorkedHours = 0.0;
                let sundayPhWorkedHours = 0.0;
                if(todayPhHours > 0.0) {
                    if (day == 0 || day == 7) {
                        sundayPhWorkedHours += todayPhHours;
                    }
                    else {
                        normalPhWorkedHours += todayPhHours;
                    }
                }
                if(tomorrowPhHours > 0.0) {
                    if (day == 6 || day == 13) {
                        sundayPhWorkedHours += tomorrowPhHours;
                    }
                    else {
                        normalPhWorkedHours += tomorrowPhHours;
                    }
                }
                if(normalPhWorkedHours > 0.0) {
                    shiftPay[day].push(new PayElement("phWorked", normalPhWorkedHours, day, rateTables, s.ojtShift, higherDuties));
                    if(partTimeNonDriver) {
                        if(s.ph && s.phExtraPay && (day != 0 && day != 7)) {
                            shiftPay[day].push(new PayElement("phPen150", normalPhWorkedHours, day, rateTables, s.ojtShift, higherDuties)); //payroll interpretation: XPay based on ordinary hours
                        } 
                        else if(s.ph && (day != 0 && day != 7)) {
                            shiftPay[day].push(new PayElement("phPen50", normalPhWorkedHours, day, rateTables, s.ojtShift, higherDuties));
                            shiftPay[day].push(new PayElement("newPHCD", normalPhWorkedHours, day, rateTables));
                        }
                    }
                    else {
                        shiftPay[day].push(new PayElement("phPen50", normalPhWorkedHours, day, rateTables, s.ojtShift, higherDuties));
                        if(s.ph && s.phExtraPay && (day != 0 && day != 7)) {
                            shiftPay[day].push(new PayElement("phXpay", shiftPayGrade.ordinaryHours, day, rateTables, s.ojtShift, higherDuties)); //payroll interpretation: XPay based on ordinary hours
                        } 
                        else if(s.ph && (day != 0 && day != 7)) {
                            shiftPay[day].push(new PayElement("newPHCD", shiftPayGrade.ordinaryHours, day, rateTables));
                        }
                    }
                }
                if(sundayPhWorkedHours > 0.0) {
                    shiftPay[day].push(new PayElement("phWorked", sundayPhWorkedHours, day, rateTables, s.ojtShift, higherDuties));
                    if(s.ph && tomorrowPh && (day == 6 || day == 13)) {
                        shiftPay[day].push(new PayElement("phPen50", sundayPhWorkedHours, day, rateTables, s.ojtShift, higherDuties));
                    }
                    else {
                        shiftPay[day].push(new PayElement("phPen150", sundayPhWorkedHours, day, rateTables, s.ojtShift, higherDuties));
                    }
                }
                if(phOvertimeHours > 0.0) {
                    shiftPay[day].push(new PayElement("ot250", phOvertimeHours, day, rateTables, s.ojtShift, s.higherDuties));
                }

                //Normal hours
                if(s.shiftWorkedNumber <= ordinaryDays && normalHours > 0.0){ 
                    if(s.rosteredShiftNumber > ordinaryDays) {
                        shiftPay[day].push(new PayElement("overtime", Math.min(normalHours, shiftPayGrade.ordinaryHours), day, rateTables, s.ojtShift, higherDuties));
                    }
                    else {
                        shiftPay[day].push(new PayElement("normal", Math.min(normalHours, shiftPayGrade.ordinaryHours), day, rateTables, s.ojtShift, higherDuties));
                    }
                }

                //Public Holiday Credit (part-time non-driver only)
                if(s.phc && partTimeNonDriver) {
                    shiftPay[day].push(new PayElement("phCredit", s.hoursDecimal, day, rateTables, false, higherDuties));
                }

                //Guarantee and Sick-Part
                if(s.sick) { //if sick, sick-part in place of guarantee
                    let sickHours;
                    if(getEmploymentType() == "parttime" && !shiftPayGrade.drivingGrade) { //part-time non-driving get paid sick for their rostered hours
                        sickHours = s.hoursDecimal;
                    }
                    else { //otherwise sick-part
                        sickHours = shiftPayGrade.ordinaryHours - s.hoursDecimal;
                    }
                    if(sickHours > 0.0) {
                        shiftPay[day].push(new PayElement("sickFull", sickHours, day, rateTables, false, higherDuties));
                    }
                }
                else if(shiftPayGrade.drivingGrade && s.shiftWorkedNumber <= ordinaryDays && s.rosteredShiftNumber <= ordinaryDays && s.hoursDecimal < shiftPayGrade.ordinaryHours) {
                    let guaranteeHours = shiftPayGrade.ordinaryHours - s.hoursDecimal;
                    shiftPay[day].push(new PayElement("guarantee", guaranteeHours, day, rateTables, s.ojtShift, higherDuties));
                }

                //Weekend Penalties
                if(s.shiftWorkedNumber <= ordinaryDays) { //not OT shift only
                    let penaltyTime = Math.min(shiftPayGrade.ordinaryHours, normalHours);
                    if(day == 5 || day == 12) { //friday shift
                        if(tomorrowNormalHours > 0.0) { //time into saturday
                            penaltyTime -= todayNormalHours;
                            if(penaltyTime > 0.0) {
                                shiftPay[day].push(new PayElement("wePen50", penaltyTime, day, rateTables, s.ojtShift, higherDuties)); 
                            }
                        }
                    }
                    else if(day == 6 || day == 13) { //saturday shift
                        if(todayNormalHours > 0.0) { //saturday time
                            shiftPay[day].push(new PayElement("wePen50", Math.min(todayNormalHours, shiftPayGrade.ordinaryHours), day, rateTables, s.ojtShift, higherDuties));
                        }
                        penaltyTime -= todayNormalHours;
                        if(tomorrowNormalHours > 0.0 && penaltyTime > 0.0) { //sunday time
                            shiftPay[day].push(new PayElement("wePen100", penaltyTime, day, rateTables, s.ojtShift, higherDuties));
                        }
                    }
                    else if(day == 0 || day == 7) { //sunday
                        if(todayNormalHours > 0.0) { //sunday time
                            shiftPay[day].push(new PayElement("wePen100", Math.min(todayNormalHours, shiftPayGrade.ordinaryHours), day, rateTables, s.ojtShift, higherDuties));
                        }
                    }
                }

                //extended shift hours for part-time non-driver
                let extShiftTodayHours = 0.0;
                let extShiftTomorrowHours = 0.0;
                if(partTimeNonDriver && s.extendedShift && s.extendedShiftMinutes > 0) {
                    extShiftTodayHours = s.extendedShiftMinutes/60;
                    if(s.endHour48 + s.endMinute/60 + extShiftTodayHours > 24) {
                        if(s.endHour48 > 23) {
                            extShiftTomorrowHours = extShiftTodayHours;
                            extShiftTodayHours = 0;
                        }
                        else {
                            extShiftTomorrowHours = (s.endHour48 + s.endMinute/60 + extShiftTodayHours) - 24;
                            extShiftTodayHours -= extShiftTomorrowHours;
                        }
                    }
                }
                
                
                if(extShiftTodayHours > 0.0 || extShiftTomorrowHours > 0.0) {
                    let ot150time = 0.0;
                    let ot200time = 0.0;
                    let ot250time = 0.0;
                    if(extShiftTodayHours > 0.0) {
                        if(s.ph) ot250time += extShiftTodayHours;
                        else if (day == 0 || day == 7) ot200time += extShiftTodayHours;
                        else ot150time += extShiftTodayHours;
                    }
                    if(extShiftTomorrowHours > 0.0) {
                        if(tomorrowPh) ot250time += extShiftTomorrowHours;
                        else if (day == 6 || day == 13) ot200time += extShiftTomorrowHours;
                        else ot150time += extShiftTomorrowHours;
                    }

                    if(ot150time > 0.0) shiftPay[day].push(new PayElement("ot150", ot150time, day, rateTables, s.ojtShift, higherDuties));
                    if(ot200time > 0.0) shiftPay[day].push(new PayElement("ot200", ot200time, day, rateTables, s.ojtShift, higherDuties));
                    if(ot250time > 0.0) shiftPay[day].push(new PayElement("ot250", ot250time, day, rateTables, s.ojtShift, higherDuties));
                }

/*
                if(day == 0 || day == 7) {
                    if(extShiftTodayHours > 0.0) {
                        ot200time += extShiftTodayHours;
                    }
                    if(extShiftTomorrowHours > 0.0) {
                        ot150time += extShiftTomorrowHours
                    }
                }
                else if(day == 6 || day == 13 && extShiftTomorrowHours > 0.0) {
                    shiftPay[day].push(new PayElement("ot150", extShiftTodayHours, day, rateTables, s.ojtShift, higherDuties));
                    shiftPay[day].push(new PayElement("ot200", extShiftTomorrowHours, day, rateTables, s.ojtShift, higherDuties));
                    if(extShiftTodayHours > 0.0) 
                }
                else if(extShiftTodayHours > 0.0 || extShiftTomorrowHours > 0.0){
                    shiftPay[day].push(new PayElement("ot150", extShiftTodayHours + extShiftTomorrowHours, day, rateTables, s.ojtShift, higherDuties));
                }*/

                

                //console.log(`Day ${day}: today: ${extShiftTodayHours}h | tomorrow: ${extShiftTomorrowHours}h`);

/*this may need a bit of time. Need to split today and tomorrow extended shift hours so that portions of extended shift that land on 
a PH or weekend get the increased rate. Extended shift is OT pay code. Rostered OT is Rost+50. May need to add the word '"rostered" sign on/off' to page
*/



                //Excess Hours Overtime
                if((normalHours > shiftPayGrade.ordinaryHours) && s.shiftWorkedNumber <= ordinaryDays) {
                    let overtimeHours = normalHours - shiftPayGrade.ordinaryHours;
                    let todayOvertimeHours = 0.0;
                    let tomorrowOvertimeHours = 0.0;
                    let rost50hours = 0.0;
                    let rost100hours = 0.0;
                    let excessHoursThreshold = payGrade.excessHoursThreshold;

                    if(todayNormalHours > shiftPayGrade.ordinaryHours){
                        todayOvertimeHours = todayNormalHours - shiftPayGrade.ordinaryHours;
                    }
                    tomorrowOvertimeHours = overtimeHours - todayOvertimeHours;
                    if((day == 6 || day == 13) && tomorrowOvertimeHours > 0.0) {
                        if(todayOvertimeHours > excessHoursThreshold) {
                            rost50hours = excessHoursThreshold;
                            rost100hours = overtimeHours - excessHoursThreshold;
                        }
                        else {
                            rost50hours = todayOvertimeHours;
                            rost100hours = tomorrowOvertimeHours;
                        }
                    }
                    else if(day == 0 || day == 7 && todayOvertimeHours > 0.0) {
                        if(overtimeHours > excessHoursThreshold) {
                            rost100hours = todayOvertimeHours;
                            rost50hours = Math.max(0, excessHoursThreshold - todayOvertimeHours)
                            rost100hours += tomorrowOvertimeHours - rost50hours;
                        }
                        else {
                            rost50hours = tomorrowOvertimeHours;
                            rost100hours = todayOvertimeHours
                        }
                    }
                    else {
                        if(overtimeHours > excessHoursThreshold) {
                            rost50hours = excessHoursThreshold;
                            rost100hours = overtimeHours - excessHoursThreshold;
                        }
                        else {
                            rost50hours = overtimeHours;
                        }
                    }

                    let rost50Element = "rost+50";
                    let rost100Element = "rost+100";
                    if(partTimeNonDriver) {
                        rost50Element = "ot150";
                        rost100Element = "ot200";
                    }

                    if(rost50hours > 0.0) shiftPay[day].push(new PayElement(rost50Element, rost50hours, day, rateTables, s.ojtShift, higherDuties));
                    if(rost100hours > 0.0) shiftPay[day].push(new PayElement(rost100Element, rost100hours, day, rateTables, s.ojtShift, higherDuties));
                    if(overtimeHours > 2) shiftPay[day].push(new PayElement("mealAllowanceOT", 1, day, rateTables));
                }

                /*//Shift Extended Overtime (part-time non-driving grades)
                if(partTimeNonDriver && s.extendedShift && s.extendedShiftMinutes > 0) {
                    shiftPay[day].push(new PayElement("ot150", s.extendedShiftMinutes/60, day, rateTables, false, higherDuties));
                }*/

                //Excess Shift Overtime
                if(s.shiftWorkedNumber > ordinaryDays){
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
                    if(ot150Hours > 0.0) shiftPay[day].push(new PayElement("ot150", ot150Hours, day, rateTables, s.ojtShift, higherDuties));
                    if(ot200Hours > 0.0) shiftPay[day].push(new PayElement("ot200", ot200Hours, day, rateTables, s.ojtShift, higherDuties));
                }

                //Shiftwork Allowances
                if(s.shiftWorkedNumber <= ordinaryDays && day != 6 && day != 13) { //excess shifts and saturdays not eligible
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
                    shiftworkHours = Math.round(Math.min(shiftworkHours, shiftPayGrade.ordinaryHours)); //capped at ordinary hours. rounded to nearest whole hour
                    if(shiftworkHours > 0.0) {
                        if(s.startHour == 4 || (s.startHour == 5 && s.startMinute <= 30)) { //early shift
                            shiftPay[day].push(new PayElement("earlyShift", shiftworkHours, day, rateTables, false));
                        }
                        if(s.startHour < 18 && (s.endHour48 > 18 || (s.endHour48 == 18 && s.endMinute >= 30))) { //afternoon shift
                            shiftPay[day].push(new PayElement("afternoonShift", shiftworkHours, day, rateTables, false));
                        }
                        if((s.startHour >= 18 && s.startHour <= 23) || (s.startHour >= 0 && s.startHour <= 3)) { //night shift
                            shiftPay[day].push(new PayElement("nightShift", shiftworkHours, day, rateTables, false));
                        }
                    }
                }
            }
        }
        //bonus pay
        if(s.bonus) {
            if(s.bonusHours > 0) {
                shiftPay[day].push(new PayElement("bonusPayment", s.bonusHours, day, rateTables)); 
            }
        }
        //relieving expenses
        if(s.relievingExpenses && shiftPayGrade.relievingExpenses) {
            shiftPay[day].push(new PayElement("relExp", 1, day, rateTables));
        }
        //suburban group working
        if(getSuburbanGroupWorking() && shiftPayGrade.suburbanGroupWorking && !(shiftHours <= 0 && (s.sick || s.al || s.lsl || s.phc))) {
            shiftPay[day].push(new PayElement("suburbanGroupWorking", 1, day, rateTables));
        }
        //suburban allowance
        if(shiftPayGrade.suburbanAllowance && s.shiftWorkedNumber > 0) {
            shiftPay[day].push(new PayElement("metroSig2", 1, day, rateTables));
        }
        //disruption allowance
        if(s.disruption && s.shiftWorkedNumber > 0 && shiftPayGrade.relievingExpenses) {
            shiftPay[day].push(new PayElement("disruption", s.hoursDecimal, day, rateTables));
        }
        //wasted meal
        if(s.wm && shiftPayGrade.drivingGrade) {
            shiftPay[day].push(new PayElement("mealAllowanceWasted", 1, day, rateTables));
        }
    }

    let rateTables = {
        gradeRates: grades[getPayGrade()].payRates,
        earlyShiftRates:  grades[getPayGrade()].earlyShiftRates,
        afternoonShiftRates:  grades[getPayGrade()].afternoonShiftRates,
        nightShiftRates:  grades[getPayGrade()].nightShiftRates
    };

    //pay calculation: pass 2. determine and cap which days to pay annual and long service leave on.
    //AL capped at 5 days per week, with any sick or PH-Gaz day during annual leave to be paid in place of annual leave.
    //LSL capped at 5 days per week, with any PH-Gaz paid in place of LSL.
    for(let i = 0; i < 2; i++) {
        let endWeekDay = [7, 14];
        if(alShifts[i] > 0) {
            if(alShifts[i] > 5 && payGrade.drivingGrade) alShifts[i] = 5; //cap at 5 annual leave shifts if more than 5 shifts are set to annual leave (driving grades only)
            if(alShifts[i] + deductAnnualLeaveShifts[i] > 5) {
                alShifts[i] -= deductAnnualLeaveShifts[i]; //deduct any sick or PH-Gaz shifts from annual leave count
            }
            for(let j = endWeekDay[i] - 7; j < endWeekDay[i]; j++) {
                if(shifts[j].al && (!(shifts[j].ph && !shifts[j].phOffRoster) && !shifts[j].sick && !shifts[j].phc && !shifts.ddo) && alShifts[i] > 0) {
                    alShifts[i]--;
                    shiftPay[j].push(new PayElement("annualLeave", payGrade.ordinaryHours, j, rateTables));
                    shiftPay[j].push(new PayElement("leaveLoading", payGrade.ordinaryHours, j, rateTables));
                }
            }
        }
        if(lslShifts[i] > 0) {
            if(lslShifts[i] > 5 && payGrade.drivingGrade) lslShifts[i] = 5; //cap at 5 annual leave shifts if more than 5 shifts are set to long service leave (driving grades only)
            if(lslShifts[i] + deductLSLShifts[i] > 5) {
                lslShifts[i] -= deductLSLShifts[i]; //deduct PH-Gaz shifts from long service leave count
            }
            for(let j = endWeekDay[i] - 7; j < endWeekDay[i]; j++) {
                if(shifts[j].lsl && (!(shifts[j].ph && !shifts[j].phOffRoster) && !shifts[j].phc && !shifts.ddo) && lslShifts[i] > 0) {
                    lslShifts[i]--;
                    if(shifts[j].lslHalfPay) {
                        shiftPay[j].push(new PayElement("longServiceLeaveHalf", payGrade.ordinaryHours / 2, j, rateTables)); //half ordinary hours
                    }
                    else {
                        shiftPay[j].push(new PayElement("longServiceLeaveFull", payGrade.ordinaryHours, j, rateTables)); //full ordinary hours
                    }
                }
            }
        }
    }

    //pay calculation: DDO.
    if(payGrade.ddo && getEmploymentType() == "fulltime") {
        let day = ddoWeek();
        if(day < 0) {
            shiftPay[0].push(new PayElement("edo", -4, 0, rateTables));
        }
        else {
            shiftPay[day].push(new PayElement("edo", 4, day, rateTables));
        }
    }
}

/**
 * Calculate tax and and any tax related elements based on the settings found in the configuration menu.
 * Tax elements are added to the taxPay[] array.
 * @param {number} payElements - 
 * @returns {number[]} number array with the following calculated values [post tax deduction, tax amount, net amount]
 */
function calculateTax(payElements) {
    taxPay = [];
    let taxableIncome = 0;
    let grossIncome = 0;
    let taxBalance = 0;
    let preTaxDeduction = 0;
    let preTaxAllowance = 0;
    let postTaxDeduction = 0;
    let taxFreeThreshold = true, stsl = false, etdscMembership, superSalSac = 0, superSalSacPercent = false, novatedLeasePreTax = 0, novatedLeasePostTax = 0, additionalTaxWithheld = 0, additionalTaxWithheldPercent = false;

    payElements.forEach(function(e){
        if(!["mealAllowanceWasted"].includes(e.payType)) { //all except wasted meal added to taxable income
            taxableIncome += parseFloat(e.value.toFixed(2));
        }
        /*else {
            preTaxAllowance += parseFloat(e.value.toFixed(2));
        }*/

        if(["earlyShift", "afternoonShift", "nightShift", "metroSig2", "mealAllowanceWasted", "leaveLoading"].includes(e.payType)) {
            preTaxAllowance += parseFloat(e.value.toFixed(2)); //add allowances to pre-tax allowance subtotal
        }
        if(["mealAllowanceOT"].includes(e.payType)) {
            postTaxDeduction += parseFloat(e.value.toFixed(2)); //add allowances to post-tax deduction subtotal
        }
        grossIncome += parseFloat(e.value.toFixed(2));
    });

    if(getSaveData("taxFreeThreshold", false) == "no") taxFreeThreshold = false; //using 'no' instead of 'false' in order to make 'true' the default if unset.
    if(getSaveData("stsl", false) == "yes") stsl = true;
    if(getSaveData("etdscMembership", false)) etdscMembership = getSaveData("etdscMembership", false);
    if(getSaveData("superSalSac", false)) superSalSac = Math.abs(parseFloat(getSaveData("superSalSac", false)));
    if(getSaveData("superSalSacPercent", false)) superSalSacPercent = true;
    if(getSaveData("novatedLeasePre", false)) novatedLeasePreTax =  Math.abs(parseFloat(getSaveData("novatedLeasePre", false)));
    if(getSaveData("novatedLeasePost", false)) novatedLeasePostTax =  Math.abs(parseFloat(getSaveData("novatedLeasePost", false)));
    if(getSaveData("withholdExtra", false)) additionalTaxWithheld =  Math.abs(parseFloat(getSaveData("withholdExtra", false)));
    if(getSaveData("withholdExtraPercent", false)) additionalTaxWithheldPercent = true;

    let fortnightEndDate = $("#week-commencing-date").datepicker("getDate"); //date for finding relevant tax tables
    fortnightEndDate.setDate(fortnightEndDate.getDate() + 13);

    
    //calculate pre-tax deductions first
    //novated lease pre-tax
    if(!isNaN(novatedLeasePreTax)) {
        novatedLeasePreTax *= -1;
        if(novatedLeasePreTax != 0) {
            taxPay.push(new TaxElement("Novated Lease Pre-Tax", novatedLeasePreTax, 4));
            taxableIncome += novatedLeasePreTax;
            preTaxDeduction += novatedLeasePreTax;
        }
    }
    //custom pre-tax entries
    for(let i = 0; i < numberOfCustomPreTaxFields; i++) {
        let descriptionId = "customPreTaxDescription" + i.toString();
        let valueId = "customPreTaxValue" + i.toString();
        let description = getSaveData(descriptionId, false);
        if(description) description = description.trim();
        let value = Math.abs(parseFloat(getSaveData(valueId, false)));
        if(description && !isNaN(value) && value != 0) { //if both fields populated and valid
            value *= -1;
            taxPay.push(new TaxElement(description, value, 3));
            taxableIncome += value;
            preTaxDeduction += value;
        }
    }

    //super salary sacrifice
    if(!isNaN(superSalSac)) {
        if(superSalSacPercent) {
            superSalSac = grossIncome * (superSalSac/100);
        }
        superSalSac *= -1;
        if(superSalSac != 0) {
            taxPay.push(new TaxElement("Super Salary Sacrifice", superSalSac, 3));
            taxableIncome += superSalSac;
            preTaxDeduction += superSalSac;
        }
    }

    //income tax
    //find correct scale and rates
    let weeklyTaxableIncome = Math.floor(taxableIncome / 2) + 0.99; //weekly income calculated as per ATO tax formula
    let taxScale, taxScaleIndex = 0;
    for(let i = taxScales.length - 1; i >= 0; i--) {
        if(fortnightEndDate.stripTime().getTime() >= new Date(taxScales[i].startDate).stripTime().getTime()){
            if(taxFreeThreshold) taxScale = taxScales[i].scale2;
                else taxScale = taxScales[i].scale1;
            while(weeklyTaxableIncome > taxScale[taxScaleIndex][0]) {
                taxScaleIndex++;
            }
            break;
        } 
    }
    if(!taxScale) {
        console.warn("Tax rates not found for fortnight ending " + fortnightEndDate.toDDMMYYYY());
        return;
    };
    //calculate income tax and add element to tax table
    let incomeTax;
    let customFixedTaxRate = parseFloat(getSaveData("fixedTaxRate", false)) / 100;
    if(customFixedTaxRate) { //fixed tax rate set in tax configurator
        incomeTax = Math.round(taxableIncome * customFixedTaxRate);
    }
    else { //default sliding scale tax rate
        incomeTax = Math.round((weeklyTaxableIncome * taxScale[taxScaleIndex][1]) - taxScale[taxScaleIndex][2]) * 2;
    }
    
    incomeTax *= -1;
    if(incomeTax != 0) {
        taxPay.push(new TaxElement("Income Tax", incomeTax, 0));
        taxBalance += incomeTax;
    }

    //etdsc membership
    if(etdscMembership == "full") {
        taxPay.push(new TaxElement("Electric Train Drivers Social Club", -etdscFullMemberRate, 6));
        postTaxDeduction -= etdscFullMemberRate;
    }
    else if(etdscMembership == "half") {
        taxPay.push(new TaxElement("Electric Train Drivers Social Club", -etdscHalfMemberRate, 6));
        postTaxDeduction -= etdscHalfMemberRate;
    }
    else if(etdscMembership == "jobshare") {
        taxPay.push(new TaxElement("Electric Train Drivers Social Club", -etdscJobshareMemberRate, 6));
        postTaxDeduction -= etdscJobshareMemberRate;
    }

    //student loan
    if(stsl) {
        let stslScale, stslScaleIndex = 0;
        for(let i = stslScales.length - 1; i >= 0; i--) {
            if(fortnightEndDate.stripTime().getTime() >= new Date(stslScales[i].startDate).stripTime().getTime()){
                if(taxFreeThreshold) stslScale = stslScales[i].scale2;
                    else stslScale = stslScales[i].scale1;
                while(weeklyTaxableIncome > stslScale[stslScaleIndex][0]) {
                    stslScaleIndex++;
                }
                break;
            } 
        }
        if(!stslScale) {
            console.warn("STSL rates not found for fortnight ending " + fortnightEndDate.toDDMMYYYY());
            return;
        };
        let studentLoanRepayment = Math.round(weeklyTaxableIncome * stslScale[stslScaleIndex][1]) * 2;
        studentLoanRepayment *= -1;
        if(studentLoanRepayment != 0) {
            taxPay.push(new TaxElement("Study & Training Support Loan", studentLoanRepayment, 10));
            taxBalance += studentLoanRepayment; 
        }
    }

    //novated lease post-tax
    if(!isNaN(novatedLeasePostTax)) {
        novatedLeasePostTax *= -1;
        if(novatedLeasePostTax != 0) {
            taxPay.push(new TaxElement("Novated Lease Post-Tax", novatedLeasePostTax, 5));
            postTaxDeduction += novatedLeasePostTax;
        }
    }

    //extra tax
    if(!isNaN(additionalTaxWithheld)) {
        if(additionalTaxWithheldPercent) {
            additionalTaxWithheld = grossIncome * (additionalTaxWithheld/100);
        }
        additionalTaxWithheld *= -1;
        if(additionalTaxWithheld != 0) {
            taxPay.push(new TaxElement("Extra Tax", additionalTaxWithheld, 1));
            taxBalance += additionalTaxWithheld;
        }
    }

    //custom post-tax deductions
    for(let i = 0; i < numberOfCustomPostTaxFields; i++) {
        let descriptionId = "customPostTaxDescription" + i.toString();
        let valueId = "customPostTaxValue" + i.toString();
        let description = getSaveData(descriptionId, false);
        if(description) description = description.trim();
        let value = Math.abs(parseFloat(getSaveData(valueId, false)));
        if(description && !isNaN(value) && value != 0) { //if both fields populated and valid
            value *= -1;
            taxPay.push(new TaxElement(description, value, 5));
            postTaxDeduction += value;
        }
    }

    let netIncome = grossIncome + taxBalance + postTaxDeduction + preTaxDeduction;
    
    return {postTaxDeduction: postTaxDeduction, taxBalance: taxBalance, netIncome: netIncome, taxableIncome: taxableIncome, preTaxDeduction: preTaxDeduction, preTaxAllowance: preTaxAllowance};
}

//Data storage
/**
 * Test the brower for storage availablilty of a specified type
 * @param {string} type - storage type
 * @returns {boolean} - storage available true/false
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

/**
 * Save a key-value pair to the browser's localStorage. By default, the fortnight-commencing date is prepended to the key to associate the save data with a particular fortnight. Saving to the same key+value+datePrefix will overwrite any existing data, or create new localStorage data if non-existant.
 * @param {string} key - the name of the key to be saved (ie: "day4ph")
 * @param {string} value - the data to be saved to the key (ie: "true")
 * @param {boolean} [prefixDate=true] - (Optional. Default = true) Prefixes the fortnight-commencing date (YYYYMMDD format) to the key if set to true. If false, nothing is prepended to the key.
 */
function setSaveData(key, value, prefixDate = true) {
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
            localStorage.removeItem(datePrefix + key);
        }
        else {
            try {
                localStorage.setItem((datePrefix + key), value);
            }
            catch(ex) {
                console.warn("setSaveData(): unable to save data. exception thrown:");
                console.warn(ex.message)
            }
        }
    }
}

/**
 * Retrieve a value from localStorage with the specified key/key. By default, the currently selected fortnight-commencing date (YYYYMMDD format) is prefixed to the key. For keys that aren't associated to a particular f/c date, set prefixDate to false.
 * @param {string} key - the name of the key to retrieve data from.
 * @param {boolean} [prefixDate=true] - (Optional. Default = true) Prefixes the fortnight-commencing date (YYYYMMDD format) to the key if set to true. If false, nothing is prepended to the key.
 * @returns {string} the value in localStorage associated with the provided key.
 */
function getSaveData(key, prefixDate = true) {
    let weekCommencingDate = $("#week-commencing-date").datepicker("getDate");
    let datePrefix = "";
    if(prefixDate){ //date will be automatically prefixed to save key unless specified in parameters. date prefix binds the save data to the currently set date.
        datePrefix += weekCommencingDate.getFullYear().toString() + (weekCommencingDate.getMonth() + 1).toString().padStart(2, "0") + weekCommencingDate.getDate().toString();
    }
    return localStorage.getItem((datePrefix + key));
}

//populates fields with any saved data on the selected date. using no date parameter will load from the current date.
/**
 * Get all saved data from localStorage for a given fortnight-commencing date and populate any relevant calculator fields with the retrieved data. If no datePrefix is given, the currently selected fortnight-commencing date is used by default.
 * @param {string} [datePrefix=""] - (Optional) The fortnight-commencing date prefix (YYYYMMDD format) to use when retrieving data from localStorage. 
 */
function loadSavedData(datePrefix = "") {
    closeAllOptionsShelves();

    //reset shifts table
    shifts = []; 
    for (let i = 0; i < 14; i++) shifts.push(new Shift(i));

    if(datePrefix === "") {
        let weekCommencingDate = $("#week-commencing-date").datepicker("getDate");
        datePrefix += weekCommencingDate.getFullYear().toString() + (weekCommencingDate.getMonth() + 1).toString().padStart(2, "0") + weekCommencingDate.getDate().toString();
    }
    let savedPayGrade = getSaveData("paygrade");
    let savedEmploymentType = getSaveData("employmenttype");
    let savedSuburbanGroupWorking = getSaveData("suburbanGroupWorking");

    if(savedPayGrade == null) {
        savedPayGrade = getSaveData("paygrade", false);
        if(savedPayGrade == null) {
            savedPayGrade = "none"; //default grade

        }
    }

    //convert old parttime and jobshare grades to new grade + employment-type
    if (savedPayGrade == "parttime") { 
        savedPayGrade = "spot";
        savedEmploymentType = "parttime";
        setSaveData("employmenttype", savedEmploymentType, false);
    }
    else if (savedPayGrade == "jobshare") {
        savedPayGrade = "spot";
        savedEmploymentType = "jobsharefwa";
        setSaveData("employmenttype", savedEmploymentType, false);
    }

    if(savedEmploymentType == null) {
        savedEmploymentType = getSaveData("employmenttype", false);
        if(savedEmploymentType == null) {
            savedEmploymentType = "fulltime"; //default employment type
        }
    }

    if(savedSuburbanGroupWorking == null) {
        savedSuburbanGroupWorking = getSaveData("suburbanGroupWorking", false);
        if(savedSuburbanGroupWorking == null) {
            savedSuburbanGroupWorking == "false";
        }
    }

    if(savedSuburbanGroupWorking == "true") {
        document.getElementById("suburban-group-working").checked = true;
    }
    else {
        document.getElementById("suburban-group-working").checked = false;
    }

    document.getElementById("pay-grade").value = savedPayGrade;
    document.getElementById("employment-type").value = savedEmploymentType;
    
    //shift options save data
    for(let day = 0; day < 14; day++) {
        let ojtSave = getSaveData("day" + day + "ojt");
        let ddoSave = getSaveData("day" + day + "ddo");
        let wmSave = getSaveData("day" + day + "wm");
        let sickSave = getSaveData("day" + day + "sick");
        let phSave = getSaveData("day" + day + "ph");
        let phxpSave = getSaveData("day" + day + "phxp");
        let phorSave = getSaveData("day" + day + "phor");
        let alSave = getSaveData("day" + day + "al");
        let lslSave = getSaveData("day" + day + "lsl");
        let lslHalfPaySave = getSaveData("day" + day + "lslHalfPay");
        let phcSave = getSaveData("day" + day + "phc");
        let relExpSave = getSaveData("day" + day + "relievingExpenses");
        let suburbanGroupWorkingSave = getSaveData("day" + day + "suburbanGroupWorking");
        let higherDutiesSave = getSaveData("day" + day + "higherDuties");
        let higherDutiesGradeSave = getSaveData("day" + day + "higherDutiesGrade");
        let extendedShiftSave = getSaveData("day" + day + "extendedShift");
        let extendedShiftStartTimeSave = getSaveData("day" + day + "extendedShiftStartTime");
        let bonusSave = getSaveData("day" + day + "bonus");
        let bonusHoursSave = getSaveData("day" + day + "bonusHours");
        let teamLeaderSave = getSaveData("day" + day + "teamLeader");

        if(ojtSave == "true") shifts[day].ojt = true;
        if(ddoSave == "true") shifts[day].ddo = true;
        if(wmSave == "true") shifts[day].wm = true;
        if(sickSave == "true") shifts[day].sick = true;
        if(phSave == "true") shifts[day].ph = true;
        if(phxpSave == "true") shifts[day].phExtraPay = true;
        if(phorSave == "true") {
            shifts[day].phOffRoster = true;
            shifts[day].phOffRosterNoPay = false;
        }
        if(phorSave == "nopay") {
            shifts[day].phOffRoster = true;
            shifts[day].phOffRosterNoPay = true;
        }
        if(alSave == "true") shifts[day].al = true;
        if(lslSave == "true") shifts[day].lsl = true;
        if(lslHalfPaySave == "true") shifts[day].lslHalfPay = true;
        if(phcSave == "true") shifts[day].phc = true;
        if(relExpSave == "true") shifts[day].relievingExpenses = true;
        if(suburbanGroupWorkingSave == "true") shifts[day].suburbanGroupWorking = true;
        if(higherDutiesSave == "true") shifts[day].higherDuties = true;
        if(higherDutiesGradeSave) shifts[day].higherDutiesGrade = higherDutiesGradeSave;
        if(extendedShiftSave == "true") shifts[day].extendedShift = true;
        if(extendedShiftStartTimeSave) shifts[day].extendedShiftStartTime = extendedShiftStartTimeSave;
        if(bonusSave == "true") shifts[day].bonus = true;
        if(bonusHoursSave) shifts[day].bonusHours = parseFloat(bonusHoursSave);
        if(teamLeaderSave == "true") shifts[day].teamLeader = true;
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

/**
 * Prompt the user with a dialog box asking if they'd like to delete all saved data. If the user clicks 'OK' then localStorage will be cleared and the page reloaded.
 */
function confirmDeleteData() {
    if(confirm("Are you sure you want to delete ALL of your saved data from ALL dates?")){
        localStorage.clear();
        alert("All save data has been deleted!");
        location.reload();
    }
}

/**
 * Clear all input fields and shift-options for the current fortnight and recalculate based on the cleared data.
 */
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
        setSaveData("day" + day + "phor", "");
        setSaveData("day" + day + "al", "");
        setSaveData("day" + day + "lsl", "");
        setSaveData("day" + day + "lslHalfPay", "");
        setSaveData("day" + day + "phc", "")
        setSaveData("day" + day + "relievingExpenses", "")
        setSaveData("day" + day + "suburbanGroupWorking", "")
        setSaveData("day" + day + "higherDuties", "")
        setSaveData("day" + day + "higherDutiesGrade", "")
        setSaveData("day" + day + "bonus", "");
        setSaveData("day" + day + "bonusHours", "");
        setSaveData("day" + day + "teamLeader", "");
        

        shifts[day].ojt = false;
        shifts[day].ddo = false;
        shifts[day].wm = false;
        shifts[day].sick = false;
        shifts[day].ph = false;
        shifts[day].phExtraPay = false;
        shifts[day].phOffRoster = false;
        shifts[day].phOffRosterNoPay = false;
        shifts[day].al = false;
        shifts[day].lsl = false;
        shifts[day].lslHalfPay = false;
        shifts[day].phc = false;
        shifts[day].relievingExpenses = false;
        shifts[day].suburbanGroupWorking = false;
        shifts[day].higherDuties = false;
        shifts[day].higherDutiesGrade = "";
        shifts[day].bonus = false;
        shifts[day].bonusHours = 0.0;
        shifts[day].teamLeader = false;

    }
    setSaveData("day14ph", "");
    day14ph = false;

    updateShiftTable();
    updateShiftWorkedCount();
    printShiftHours();
    validateTimeFields();
    updateOptionsButtons();
    updateShiftPayTable();
    updateResults();
    closeAllOptionsShelves();
}

/**
 * **INCOMPLETE** Display a printable version of the calculator page.
 */
function showPrintView() {
    $("body").css("background-color", "#FFF");
    $("body").css("color", "#000");
    $(".row").hide();
    let selectedDate = $("#week-commencing-date").datepicker("getDate");
    let printViewDiv = document.createElement("div");
    printViewDiv.id = "printViewDiv";
    printViewDiv.innerHTML = "<h3>Fortnight Commencing " + selectedDate.getDate() + "/" + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear() +  "</h3>";
    
    let shiftBox = document.createElement("div");
    let resultBox = document.createElement("div");

    let shiftTable = document.createElement("table");
    let shiftTableTopRow = document.createElement("thead");
    let shiftTableTitle = document.createElement("td");
    shiftTableTitle.textContent = "Shift Details";
    shiftTableTopRow.appendChild(shiftTableTitle);

    shiftTable.appendChild(shiftTableTopRow);
    shiftBox.appendChild(shiftTable);

    printViewDiv.appendChild(shiftBox);
    printViewDiv.appendChild(resultBox);
    document.body.appendChild(printViewDiv);
}

function importExportMenu() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById("helpboxTitle").textContent = "Import/Export Save Data";
    let contentElement = document.getElementById("helpboxContent");
    contentElement.style.maxHeight = "unset"; //allow form to be full height (avoid scrollable behaviour)
    contentElement.innerHTML = ""; //clear any existing content

    let headerText = document.createElement('div');
    headerText.innerHTML = "Transfer save data from one instance of the Pay Calculator to another. <hr>"
    + "<ol><li>Click the EXPORT button below to copy the save data text from this Pay Calculator to the clipboard.</li>"
    + "<li>If the Pay Calculator you are importing to is on another device, you'll need to send the save data text to the new device (such as via email, text message, etc).</li>"
    + "<li>Open the Import/Export menu on the second Pay Calculator and paste the save data text from the first calculator into the textbox below, then press IMPORT.</li></ol>"
    + "<br><em>PLEASE NOTE:</em> Importing data will not delete any existing data. If you wish to clear any existing data first, you can do so from the <a href='javascript:topHelpBoxPreset(\"saveInfo\");'>Save Data Info</a> menu.<hr>";
    
    let importExportTextArea = document.createElement('textarea');
    importExportTextArea.id = "importExportTextArea";

    let buttonDiv = document.createElement('div');
    let messageDiv = document.createElement('div');

    let exportButton = document.createElement("button");
    exportButton.classList.add("button", "export-button");
    exportButton.textContent = "Export";
    exportButton.addEventListener('click', () => {
        let saveData = JSON.stringify(localStorage);
        importExportTextArea.value = saveData;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(saveData).then(function() {
                console.log('Copying save data to clipboard was successful!');
                messageDiv.innerHTML = "<span>Save data successfully copied to clipboard!</span>";
                importExportTextArea.focus();
                importExportTextArea.select();
            }, function(err) {
                console.warn('Async: Could not copy text: ', err);
                messageDiv.innerHTML = "<span>Manually copy all of the text from the textbox above.</span>";
                importExportTextArea.focus();
                importExportTextArea.select();
            });
        }
    }); 

    let importButton = document.createElement("button");
    importButton.classList.add("button", "import-button");
    importButton.textContent = "Import";
    importButton.addEventListener('click', () => {
        let success = false;
        try {
            let data = JSON.parse(importExportTextArea.value);
            Object.keys(data).forEach(function(k){
                localStorage.setItem(k, data[k]);
                success = true;
            });
        } catch (err) {
            success = false;
            console.warn('Failed to parse JSON import data.', err);
        }
        if(success) {
            messageDiv.innerHTML = "<span>Import successful!</span>";
            alert("Save data import successful!");
            location.reload();
        }
        else {
            messageDiv.innerHTML = "<span>Import failed! Please check the save data text has been copied accurately into the textbox above.</span>";
        }
    });

    
    buttonDiv.append(exportButton, importButton)
    contentElement.append(headerText, importExportTextArea, buttonDiv, messageDiv);

    //show helpbox
    $("#topHelpDiv").addClass("show-top-helpbox");
    if(helpboxContent.scrollHeight > helpboxContent.clientHeight) {
        $(".scroll-indicator").show()
    }
    else {
        $(".scroll-indicator").hide()
    }
}

/**
 * Creates a help box window with functionality to set leave in bulk
 */
function bulkLeaveMenu() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById("helpboxTitle").textContent = "Bulk Leave Input";
    let contentElement = document.getElementById("helpboxContent");
    contentElement.style.maxHeight = "unset"; //allow form to be full height (avoid scrollable behaviour)
    contentElement.innerHTML = ""; //clear any existing content
    let formHeader = document.createElement("div");
    formHeader.classList.add("grid-1-3")
    formHeader.innerHTML = "<em>Input Annual, Long Service and PH Credit Leave in bulk.</em><hr>";
    let formArea = document.createElement("form");
    formArea.id = "bulkLeave";
    formArea.classList.add("grid-taxform"); //use tax configurator layout

    //leave type dropdown
    let leaveTypeId = "leaveType";
    let leaveTypeLabel = document.createElement("span");
    leaveTypeLabel.textContent = "Leave Type";
    let leaveTypeInput = document.createElement("select");
    leaveTypeInput.id = leaveTypeId;
    let leaveTypeInputOptionAnnualLeave = document.createElement("option");
    leaveTypeInputOptionAnnualLeave.textContent = "Annual Leave";
    leaveTypeInputOptionAnnualLeave.setAttribute("value", "al")
    let leaveTypeInputOptionLslFullPay = document.createElement("option");
    leaveTypeInputOptionLslFullPay.textContent = "Long Service Full-Pay";
    leaveTypeInputOptionLslFullPay.setAttribute("value", "lsl")
    let leaveTypeInputOptionLslHalfPay = document.createElement("option");
    leaveTypeInputOptionLslHalfPay.textContent = "Long Service Half-Pay";
    leaveTypeInputOptionLslHalfPay.setAttribute("value", "lslHalfPay")
    let leaveTypeInputOptionPhc = document.createElement("option");
    leaveTypeInputOptionPhc.textContent = "Public Holiday Credit";
    leaveTypeInputOptionPhc.setAttribute("value", "phc")

    leaveTypeInput.appendChild(leaveTypeInputOptionAnnualLeave);
    leaveTypeInput.appendChild(leaveTypeInputOptionLslFullPay);
    leaveTypeInput.appendChild(leaveTypeInputOptionLslHalfPay);
    leaveTypeInput.appendChild(leaveTypeInputOptionPhc);
    formArea.appendChild(leaveTypeLabel);
    formArea.appendChild(leaveTypeInput);

    //start date
    let leaveStartDateId = "leaveStartDate";
    let leaveStartDateLabel = document.createElement("span");
    leaveStartDateLabel.textContent = "Leave Start Date";
    let leaveStartDateCalendar = document.createElement("input");
    leaveStartDateCalendar.type = "text";
    leaveStartDateCalendar.placeholder = "Start date";
    leaveStartDateCalendar.id = leaveStartDateId;

    //end date
    let leaveEndDateId = "leaveEndDate";
    let leaveEndDateLabel = document.createElement("span");
    leaveEndDateLabel.textContent = "Leave End Date";
    let leaveEndDateCalendar = document.createElement("input");
    leaveEndDateCalendar.type = "text";
    leaveEndDateCalendar.placeholder = "End date";
    leaveEndDateCalendar.id = leaveEndDateId;

    formArea.appendChild(leaveStartDateLabel);
    formArea.appendChild(leaveStartDateCalendar);
    formArea.appendChild(leaveEndDateLabel);
    formArea.appendChild(leaveEndDateCalendar);

    //number of leave days counter
    let leaveDaysCountId = "leaveDays";
    let leaveDaysLabel = document.createElement("span");
    leaveDaysLabel.textContent = "Days of Leave";
    let leaveDaysCount = document.createElement("span");
    leaveDaysCount.textContent = "0 days";
    leaveDaysCount.id = leaveDaysCountId;

    formArea.append(leaveDaysLabel, leaveDaysCount)

    let calculateLeaveDays = () => {
        let startDate;
        let endDate;
        
        try {
            startDate = $("#leaveStartDate").datepicker("getDate").stripTime();
            endDate = $("#leaveEndDate").datepicker("getDate").stripTime();
        }
        catch(err) {
            return 0;
        } 
        return Math.round(((endDate - startDate) / 1000 / 60 / 60 / 24) + 1);
    }

    $(function () {
        var dateFormat = "d/m/yy",
            from = $(leaveStartDateCalendar)
                .datepicker({
                    dateFormat: "d/m/yy",
                    changeMonth: true,
                    numberOfMonths: 1
                })
                .on("change", function () {
                    to.datepicker("option", "minDate", getDate(this));
                    to.datepicker("option", "defaultDate", getDate(this));
                    $("#leaveDays")[0].textContent = calculateLeaveDays() + " days";
                    if($("#leaveStartDate").datepicker("getDate") && $("#leaveEndDate").datepicker("getDate")) {
                        document.getElementById("bulkLeaveSubmit").disabled = false;
                    }
                    else {
                        document.getElementById("bulkLeaveSubmit").disabled = true;
                    }
                }),
            to = $(leaveEndDateCalendar).datepicker({
                dateFormat: "d/m/yy",
                //defaultDate: "+2w",
                changeMonth: true,
                numberOfMonths: 1
            })
                .on("change", function () {
                    from.datepicker("option", "maxDate", getDate(this));
                    $("#leaveDays")[0].textContent = calculateLeaveDays() + " days";
                    if($("#leaveStartDate").datepicker("getDate") && $("#leaveEndDate").datepicker("getDate")) {
                        document.getElementById("bulkLeaveSubmit").disabled = false;
                    }
                    else {
                        document.getElementById("bulkLeaveSubmit").disabled = true;
                    }
                });

        function getDate(element) {
            var date;
            try {
                date = $.datepicker.parseDate(dateFormat, element.value);
            } catch (error) {
                date = null;
            }

            return date;
        }
    });

    //submit button
    let emptySpan = document.createElement("span");
    let submitButton = document.createElement("button");
    submitButton.id = "bulkLeaveSubmit";
    submitButton.type = "button";
    submitButton.textContent = "Add Leave";
    submitButton.disabled = true;
    submitButton.classList.add("button", "bulk-leave-submit-button");
    submitButton.addEventListener( "click", function(){
        let startDate;
        let endDate;
        let leaveDays = calculateLeaveDays();
        try {
            startDate = $("#leaveStartDate").datepicker("getDate").stripTime();
            endDate = $("#leaveEndDate").datepicker("getDate").stripTime();
        }
        catch(err) {
            console.warn("Bulk Leave: invalid start or end date.");
            return;
        }
        
        let curDate = new Date(startDate);
        for(let i = 0; i < leaveDays; i++) {
            let currentFortnightCommencingDate = getFortnightCommencingDate(curDate);
            $("#week-commencing-date").datepicker("setDate", currentFortnightCommencingDate);
            updateDates();
            let curDateDay = curDate.getDate();
            let curFnCommencingDateDay = currentFortnightCommencingDate.getDate();
            let dayNumber = curDateDay - curFnCommencingDateDay;
            if(dayNumber < 0){
                dayNumber = curDateDay;
            }
            setSaveData("day" + dayNumber + document.getElementById("leaveType").value, "true");
            if(document.getElementById("leaveType").value == "lsl") {
                setSaveData("day" + dayNumber + "lslHalfPay", "");
            }
            if(document.getElementById("leaveType").value == "lslHalfPay") {
                setSaveData("day" + dayNumber + "lsl", "true");
            }
            curDate.setDate(curDate.getDate() + 1); //increment to next date
        }
        loadSavedData();
        updateGrade();
        updateShiftTable();
        updateShiftWorkedCount();
        printShiftHours();
        validateTimeFields();
        updateOptionsButtons();
        updateShiftPayTable();
        updateResults();
    });
    
    formArea.append(emptySpan, submitButton);


    //show helpbox
    contentElement.appendChild(formHeader);
    contentElement.appendChild(formArea);
    $("#topHelpDiv").addClass("show-top-helpbox");
    if(helpboxContent.scrollHeight > helpboxContent.clientHeight) {
        $(".scroll-indicator").show()
    }
    else {
        $(".scroll-indicator").hide()
    }
}

/**
 * Creates a help box window with settings to confugure tax and net pay
 */
function taxConfigurator() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById("helpboxTitle").textContent = "Net Income Configuration";
    let contentElement = document.getElementById("helpboxContent");
    contentElement.style.maxHeight = "unset"; //allow form to be full height (avoid scrollable behaviour)
    contentElement.innerHTML = ""; //clear any existing content
    let formHeader = document.createElement("div");
    formHeader.classList.add("grid-1-3")
    formHeader.innerHTML = "<em>Configure settings for tax, net and super calculation.</em><p><br><strong>Please note:</strong> These settings will stay constant regardless of the currently set fortnight. Any changes to these settings will affect NET and TAX calculations for any previously saved fortnights.</p><hr>";

    let createDollarPercentInput = (id, showDollar = false, showPercent = false, percentActive = false, placeholder = "0") => {
        let inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group");
        let dollarAddon = document.createElement("span");
        dollarAddon.classList.add("input-group-addon", "dollar")
        dollarAddon.textContent = "$";
        let percentAddon = document.createElement("span");
        percentAddon.classList.add("input-group-addon", "percent")
        percentAddon.textContent = "%";
        let inputElement = document.createElement("input");
        inputElement.id = id;
        inputElement.setAttribute("type", "text");
        inputElement.setAttribute("inputmode", "decimal");
        inputElement.setAttribute("placeholder", placeholder);
        if(!showDollar) {
            dollarAddon.classList.add("hidden");
        }
        if(!showPercent) {
           percentAddon.classList.add("hidden");
        }
        if(showDollar && showPercent) {
            dollarAddon.addEventListener("click", function(){
                setSaveData(id + "Percent", "", false);
                dollarAddon.classList.remove("inactive");
                percentAddon.classList.add("inactive");
                updateResults();
            });
            percentAddon.addEventListener("click", function(){
                setSaveData(id + "Percent", "true", false);
                percentAddon.classList.remove("inactive");
                dollarAddon.classList.add("inactive");
                updateResults();
            });
            if(percentActive) {
                setSaveData(id + "Percent", "true", false);
                percentAddon.classList.remove("inactive");
                dollarAddon.classList.add("inactive");
            }
            else {
                setSaveData(id + "Percent", "", false);
                dollarAddon.classList.remove("inactive");
                percentAddon.classList.add("inactive");
            }
        }
        inputGroup.appendChild(dollarAddon);
        inputGroup.appendChild(inputElement);
        inputGroup.appendChild(percentAddon);
        
        return inputGroup;
    }

    let createToggleSwitch = (id, checked = false, onText = "", offText = "") => {
        let container = document.createElement("div");
        container.classList.add("toggle-switch-div");
        let switchContainer = document.createElement("label");
        switchContainer.classList.add("switch");
        let toggleText = document.createElement("span");
        let switchInput = document.createElement("input");
        switchInput.id = id;
        switchInput.setAttribute("type", "checkbox");
        if(checked) {
            switchInput.setAttribute("checked", "checked");
            toggleText.textContent = onText;
        }
        else {
            toggleText.textContent = offText;
        }
        switchInput.addEventListener("input", function(){
            if(this.checked) {
                setSaveData(id, "yes", false);
                toggleText.textContent = onText;
            } 
            else {
                setSaveData(id, "no", false);
                toggleText.textContent = offText;
            }
            updateResults();
        });
        let switchSlider = document.createElement("span");
        switchSlider.classList.add("slider", "round");
        switchContainer.append(switchInput, switchSlider);
        container.append(switchContainer, toggleText)
        return container;
    }

    let formArea = document.createElement("form");
    formArea.id = "taxSettings";
    formArea.classList.add("grid-taxform");

    //enable checkbox
    let enableTaxCalcId = "enableTaxCalc";
    let enableCheckboxLabel = document.createElement("span");
    enableCheckboxLabel.textContent = "Net Pay Calculation";
    enableCheckboxLabel.style.color = "#eed969";
    enableCheckboxLabel.style.fontWeight = "bold";
    formArea.appendChild(enableCheckboxLabel);
    if(getSaveData(enableTaxCalcId, false) == "yes") {
        formArea.appendChild(createToggleSwitch(enableTaxCalcId, true, "Enabled", "Disabled"));
    }
    else {
        formArea.appendChild(createToggleSwitch(enableTaxCalcId, false, "Enabled", "Disabled"));
    }

    formArea.appendChild(document.createElement("hr"));

    //tax-free threshold
    let taxFreeThresholdId = "taxFreeThreshold";
    let taxFreeThresholdLabel = document.createElement("div");
    let taxFreeThresholdLabelText = document.createElement("span");
    taxFreeThresholdLabelText.style.display = "inline-block";
    taxFreeThresholdLabelText.style.width = "100%";
    let taxFreeThresholdLabelSubtext = document.createElement("span");
    taxFreeThresholdLabelSubtext.style.fontSize = "70%";
    taxFreeThresholdLabelSubtext.style.color = "#9db8c6"
    taxFreeThresholdLabelText.textContent = "Claim Tax-Free Threshold";
    taxFreeThresholdLabelSubtext.textContent = "If unsure, set to YES";
    taxFreeThresholdLabel.append(taxFreeThresholdLabelText, taxFreeThresholdLabelSubtext);
    formArea.appendChild(taxFreeThresholdLabel);
    if(getSaveData(taxFreeThresholdId, false) == "no") { //reverse logic to make the default 'true'
        formArea.appendChild(createToggleSwitch(taxFreeThresholdId, false, "Yes", "No"));
    }
    else {
        formArea.appendChild(createToggleSwitch(taxFreeThresholdId, true, "Yes", "No"));
    }

    //HECS/STSL
    let stslId = "stsl";
    let stslLabel = document.createElement("span");
    stslLabel.textContent = "STSL/HELP Debt";
    formArea.appendChild(stslLabel);
    if(getSaveData(stslId, false) == "yes") {
        formArea.appendChild(createToggleSwitch(stslId, true, "Yes", "No"));
    }
    else {
        formArea.appendChild(createToggleSwitch(stslId, false, "Yes", "No"));
    }
    

    //etdsc membership
    let etdscId = "etdscMembership";
    let etdscLabel = document.createElement("span");
    etdscLabel.textContent = "ETDSC Membership";
    let etdscInput = document.createElement("select");
    etdscInput.id = etdscId;
    let etdscInputOptionNone = document.createElement("option");
    etdscInputOptionNone.textContent = "None";
    etdscInputOptionNone.setAttribute("value", "")
    let etdscInputOptionHalf = document.createElement("option");
    etdscInputOptionHalf.textContent = "Half";
    etdscInputOptionHalf.setAttribute("value", "half")
    let etdscInputOptionFull = document.createElement("option");
    etdscInputOptionFull.textContent = "Full";
    etdscInputOptionFull.setAttribute("value", "full")
    let etdscInputOptionJobshare = document.createElement("option");
    etdscInputOptionJobshare.textContent = "Jobshare";
    etdscInputOptionJobshare.setAttribute("value", "jobshare")
    etdscInput.addEventListener("input", function(){
        if(this.value) setSaveData(etdscId, this.value, false);
        else setSaveData(etdscId, "", false);
        updateResults();
    });
    etdscInput.appendChild(etdscInputOptionNone);
    etdscInput.appendChild(etdscInputOptionHalf);
    etdscInput.appendChild(etdscInputOptionFull);
    etdscInput.appendChild(etdscInputOptionJobshare);
    formArea.appendChild(etdscLabel);
    formArea.appendChild(etdscInput);

    //super salary sacrifice
    let superSalSacId = "superSalSac";
    let superSalSacLabel = document.createElement("span");
    superSalSacLabel.textContent = "Super Salary Sacrifice";
    let superSalSacInput = createDollarPercentInput(superSalSacId, true, true, (getSaveData(superSalSacId + "Percent", false) ? true : false));
    superSalSacInput.addEventListener("input", function(){
        setSaveData(superSalSacId, document.forms.taxSettings.elements.namedItem(superSalSacId).value, false);
        updateResults();
    });
    formArea.appendChild(superSalSacLabel);
    formArea.appendChild(superSalSacInput);

    //additional tax withheld
    let withholdExtraId = "withholdExtra";
    let withholdExtraLabel = document.createElement("span");
    withholdExtraLabel.textContent = "Additional Tax Withholding";
    let withholdExtraInput = createDollarPercentInput(withholdExtraId, true, true, (getSaveData(withholdExtraId + "Percent", false) ? true : false));
    withholdExtraInput.addEventListener("input", function(){
        setSaveData(withholdExtraId, document.forms.taxSettings.elements.namedItem(withholdExtraId).value, false);
        updateResults();
    });
    formArea.appendChild(withholdExtraLabel);
    formArea.appendChild(withholdExtraInput);

    //novated lease
    let novatedLeasePreId = "novatedLeasePre";
    let novatedLeasePreLabel = document.createElement("span");
    novatedLeasePreLabel.textContent = "Novated Lease Pre-Tax";
    let novatedLeasePreInput = createDollarPercentInput(novatedLeasePreId, true, false);
    novatedLeasePreInput.addEventListener("input", function(){
        setSaveData(novatedLeasePreId, document.forms.taxSettings.elements.namedItem(novatedLeasePreId).value, false);
        updateResults();
    });
    formArea.appendChild(novatedLeasePreLabel);
    formArea.appendChild(novatedLeasePreInput);

    let novatedLeasePostId = "novatedLeasePost";
    let novatedLeasePostLabel = document.createElement("span");
    novatedLeasePostLabel.textContent = "Novated Lease Post-Tax";
    let novatedLeasePostInput = createDollarPercentInput(novatedLeasePostId, true, false);
    novatedLeasePostInput.addEventListener("input", function(){
        setSaveData(novatedLeasePostId, document.forms.taxSettings.elements.namedItem(novatedLeasePostId).value, false);
        updateResults();
    });
    formArea.appendChild(novatedLeasePostLabel);
    formArea.appendChild(novatedLeasePostInput);

    //fixed tax rate
    let fixedTaxRateId = "fixedTaxRate";
    let fixedTaxRateLabel = document.createElement("span");
    fixedTaxRateLabel.textContent = "Custom Fixed Tax Rate";
    let fixedTaxRateInput = createDollarPercentInput(fixedTaxRateId, false, true, true, "None");
    fixedTaxRateInput.addEventListener("input", function(){
        setSaveData(fixedTaxRateId, document.forms.taxSettings.elements.namedItem(fixedTaxRateId).value, false);
        updateResults();
    });
    formArea.appendChild(fixedTaxRateLabel);
    formArea.appendChild(fixedTaxRateInput);

    //custom pre-tax
    formArea.appendChild(document.createElement("hr"));
    let customPreTaxHeader = document.createElement("span");
    customPreTaxHeader.textContent = "Other Pre-Tax Deductions"
    customPreTaxHeader.classList.add("grid-1-3", "bold");
    formArea.appendChild(customPreTaxHeader);

    let customPreTaxDescriptionLabel = document.createElement("span");
    customPreTaxDescriptionLabel.textContent = "Description";
    let customPreTaxInputLabel = document.createElement("span");
    customPreTaxInputLabel.textContent = "Value";
    formArea.append(customPreTaxDescriptionLabel, customPreTaxInputLabel);

    //create multiple custom pre-tax fields
    let customPreTaxValueId = "customPreTaxValue";
    let customPreTaxDescriptionId = "customPreTaxDescription";
    for (let i = 0; i < numberOfCustomPreTaxFields; i++) {
        let descriptionId = customPreTaxDescriptionId + i.toString();
        let valueId = customPreTaxValueId + i.toString();
        let customPreTaxDescriptionInput = document.createElement("input");
        customPreTaxDescriptionInput.classList.add("taxform-text-input")
        customPreTaxDescriptionInput.setAttribute("maxlength", "50")
        customPreTaxDescriptionInput.setAttribute("placeholder", "Deduction Name")
        customPreTaxDescriptionInput.id = descriptionId;
        customPreTaxDescriptionInput.addEventListener("input", function(){
            setSaveData(descriptionId, document.forms.taxSettings.elements.namedItem(descriptionId).value, false);
            updateResults();
        });
        let customPreTaxValueInput = createDollarPercentInput(valueId, true, false);
        customPreTaxValueInput.addEventListener("input", function(){
            setSaveData(valueId, document.forms.taxSettings.elements.namedItem(valueId).value, false);
            updateResults();
        });
        formArea.append(customPreTaxDescriptionInput, customPreTaxValueInput);
    }

    //custom post-tax
    formArea.appendChild(document.createElement("hr"));
    let customPostTaxHeader = document.createElement("span");
    customPostTaxHeader.textContent = "Other Post-Tax Deductions"
    customPostTaxHeader.classList.add("grid-1-3", "bold");
    formArea.appendChild(customPostTaxHeader);

    let customPostTaxDescriptionLabel = document.createElement("span");
    customPostTaxDescriptionLabel.textContent = "Description";
    let customPostTaxInputLabel = document.createElement("span");
    customPostTaxInputLabel.textContent = "Value";
    formArea.append(customPostTaxDescriptionLabel, customPostTaxInputLabel);


    //create multiple custom post-tax fields
    let customPostTaxValueId = "customPostTaxValue";
    let customPostTaxDescriptionId = "customPostTaxDescription";
    for (let i = 0; i < numberOfCustomPostTaxFields; i++) {
        let descriptionId = customPostTaxDescriptionId + i.toString();
        let valueId = customPostTaxValueId + i.toString();
        let customPostTaxDescriptionInput = document.createElement("input");
        customPostTaxDescriptionInput.classList.add("taxform-text-input")
        customPostTaxDescriptionInput.setAttribute("maxlength", "50")
        customPostTaxDescriptionInput.setAttribute("placeholder", "Deduction Name")
        customPostTaxDescriptionInput.id = descriptionId;
        customPostTaxDescriptionInput.addEventListener("input", function(){
            setSaveData(descriptionId, document.forms.taxSettings.elements.namedItem(descriptionId).value, false);
            updateResults();
        });
        let customPostTaxValueInput = createDollarPercentInput(valueId, true, false);
        customPostTaxValueInput.addEventListener("input", function(){
            setSaveData(valueId, document.forms.taxSettings.elements.namedItem(valueId).value, false);
            updateResults();
        });
        formArea.append(customPostTaxDescriptionInput, customPostTaxValueInput);
    }
    

    //show helpbox
    contentElement.appendChild(formHeader);
    contentElement.appendChild(formArea);
    $("#topHelpDiv").addClass("show-top-helpbox");
    if(helpboxContent.scrollHeight > helpboxContent.clientHeight) {
        $(".scroll-indicator").show()
    }
    else {
        $(".scroll-indicator").hide()
    }

    //check and load saved tax config data
    //if(getSaveData(enableTaxCalcId, false) == "true") enableCheckboxInput.checked = true;
    
    etdscInput.value = getSaveData(etdscId, false);
    let etdscMembershipSave = getSaveData(etdscId, false);
    let superSalSacSave = getSaveData(superSalSacId, false);
    let novatedLeasePreSave = getSaveData(novatedLeasePreId, false);
    let novatedLeasePostSave = getSaveData(novatedLeasePostId, false);
    let withholdExtraSave = getSaveData(withholdExtraId, false);
    let fixedTaxRateSave = getSaveData(fixedTaxRateId, false);
    if(etdscMembershipSave) etdscInput.value = etdscMembershipSave;
        else etdscInput.value = "";
    if(superSalSacSave) document.forms.taxSettings.elements.namedItem(superSalSacId).value = superSalSacSave;
    if(novatedLeasePreSave)document.forms.taxSettings.elements.namedItem(novatedLeasePreId).value = novatedLeasePreSave;
    if(novatedLeasePostSave) document.forms.taxSettings.elements.namedItem(novatedLeasePostId).value = novatedLeasePostSave;
    if(withholdExtraSave) document.forms.taxSettings.elements.namedItem(withholdExtraId).value = withholdExtraSave;
    if(fixedTaxRateSave) document.forms.taxSettings.elements.namedItem(fixedTaxRateId).value = fixedTaxRateSave;
    for (let i = 0; i < numberOfCustomPreTaxFields; i++) {
        let customPreTaxDescriptionSave = getSaveData(customPreTaxDescriptionId + i.toString(), false);
        let customPreTaxValueSave = getSaveData(customPreTaxValueId + i.toString(), false);
        if(customPreTaxDescriptionSave) document.forms.taxSettings.elements.namedItem(customPreTaxDescriptionId + i.toString()).value = customPreTaxDescriptionSave;
        if(customPreTaxValueSave) document.forms.taxSettings.elements.namedItem(customPreTaxValueId + i.toString()).value = customPreTaxValueSave;
    }
    for (let i = 0; i < numberOfCustomPostTaxFields; i++) {
        let customPostTaxDescriptionSave = getSaveData(customPostTaxDescriptionId + i.toString(), false);
        let customPostTaxValueSave = getSaveData(customPostTaxValueId + i.toString(), false);
        if(customPostTaxDescriptionSave) document.forms.taxSettings.elements.namedItem(customPostTaxDescriptionId + i.toString()).value = customPostTaxDescriptionSave;
        if(customPostTaxValueSave) document.forms.taxSettings.elements.namedItem(customPostTaxValueId + i.toString()).value = customPostTaxValueSave;
    }
}

/**
 * Display the information box at the top of the page with a given title and body text
 * @param {string} title - the title-bar text (text only)
 * @param {string} helpText - information box body text (HTML formatting OK)
 */
function topHelpBox(title, helpText) {
    document.getElementById("helpboxTitle").textContent = title;
    document.getElementById("helpboxContent").innerHTML = helpText;
    document.getElementById("helpboxContent").style.maxHeight = ""; //default to CSS defined max-height in case it has been overwritten elsewhere
    $("#topHelpDiv").addClass("show-top-helpbox");
    if(helpboxContent.scrollHeight > helpboxContent.clientHeight) {
        $(".scroll-indicator").show()
    }
    else {
        $(".scroll-indicator").hide()
    }
}

/**
 * Display the information box at the top of the page with preset content
 * @param {string} presetName - the name of the preset (see switch statement)
 */
function topHelpBoxPreset(presetName) {
    let helpTitle = "";
    let helpText = "";
    let dummyButton = (text, colour, dropdown = false) => {
        let iconCode = "";
        let boldCode = "";
        if(dropdown) {
            iconCode = "<i class=\"button-icon fas fa-lg fa-angle-down\"></i>";
            boldCode = "<span style=\"font-weight: bold;\">";
        }
        return "<a class=\"button\" style=\"background-color: " + colour + "; display: inline-block; border: none; cursor: default;\">" + boldCode + text + "</span>" + iconCode + "</a>";
    }
    switch(presetName) {
        case "gettingStarted":
            helpTitle = "Help Guide";
            helpText = "<p><strong>Fortnight Commencing</strong><br />Before entering shift details, first ensure the correct dates are set and shown near the top of the Data Entry area. Use the <i class='fas fa-angle-double-left'></i> and <i class='fas fa-angle-double-right'></i> buttons to change the date range a fortnight at a time, or click the <i class='far fa-calendar-alt'></i> button to open the the date-picker and select the fortnight that way. The date range that is selected is used for two purposes: determining the base pay-rate the calculator will use, and saving the data you have entered to the selected date. See <a href='javascript:topHelpBoxPreset(\"saveInfo\");'>Data Saving Info</a> for more information.</p>"
            + "<p><strong>Shift Input</strong><br />There are two parts to entering the details for each shift: <em>Shift Options</em> and <em>Sign-On/Sign-Off times</em>. You can set either in any order, you don't need to put shift times in first or vice-versa."
            + "<ul><li>To set shift options, click the shift options button (looks like this: " + dummyButton("OFF", "black", true) + " or " + dummyButton("Normal", normalColour, true) + ")"
            + ", then click the relevant options to toggle them on and off for that shift.</li>"
            + "<li>Enter sign-on and off times as four-digit 24-hour time with no colon, for example: 0330 or 2100</li></ul></p>"
            + "<p><strong>DDOs/EDOs and Public Holidays: Worked or OFF?</strong>"
            + "<br />There is no separate button to distinguish OFF vs. Worked shifts. The calculator determines if your DDO/EDO or PH is worked or OFF depending on if you have entered sign-on and sign-off times for that day. For instance, if you worked your DDO, set the " + dummyButton("DDO", ddoColour) + " shift option and enter valid sign-on and sign-off times for that shift.</p>"
            + "<p><strong>Sick-Part</strong>"
            + "<br />For shifts where you went home sick part-way through a shift, set the " + dummyButton("Sick", sickColour) + " shift option and enter your sign-on time as normal. For your sign-off time, instead of your shifts normal sign-off time, set this as the time you were signed-off as going home sick.</p>"
            + "<p><strong>Results</strong><br />Results from the calculation appear as you enter in each of your shifts. You can view the results in two ways: <em>Grouped</em> or <em>Split</em>. <em>Grouped</em> is the default view and shows each of the pay elements like they would appear on your payslip, while <em>split</em> view will divide the results into individual days."
            + " You can also click/tap on any of the pay elements to view an explanation of that pay element.</p>";
            break;
        case "saveInfo":
            helpTitle = "Saved Data Information";
            helpText = "<p>All shift-times and shift-options entered are automatically saved to the currently selected fortnight. In other words, the calculator will remember all the details you enter every time you use it."
            + "<br />Data saving allows you to do things like enter in shifts as you go, so you don't have to enter them all at once at the end of a pay cycle. You can also change the dates to load any data you entered in a different fortnight! </p>"
            + "<p>Some extra things to know about data saving:</p>"
            + "<ul><li>There is no 'save button'. Everything is saved instantly and automatically.</li>"
            + "<li>Data is saved locally to your web browser and not sent anywhere over the internet.</li>"
            + "<li>Saved data will <strong>not</strong> carry over to a different web browser or device.</li>"
            + "<li>Using incognito/private browsing mode will prevent data saving.</li>"
            + "<li>Clearing your browser's cookies will delete any saved data.</li>"
            + "</ul>"
            + "<p>The following button will delete all calculator save data that is stored in the current browser. Shift sign-on/sign-off times and shift-options for all dates will be deleted. It is not possible to undo this action.</p>"
            + "<p><a class='button delete-save-button' onclick='confirmDeleteData()'>Delete All Save Data</a><p>";
            break;
        case "about":
            helpTitle = "About the pay calculator";
            helpText = "<p>A web-based calculator tool to help you check if you've been paid correctly!</p>"
            + "<p>While I've taken care to try and make this calculator accurate, I cannot guarantee that it will be perfect. Some parts of the EA can be interpreted with ambiguity and debated, bugs in the code may be present, and not all scenarios are covered by this calculator."
            + "<br />If you find any problems with the calculator, I'd love to hear about it. Find me on the Facebook page <i class='far fa-grin-alt'></i></p>"
            + "<ul>"
            + "<li>Developed by Petar Stankovic - Driver FSS</li>"
            + "<li><a href='https://github.com/Hyperchicken/webPayCalculator'>GitHub Respository</a></li>"
            + "<li>Version: " + calcVersion + "</li>"
            + "<li>Last Update: " + calcLastUpdateDate +"</li>"
            + "</ul>";
            break;
        case "feedback":
            helpTitle = "Report Issue or Feedback";
            helpText = "<p>This pay calculator is developed and maintained by Petar Stankovic, driver at FSS.</p>"
            + "<p>If you have any feedback or issues to report, please contact me using one of the methods below."
            + "<br />Feedback and bug reports help make the calculator better and more accurate, so even reports on the smallest things are much appreciated! I reply to all reports.</p>"
            + "<ul>"
            + "<li>Email: <a href='mailto:petar+paycalc@hyperchicken.com?subject=Pay Calculator Feedback'>petar+paycalc@hyperchicken.com</a></li>"
            + "<li>Phone/text: Find my number in the Metro global address book.</li>"
            + "</ul>";
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

function populateGradeSelectList() {
    let dropdown = document.getElementById('pay-grade');
    let newOption = (text, value) => {
        let elem = document.createElement("option");
        elem.setAttribute("value", value);
        elem.innerText = text;
        return elem ;
    }
    let gradeGroups = new Map();

    for(let grade in grades) {
        let group = grades[grade].group;
        if(group) {
            if(!gradeGroups.has(group)) {
                gradeGroups.set(group, []);
            }
            gradeGroups.get(group).push(newOption(grades[grade].name, grade));
        }
        else {
            if(!gradeGroups.has("Other")) {
                gradeGroups.set("Other", []);
            }
            gradeGroups.get("Other").push(newOption(grades[grade].name, grade));
        }
    }
    console.log(gradeGroups);
    for(const [groupName, groupGrades] of gradeGroups) {
        let optgroupElem = document.createElement("optgroup");
        optgroupElem.setAttribute("label", groupName);
        dropdown.appendChild(optgroupElem);
        for(const option of groupGrades){
            optgroupElem.appendChild(option);
        }
    }
}