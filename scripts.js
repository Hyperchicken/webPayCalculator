/*
    Web-based Pay Calculator by Petar Stankovic
    Github Respository - https://github.com/Hyperchicken/webPayCalculator
    scripts.js - All of the calculator logic and page interactiveness is programmed into this file.
*/

"use strict";

//version
const calcVersion = "1.16";
const calcLastUpdateDate = "12/06/2020";

//message of the day. topHelpBox message that appears once per calcVersion.
//set to blank string ("") to disable message of the day
var motd = "Calculator updated to version " + calcVersion
+ "<ul><li>Backpay Calculator updated to require far fewer payslips and inputs. Thanks Rob!</li><li>New EA pay rates are now active from 7/6/2020 onwards.</li><li>A new backpay calculator can be accessed from the Menu!</li></ul>";

//rates
const rateDates =               ["2015-01-11", "2015-07-12", "2016-01-10", "2016-07-10", "2017-01-08", "2017-07-09", "2018-01-07", "2018-07-08", "2019-01-06", "2020-06-07", "2020-07-05", "2021-01-03", "2021-07-04", "2022-01-02", "2022-07-03", "2023-01-01"]; //the date which the corresponding rate begins
const spotRates =               [45.1833,      45.8611,      46.5490,      47.2472,      47.9559,      48.6752,      49.4054,      50.6405,      51.9065,      53.7362,      54.2736,      55.6304,      56.1867,      57.5914,      58.1673,      59.6215];
const driverLevel1Rates =       [30.6682,      31.1282,      31.5951,      32.0691,      32.5501,      33.0383,      33.5339,      34.3723,      35.2316,      36.4735,      36.8382,      37.7592,      38.1368,      39.0902,      39.4811,      40.4681];
const traineeRates =            [26.2727,      26.6668,      27.0668,      27.4728,      27.8849,      28.3031,      28.7277,      29.4459,      30.1820,      31.2459,      31.5584,      32.3473,      32.6708,      33.4876,      33.8225,      34.6680];
const conversionRates =         [42.1618,      42.7942,      43.4362,      44.0877,      44.7490,      45.4202,      46.1015,      47.2541,      48.4354,      50.1427,      50.6442,      51.9103,      52.4294,      53.7401,      54.2775,      55.6345];
const so8Rates =                [54.4860,      55.3033,      56.1328,      56.9748,      57.8295,      58.6969,      59.5774,      61.0668,      62.5935,      64.7999,      65.4479,      67.0841,      67.7550,      69.4488,      70.1433,      71.8969];
const so9Rates =                [55.8979,      56.7364,      57.5875,      58.4513,      59.3280,      60.2180,      61.1212,      62.6493,      64.2155,      66.4791,      67.1439,      68.8225,      69.5107,      71.2485,      71.9610,      73.7600];
const so10Rates =               [57.3130,      58.1727,      59.0453,      59.9310,      60.8300,      61.7424,      62.6686,      64.2353,      65.8412,      68.1621,      68.8437,      70.5648,      71.2705,      73.0522,      73.7827,      75.6273];
const so11Rates =               [58.7235,      59.6044,      60.4984,      61.4059,      62.3270,      63.2619,      64.2108,      65.8161,      67.4615,      69.8395,      70.5379,      72.3014,      73.0244,      74.8500,      75.5985,      77.4884];
const so12Rates =               [60.1328,      61.0348,      61.9503,      62.8796,      63.8228,      64.7801,      65.7518,      67.3956,      69.0805,      71.5156,      72.2307,      74.0365,      74.7769,      76.6463,      77.4128,      79.3481];

const ojtAllowanceRates =       [8.8927,       9.0261,       9.1615,       9.2989,       9.4384,       9.5800,       9.7237,       9.9668,       10.2159,      10.5760,      10.6818,      10.9488,      11.0583,      11.3348,      11.4481,      11.7343];
const mealAllowanceRates =      [10.6413,      10.8010,      10.9630,      11.1274,      11.2943,      11.4637,      11.6357,      11.9266,      12.2248,      12.6557,      12.7823,      13.1018,      13.2329,      13.5637,      13.6993,      14.0418];
const suburbanAllowanceRates =  [7.6496,       7.7644,       7.8809,       7.9991,       8.1190,       8.2408,       8.3644,       8.5736,       8.7879,       9.0977,       9.1887,       9.4184,       9.5126,       9.7504,       9.8479,       10.0941];
const earlyShiftRatesLoco =     [2.9730,       3.0176,       3.0628,       3.1088,       3.1554,       3.2027,       3.2508,       3.3321,       3.4154,       3.5358,       3.5712,       3.6604,       3.6970,       3.7895,       3.8274,       3.9230]; //a shift which is rostered to commence at or between 0400 and 0530
const afternoonShiftRatesLoco = [2.9730,       3.0176,       3.0628,       3.1088,       3.1554,       3.2027,       3.2508,       3.3321,       3.4154,       3.5358,       3.5712,       3.6604,       3.6970,       3.7895,       3.8274,       3.9230]; //a shift which is rostered to commence before 1800 and conclude at or after 1830.
const nightShiftRatesLoco =     [3.4944,       3.5468,       3.6000,       3.6540,       3.7088,       3.7644,       3.8209,       3.9164,       4.0143,       4.1558,       4.1974,       4.3023,       4.3453,       4.4540,       4.4985,       4.6110]; //a shift which is rostered to commence at or between 1800 and 0359 hours.
const earlyShiftRatesTPW =      [3.0595,       3.1054,       3.1519,       3.1992,       3.2472,       3.2959,       3.3453,       3.4290,       3.5147,       3.6386,       3.6750,       3.7669,       3.8045,       3.8996,       3.9386,       4.0371];
const afternoonShiftRatesTPW =  [3.0595,       3.1054,       3.1519,       3.1992,       3.2472,       3.2959,       3.3453,       3.4290,       3.5147,       3.6386,       3.6750,       3.7669,       3.8045,       3.8996,       3.9386,       4.0371];
const nightShiftRatesTPW =      [3.5639,       3.6173,       3.6716,       3.7266,       3.7825,       3.8393,       3.8969,       3.9943,       4.0942,       4.2385,       4.2809,       4.3879,       4.4318,       4.5426,       4.5880,       4.7027];
const earlyShiftRatesSal =      [3.0773,       3.1234,       3.1703,       3.2178,       3.2661,       3.3151,       3.3648,       3.4489,       3.5352,       3.6598,       3.6964,       3.7888,       3.8267,       3.9224,       3.9616,       4.0606];
const afternoonShiftRatesSal =  [3.0773,       3.1234,       3.1703,       3.2178,       3.2661,       3.3151,       3.3648,       3.4489,       3.5352,       3.6598,       3.6964,       3.7888,       3.8267,       3.9224,       3.9616,       4.0606];
const nightShiftRatesSal =      [3.5988,       3.6528,       3.7076,       3.7632,       3.8196,       3.8769,       3.9351,       4.0335,       4.1343,       4.2800,       4.3228,       4.4309,       4.4752,       4.5871,       4.6330,       4.7488];

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

//define a fortnightly pay-cycle to start on either an odd or even week of a given year
const evenPayWeekYears = [2016, 2017, 2018, 2019, 2020];
const oddPayWeekYears = [2015, 2021, 2022, 2023, 2024, 2025];

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
        this.phOffRoster = false; //PH off roster (rostered OFF on a PH). 'true' indicates shift converted to PH
        this.wm = false; //wasted meal
        this.sick = false; //sick full day
        this.sickPart = false; //worked but went home sick partway through shift
        this.al = false; //annual leave
        this.phc = false; //public holiday credit day off
        this.ddo = false; //DDO
        this.bonus = false; //bonus payment
        this.bonusHours = 0.0; //bonus payment hours
        this.shiftNumber = 0; 
        this.shiftWorkedNumber = 0;
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

    /**
     * Shift's work hours as a formatted string.
     * @returns {string} shift hours in the format H:MM
     */
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
        else console.error("setShiftTimes(): insufficient parameters");
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
     */
    constructor(payType, hours, fcDateOffset, ojt) {
            this.payType = payType;
            this.hours = parseFloat(hours.toFixed(4));
            this.ojt = ojt;
            this.fcDateOffset = fcDateOffset; //week commencing date offset. the number of days this shift is offset from the week-commencing date
            this.value = this.calculateValue(); //used to keep track of the pay amount when grouping elements together
    }

    /**
     * Calculates the value of this pay element
     * @returns {number} the element's pay value
     */
    calculateValue() {
        let val = parseFloat((this.rate * parseFloat(this.hours.toFixed(4))));
        if(this.payType == "annualLeave") return parseFloat(val.toFixed(2)); //adjust precision for annual leave as payroll rounds to 2 decimal places for EACH DAY of AL.
        else return val;
    }
    
    /**
     * Get the sort index of this pay element.
     * @returns {number} the sorting index of this element
     */
    get sortIndex() {
        let sortOrder = [ //array to define the order in which pay elements should be sorted in the results.
            "normal",
            "guarantee",
            "sickFull",
            "sickPart",
            "annualLeave",
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
            "nonRosPH",
            "phCredit",
            "bonusPayment",
            "earlyShift",
            "afternoonShift",
            "nightShift",
            "metroSig2",
            "mealAllowance",
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
            case "guarantee": payClassName = "Guarantee"; break;
            case "sickFull": payClassName = "Sick Full"; break;
            case "sickPart": payClassName = "Sick Part"; break;
            case "annualLeave": payClassName = "A/Leave"; break;
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
        if(this.ojt) return payClassName + "*";
        else return payClassName;
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
                + "<p><em>Ordinary hours</em> at the ordinary rate. How ordinary...</p>"
                + "<ul><li>Ordinary hours are up to 8 hours per day (7.6 hours for trainees and part-time).</li>"
                + "<li>Generally, ordinary hours is time worked that is not affected by penalty rates (for example: overtime, public holidays, weekends, etc).</li></ul>";
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
                + "<ul><li>Sick days taken during Annual Leave will be paid as <em>Sick Full</em> and not count as Annual Leave.</li>"
                + "<li>Public Holidays that occur during Annual Leave will be paid as <em>PH Gazette</em> and not count as Annual Leave.</li></ul>";
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
            case "rost+50": tooltipText = "<strong>Rost+50%</strong>"
                + "<p><em>Excess Hours Overtime x1.5.</em> Time worked on an ordinary shift in excess of 8 hours, paid at <em>time and a half</em> for for the first three excess hours.</p>";
                break;
            case "rost+100": tooltipText = "<strong>Rost+100%</strong>"
                + "<p><em>Excess Hours Overtime x2.</em> Time worked on an ordinary shift in excess of 11 hours, paid at <em>double time.</em></p>"
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
                rate += getEbaRate(shiftDate, selectedGradeRates); //single rate
                break;
            case "wePen50":
            case "phPen50":
                rate += getEbaRate(shiftDate, selectedGradeRates); //half rate
                rate /= 2;
                break;
            case "ot150":
            case "rost+50":
            case "phPen150":
                rate += getEbaRate(shiftDate, selectedGradeRates); //time and a half
                rate *= 1.5;
                break;
            case "ot200":
            case "rost+100":
                rate += getEbaRate(shiftDate, selectedGradeRates); //double time
                rate *= 2;
                break;
            case "earlyShift":
                rate += getEbaRate(shiftDate, selectedEarlyShiftRates);
                break;
            case "afternoonShift":
                rate += getEbaRate(shiftDate, selectedAfternoonShiftRates);
                break;
            case "nightShift":
                rate += getEbaRate(shiftDate, selectedNightShiftRates);
                break;
            case "metroSig2":
                rate += getEbaRate(shiftDate, suburbanAllowanceRates);
                break;
            case "mealAllowance":
                rate += getEbaRate(shiftDate, mealAllowanceRates);
                break;
            case "leaveLoading":
                rate += getEbaRate(shiftDate, selectedGradeRates); //20%
                rate *= 0.2;
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

let selectedGradeRates; //stores the currently selected set of rates for the selected pay grade
let selectedEarlyShiftRates;
let selectedAfternoonShiftRates;
let selectedNightShiftRates;
let selectBonusTextbox; //used keep track of bonus-pay option button textbox to be selected when loading pay-options buttons.
let day14ph = false; //day 14 public holiday
for (let i = 0; i < 14; i++) shifts.push(new Shift(i)); //init shifts array with 0 length shifts
let timeField = function() {return document.querySelectorAll(".time")}; //alias for time input boxes
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; //define shorthand names for days of the week

//init on document load
$(document).ready(function() { 
    initButtons();

    let timeFields = document.querySelectorAll(".time");
    for(let i = 0; i < timeFields.length; i++) {
        timeFields[i].addEventListener("blur", function(){
            validateTimeFields();
        });
    }

    //helpbox scroll listener to detect scrollable indicator
    helpboxContent.onscroll = function() {
        if(helpboxContent.scrollTop > 0) {
            $(".scroll-indicator").hide();
        }
        else {
            $(".scroll-indicator").show();
        }
    };
    
    //setup datepicker
    let startDate = () => {
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
    $("#backpayMenuButton").on("click", function(){
        location.replace("backpay.php");
    });
    $("#printViewMenuButton").on("click", function(){
        showPrintView();
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
    $("#taxConfigurationMenuButton").on("click", function(){
        taxConfigurator();
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

    //set title superscript
    $("#titleSuperscript").text("v" + calcVersion);

    //check and display message of the day
    let lastVersion = getSaveData("lastCalcVersion");
    if(lastVersion != calcVersion && motd != "") {
        topHelpBox("Calculator Update", motd);
    }
    setSaveData("lastCalcVersion", calcVersion);

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
            if(s.ddo) {
                setButton("DDO-OFF", ddoColour);
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
            if(s.phc) {
                setButton("PH&nbspCredit", phcColour);
                offButton = false;
            }
            if(s.ph) {
                if(s.phOffRoster) {
                    setButton("PH-OFF", phColour);
                }
                else {
                    setButton("PH-Gazette", phColour);
                }
                offButton = false;
            }
            if(s.wm) {
                setButton("W/Meal", wmColour);
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
            if(s.ojt || s.ph || s.sick || s.wm || s.ddo || s.bonus){
                if(s.sick) {
                    if(s.hoursDecimal > 4.0) {
                        setButton("Sick-Part", sickColour);
                    }
                    else {
                        setButton("Sick-Full", sickColour);
                    }
                }
                if(s.ojt) {
                    setButton("OJT", ojtColour);
                }
                if(s.ddo) {
                    setButton("DDO-Work", ddoColour);
                }
                if(s.ph){
                    if(getPayGrade() == "parttime") {
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
                if(s.wm) {
                    setButton("W/Meal", wmColour);
                }
                if(s.bonus && s.bonusHours > 0) {
                    setButton("Bonus&nbspPay", bonusColour);
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
            let phRosterButton = document.createElement("a");
            xLeaveButton.setAttribute("class", "button ph-button shelf-button dual-button-l");
            xPayButton.setAttribute("class", "button ph-button shelf-button dual-button-r");
            phRosterButton.setAttribute("class", "button ph-button shelf-button dual-button-r");
            xLeaveButton.textContent = "Extra Leave";
            xPayButton.textContent = "Extra Pay";
            phRosterButton.textContent = "PH Roster"
            phSpan.appendChild(xLeaveButton);
            phSpan.appendChild(xPayButton);
            if(getPayGrade() == "parttime") { //special PH options button configuration for part-time grade
                phSpan.appendChild(phRosterButton);
                xPayButton.classList.remove("dual-button-r");
                xPayButton.classList.add("dual-button-m");
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
            phRosterButton.setAttribute("class", "button ph-button shelf-button dual-button-l");
            offRosterButton.setAttribute("class", "button ph-button shelf-button dual-button-r");
            phRosterButton.textContent = "Converted to PH";
            offRosterButton.textContent = "OFF Roster";
            phSpan.appendChild(phRosterButton);
            phSpan.appendChild(offRosterButton);
            if(shifts[day].phOffRoster) {
                phRosterButton.addEventListener("click", function() {
                    shifts[day].phOffRoster = false;
                    reloadPageData();
                    saveToStorage("phor", "false");
                });
                offRosterButton.style.background = "";
                phRosterButton.style.background = buttonBackgroundColour;
            } else {
                offRosterButton.addEventListener("click", function() {
                    shifts[day].phOffRoster = true;
                    reloadPageData();
                    saveToStorage("phor", "true");
                });
                phRosterButton.style.background = "";
                offRosterButton.style.background = buttonBackgroundColour;
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
    bonusButton.setAttribute("class", "button bonus-button shelf-button");
    bonusTextbox.setAttribute("type", "text");
    bonusTextbox.setAttribute("inputmode", "decimal");
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

/**
 * Runs a when a time input field has been changed.
 * This function will advance the focus to the next time field when the current field is filled, save the changed time data to storage, and then refresh calculator data.
 * @param {number} field - the index of the time input field that has changed
 */
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

/**
 * Sets the background colour of the calculator
 * @param {string} colour - a valid CSS colour string
 */
function setFormColour(colour) {
    for(let i = 0; i < $(".container").length; i++) {
        $(".container")[i].style.backgroundColor = colour;
    }
}


/**
 * Get the currently selected pay-grade
 * @returns {string} the currently selected pay-grade string
 */
function getPayGrade() {
    return document.forms.payGradeForm.payGrade.value;
}

/**
 * Run when the paygrade has been set or changed. Updates all pay-rates, calculator colour, save the grade to storage and refresh the calculator
 */
function updateGrade() {
    $(".tso-dropdown").hide();
    $("#payClassWarning").hide();
    switch(getPayGrade()) {
        case "spot": 
            selectedGradeRates = spotRates;
            selectedEarlyShiftRates = earlyShiftRatesLoco;
            selectedAfternoonShiftRates = afternoonShiftRatesLoco;
            selectedNightShiftRates = nightShiftRatesLoco;
            setFormColour("#4691db");
            setSaveData("paygrade", "spot", false);
            setSaveData("paygrade", "spot");
            break;
        case "level1":
            selectedGradeRates = driverLevel1Rates;
            selectedEarlyShiftRates = earlyShiftRatesLoco;
            selectedAfternoonShiftRates = afternoonShiftRatesLoco;
            selectedNightShiftRates = nightShiftRatesLoco;
            setFormColour("rgb(114, 99, 191)");
            setSaveData("paygrade", "level1", false);
            setSaveData("paygrade", "level1");
            break;
        case "trainee":
            selectedGradeRates = traineeRates;
            selectedEarlyShiftRates = earlyShiftRatesLoco;
            selectedAfternoonShiftRates = afternoonShiftRatesLoco;
            selectedNightShiftRates = nightShiftRatesLoco;
            setFormColour("rgb(56, 149, 149)");
            setSaveData("paygrade", "trainee", false);
            setSaveData("paygrade", "trainee");
            break;
        case "conversion":
            selectedGradeRates = conversionRates;
            selectedEarlyShiftRates = earlyShiftRatesLoco;
            selectedAfternoonShiftRates = afternoonShiftRatesLoco;
            selectedNightShiftRates = nightShiftRatesLoco;
            setFormColour("rgb(207, 133, 50)");
            setSaveData("paygrade", "conversion", false);
            setSaveData("paygrade", "conversion");
            $("#payClassWarning").show();
            break;
        case "parttime":
            selectedGradeRates = spotRates;
            selectedEarlyShiftRates = earlyShiftRatesLoco;
            selectedAfternoonShiftRates = afternoonShiftRatesLoco;
            selectedNightShiftRates = nightShiftRatesLoco;
            setFormColour("rgb(56, 140, 65)");
            setSaveData("paygrade", "parttime", false);
            setSaveData("paygrade", "parttime");
            break;
        case "tso":
            selectedEarlyShiftRates = earlyShiftRatesSal;
            selectedAfternoonShiftRates = afternoonShiftRatesSal;
            selectedNightShiftRates = nightShiftRatesSal;
            switch($("#tso-so").val()) {
                case "so8":
                    selectedGradeRates = so8Rates;
                    setSaveData("paygrade", "so8", false);
                    setSaveData("paygrade", "so8");
                    break;
                case "so9":
                    selectedGradeRates = so9Rates;
                    setSaveData("paygrade", "so9", false);
                    setSaveData("paygrade", "so9");
                    break;
                case "so10":
                    selectedGradeRates = so10Rates;
                    setSaveData("paygrade", "so10", false);
                    setSaveData("paygrade", "so10");
                    break;
                case "so11":
                    selectedGradeRates = so11Rates;
                    setSaveData("paygrade", "so11", false);
                    setSaveData("paygrade", "so11");
                    break;
                case "so12":
                    selectedGradeRates = so12Rates;
                    setSaveData("paygrade", "so12", false);
                    setSaveData("paygrade", "so12");
                    break;
                default:
                    selectedGradeRates = undefined;
            }
            setFormColour("#606060");
            $(".tso-dropdown").show();
            $("#payClassWarning").show();
            break;
        default: 
            selectedGradeRates = undefined;
    }

    updateShiftWorkedCount(); //needed as the grade affects for phOffRoster which affects shiftWorkedCount
    closeAllOptionsShelves();
    printShiftHours();
    updateOptionsButtons();
    updateShiftPayTable();
    updateResults();
}

/**
 * Update each shift in the shift array with the values from the time input fields. Invlid shift times will set the shift to have zero hours.
 */
function updateShiftTable() {
    let times = timeField();
    /**
     * Converts a field index to a shift index
     * @param {number} field - field index
     */
    let fieldToShift = (field) => {
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

/**
 * Calculate and update the shiftNumber and shiftWorkedNumber for each shift in the shifts table. Non-shifts are set to 0. 
 */
function updateShiftWorkedCount() {
    let shiftsCount = 0;
    let shiftsWorkedCount = 0;
    if(ddoWeek() >= 0) shiftsWorkedCount = 1;
    for(let i = 0; i < shifts.length; i++) {
        //determine if shift
        if(shifts[i].hoursDecimal > 0 || shifts[i].sick || shifts[i].ph) {
            shifts[i].shiftNumber = ++shiftsCount;
        } else shifts[i].shiftNumber = 0;

        //determine if worked shift
        if(((shifts[i].hoursDecimal > 0 && !shifts[i].sick) || (shifts[i].sick && shifts[i].hoursDecimal > 4.0)) && !(shifts[i].phOffRoster && getPayGrade() == "parttime")) {
            shifts[i].shiftWorkedNumber = ++shiftsWorkedCount;
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

    //create grouped elements table for combined view, combining any elements that share the same payClass and rate
    let groupedElements = [];
    shiftPay.forEach(function(day){
        day.forEach(function(element){
            let elementIndex = groupedElements.findIndex(function(elem){return (element.payClass == elem.payClass) && (element.rate == elem.rate);});
            if(elementIndex == -1) {
                groupedElements.push(new PayElement(element.payType, element.hours, element.fcDateOffset, element.ojt));
            }
            else {
                groupedElements[elementIndex].hours += element.hours;
                groupedElements[elementIndex].value += element.value;
            }
            if(element.ojt) { //set OJT flag to trigger OJT footnote
                ojtFlag = true;
            }
        });
    });
    taxPay.forEach(function(element){
        let elementIndex = groupedElements.findIndex(function(elem){return (element.payClass == elem.payClass) && (element.rate == elem.rate);});
            if(elementIndex == -1) {
                groupedElements.push(new PayElement(element.payType, element.hours, element.fcDateOffset, element.ojt));
            }
            else {
                groupedElements[elementIndex].hours += element.hours;
                groupedElements[elementIndex].value += element.value;
            }
            if(element.ojt) { //set OJT flag to trigger OJT footnote
                ojtFlag = true;
            }
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
        elemAmount.textContent = "$" + payElement.value.toFixed(2);
        elemClass.className = "pay-element-class";
        payElementRow.appendChild(elemClass);
        payElementRow.appendChild(elemRate);
        payElementRow.appendChild(elemHours);
        payElementRow.appendChild(elemAmount);
        table.appendChild(payElementRow);
        if(payElement.helpText) {
            elemClass.addEventListener("click", function(){
                $(".pay-element-table > tr").css("background-color", ""); //clear existing highlights
                $(".hoursWorked").css("background-color", "");
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
            headerRow.innerHTML = "<th>Pay Class</th><th>Rate</th><th>Hours</th><th>Amount</th>";
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
                    shiftTitle.textContent = $(".day-of-week")[i].textContent;
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
            if(taxPay.length > 0) {
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
                for(let j = 0; j < taxPay.length; j++) {
                    addPayElementToResultsTable(taxPay[j], elementTable);
                }
            }
            if(ojtFlag) {
                let row = document.createElement("tr");
                let data =  document.createElement("td");
                data.textContent = "* = OJT rate"
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

        resultArea.appendChild(document.createElement("hr"));

        //subtotal
        let totalValue = 0.0; 
        groupedElements.forEach(function(e){
            totalValue += parseFloat(e.value.toFixed(2));
        });
        let totalElement = document.createElement("h3");
        totalElement.setAttribute("id", "totalElement");
        totalElement.textContent = "Total Gross: $" + totalValue.toFixed(2);
        resultArea.appendChild(totalElement);

        //payslip hours worked
        let payslipHoursWorked = 0.0;
        groupedElements.forEach(function(e){ //the elements which to sum together their hours
            if(["normal", "phWorked", "phGaz", "nonRosPH", "sickFull", "sickPart", "ot150", "ot200", "rost+50", "rost+100", "annualLeave", "guarantee", "edo", "bonusPayment", "phCredit"].includes(e.payType)) payslipHoursWorked += e.hours;
        });
        let payslipHoursWorkedElement = document.createElement("p");
        payslipHoursWorkedElement.classList.add("hoursWorked");
        payslipHoursWorkedElement.innerHTML = "Hours Worked on payslip:&nbsp&nbsp" + payslipHoursWorked.toFixed(2);
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
                    dayOfWeekFields[i].innerHTML += "<p class='subtext'>" + publicHolidays[phIndex].name + "</p>";
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
            totalHours += shifts[i].hoursDecimal;
        }
    }
    totalField.textContent = Math.floor(totalHours) + ":" + parseInt((totalHours % 1) * 60).toString().padStart(2, "0");
}

/**
 * Perform input validation on each time input field and display an error pop-up and icon if validation fails.
 */
function validateTimeFields() {
    const textboxErrorColour = "#ffd4d4";
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
        });
        errorPopup.className = "popuptext";
        errorPopup.textContent = "Sign-on and sign-off times must be 4 digits and between 0000 and 2359";
        errorSpan.appendChild(errorIcon);
        errorSpan.appendChild(errorPopup);
        if(!timeField[i*2].checkValidity() || !timeField[(i*2)+1].checkValidity()) {
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
            timeField[i*2].style.backgroundColor = textboxErrorColour;
            timeField[(i*2)+1].style.backgroundColor = textboxErrorColour;
            hoursField[i].innerHTML = "";
            errorPopup.textContent = "Sign-on and sign-off time cannot be the same"
            hoursField[i].appendChild(errorSpan);
            errorPopup.classList.add("show");
        }
    }
}

/**
 * Get the pay rate based on a given date from an array of rates. The rates array indicies should match those of the rateDates array
 * @param {Date} date - date of the shift
 * @param {number[]} rates - array of rates to check against the rateDates[] array
 * @returns {number} EBA pay rate
 */
function getEbaRate(date, rates) {
    let shiftDate = date.stripTime();
    for(let i = rates.length - 1; i >= 0; i--) {
        if(shiftDate.getTime() >= new Date(rateDates[i]).stripTime().getTime()){
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

//calculates pay elements for each shift in the shift table and places them into the pay table (shiftPay[])
/**
 * Calculates the pay elements for each shift in the shift table (shifts[]) and adds the pay elements into the pay table (shiftPay[]).
 * This is where all the pay calculation logic lives.
 */
function updateShiftPayTable() {
    let alShifts = [0, 0]; //[week1, week2]  //shifts counted as annual leave. designed to avoid using annual leave when sick or ph.
    let deductLeaveShifts = [0, 0]; //[week1, week2] //counters to keep track of shifts that would override an annual leave shift should there be a full week of annual leave
    let ordinaryHours = 8; //default ordinary hours of 8
    let alDdoDeducted = false; //annual leave DDO deducted
    let phOffCount = 0; //count PH-OFF shifts to count towards shifts worked for guarantee calculation only
    let payGrade = getPayGrade();
    if(payGrade == "trainee" || payGrade == "parttime") {
        ordinaryHours = 7.6;
    }
    shiftPay = []; //clear pay table
    taxPay = [];
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
            if(s.al) { //annual leave
                alShifts[weekNo(day)]++;
            }
            if(s.sick) {
                deductLeaveShifts[weekNo(day)]++;
                if(s.ph) {
                    shiftPay[day].push(new PayElement("phGaz", ordinaryHours, day));
                }
                else {
                    shiftPay[day].push(new PayElement("sickFull", ordinaryHours, day));
                }
            }
            else if(s.ph) { //public holiday
                phOffCount++;
                deductLeaveShifts[weekNo(day)]++;
                if(s.phOffRoster) {
                    if(payGrade != "parttime") {
                        shiftPay[day].push(new PayElement("nonRosPH", ordinaryHours, day));
                    }
                }
                else {
                    shiftPay[day].push(new PayElement("phGaz", ordinaryHours, day));
                }
            }
            else if(s.phc) { //public holiday credit leave
                deductLeaveShifts[weekNo(day)]++;
                shiftPay[day].push(new PayElement("phCredit", ordinaryHours, day));
            }
            if(s.ddo && !alDdoDeducted) {
                deductLeaveShifts[weekNo(day)]++;
                alDdoDeducted = true;
            }
        }
        else { //if shift has hours
            //categorise hours into today/tomorrow and ph/nonPh
            let todayNormalHours = 0.0;
            let tomorrowNormalHours = 0.0;
            let normalHours;
            let todayPhHours = 0.0;
            let tomorrowPhHours = 0.0;
            let tomorrowPh;
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

            //part-time PH-roster calculation
            if(getPayGrade() == "parttime" && s.phOffRoster) {
                shiftPay[day].push(new PayElement("phGaz", shiftHours, day));
            }
            else if(s.sick && s.hoursDecimal <= 4) {
                shiftPay[day].push(new PayElement("sickFull", ordinaryHours, day)); //if went of sick half-way through shift or earlier, pay sick full day.
            }
            else {
                //Public Holidays
                let normalPhWorkedHours = 0.0;
                let sundayPhWorkedHours = 0.0;
                let phXpayHours = 0.0; //obsolete: used for EA interpretation of calculation. Not used for payroll version. Keep variable for future reference
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
                    shiftPay[day].push(new PayElement("phWorked", normalPhWorkedHours, day, s.ojt));
                    shiftPay[day].push(new PayElement("phPen50", normalPhWorkedHours, day, s.ojt));
                }
                if(sundayPhWorkedHours > 0.0) {
                    shiftPay[day].push(new PayElement("phWorked", sundayPhWorkedHours, day, s.ojt));
                    shiftPay[day].push(new PayElement("phPen150", sundayPhWorkedHours, day, s.ojt));
                }
                //if(phXpayHours > 0.0) shiftPay[day].push(new PayElement("phXpay", phXpayHours, s.ojt)); //EA version: XPay based on hours worked. Keep for future reference
                if((normalPhWorkedHours > 0.0 && s.phExtraPay) && (day != 0 && day != 7)) shiftPay[day].push(new PayElement("phXpay", ordinaryHours, day, s.ojt)); //payroll version: XPay based on ordinary hours

                //Normal hours
                if(s.shiftWorkedNumber <= 10 && normalHours > 0.0){ 
                    shiftPay[day].push(new PayElement("normal", Math.min(normalHours, ordinaryHours), day, s.ojt));
                }

                //Guarantee and Sick-Part
                if(s.sick) { //if sick, sick-part in place of guarantee
                    let sickHours = ordinaryHours - s.hoursDecimal;
                    if(sickHours > 0.0) {
                        shiftPay[day].push(new PayElement("sickPart", sickHours, day));
                    }
                }
                else if(s.shiftWorkedNumber + phOffCount <= 10 && s.hoursDecimal < ordinaryHours) {
                    let guaranteeHours = ordinaryHours - s.hoursDecimal;
                    shiftPay[day].push(new PayElement("guarantee", guaranteeHours, day, s.ojt));
                }

                //Weekend Penalties
                if(s.shiftWorkedNumber <= 10) { //not OT shift only
                    let penaltyTime = Math.min(ordinaryHours, normalHours);
                    if(day == 5 || day == 12) { //friday shift
                        if(tomorrowNormalHours > 0.0) { //time into saturday
                            penaltyTime -= todayNormalHours;
                            if(penaltyTime > 0.0) {
                                shiftPay[day].push(new PayElement("wePen50", penaltyTime, day, s.ojt)); 
                            }
                        }
                    }
                    else if(day == 6 || day == 13) { //saturday shift
                        if(todayNormalHours > 0.0) { //saturday time
                            shiftPay[day].push(new PayElement("wePen50", Math.min(todayNormalHours, ordinaryHours), day, s.ojt));
                        }
                        penaltyTime -= todayNormalHours;
                        if(tomorrowNormalHours > 0.0 && penaltyTime > 0.0) { //sunday time
                            shiftPay[day].push(new PayElement("wePen100", penaltyTime, day, s.ojt));
                        }
                    }
                    else if(day == 0 || day == 7) { //sunday
                        if(todayNormalHours > 0.0) { //sunday time
                            shiftPay[day].push(new PayElement("wePen100", Math.min(todayNormalHours, ordinaryHours), day, s.ojt));
                        }
                    }
                }

                //Excess Hours Overtime
                if(normalHours > ordinaryHours && s.shiftWorkedNumber < 11) {
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

                    if(rost50hours > 0.0) shiftPay[day].push(new PayElement("rost+50", rost50hours, day, s.ojt));
                    if(rost100hours > 0.0) shiftPay[day].push(new PayElement("rost+100", rost100hours, day, s.ojt));
                    if(overtimeHours > 2) shiftPay[day].push(new PayElement("mealAllowance", 1, day));
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
                    if(ot150Hours > 0.0) shiftPay[day].push(new PayElement("ot150", ot150Hours, day, s.ojt));
                    if(ot200Hours > 0.0) shiftPay[day].push(new PayElement("ot200", ot200Hours, day, s.ojt));
                }

                //Shiftwork Allowances
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
                            shiftPay[day].push(new PayElement("earlyShift", shiftworkHours, day));
                        }
                        if(s.startHour < 18 && (s.endHour48 > 18 || (s.endHour48 == 18 && s.endMinute >= 30))) { //afternoon shift
                            shiftPay[day].push(new PayElement("afternoonShift", shiftworkHours, day));
                        }
                        if((s.startHour >= 18 && s.startHour <= 23) || (s.startHour >= 0 && s.startHour <= 3)) { //night shift
                            shiftPay[day].push(new PayElement("nightShift", shiftworkHours, day));
                        }
                    }
                }
            }
        }
        //bonus pay
        if(s.bonus) {
            if(s.bonusHours > 0) {
                shiftPay[day].push(new PayElement("bonusPayment", s.bonusHours, day)); 
            }
        }
        //suburban allowance
        if(getPayGrade() != "trainee" && getPayGrade() != "tso" && s.shiftWorkedNumber > 0) {
            shiftPay[day].push(new PayElement("metroSig2", 1, day));
        }
        //wasted meal
        if(s.wm) {
            shiftPay[day].push(new PayElement("mealAllowance", 1, day));
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
                    shiftPay[j].push(new PayElement("annualLeave", ordinaryHours, j));
                    shiftPay[j].push(new PayElement("leaveLoading", ordinaryHours, j));
                }
            }
        }
    }
    
    //pay calculation: DDO.
    if(payGrade != "trainee" && payGrade != "parttime") { //part time and trainee don't get DDO
        let day = ddoWeek();
        if(day < 0) {
            shiftPay[0].push(new PayElement("edo", -4, 0));
        }
        else {
            shiftPay[day].push(new PayElement("edo", 4, day));
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
    //first reset all shifts
    shifts = [];
    for (let i = 0; i < 14; i++) shifts.push(new Shift(i));

    if(datePrefix === "") {
        let weekCommencingDate = $("#week-commencing-date").datepicker("getDate");
        datePrefix += weekCommencingDate.getFullYear().toString() + (weekCommencingDate.getMonth() + 1).toString().padStart(2, "0") + weekCommencingDate.getDate().toString();
    }
    let savedPayGrade = getSaveData("paygrade");
    if(savedPayGrade == null) savedPayGrade = getSaveData("paygrade", false);
    switch(savedPayGrade) {
        case "spot":
            document.forms.payGradeForm.elements.namedItem("spot").checked = true;
            break;
        case "level1":
            document.forms.payGradeForm.elements.namedItem("level1").checked = true;
            break;
        case "parttime":
            document.forms.payGradeForm.elements.namedItem("parttime").checked = true;
            break;
        case "trainee":
            document.forms.payGradeForm.elements.namedItem("trainee").checked = true;
            break;
        case "conversion":
            document.forms.payGradeForm.elements.namedItem("conversion").checked = true;
            break;
        case "so8":
        case "so9":
        case "so10":
        case "so11":
        case "so12":
            document.forms.payGradeForm.elements.namedItem("tso").checked = true;
            $("#tso-so").val(savedPayGrade);
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
        let phorSave = getSaveData("day" + day + "phor");
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
        if(phorSave == "true") shifts[day].phOffRoster = true;
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
        setSaveData("day" + day + "phc", "")
        setSaveData("day" + day + "bonus", "");
        setSaveData("day" + day + "bonusHours", "");
        

        shifts[day].ojt = false;
        shifts[day].ddo = false;
        shifts[day].wm = false;
        shifts[day].sick = false;
        shifts[day].ph = false;
        shifts[day].phExtraPay = false;
        shifts[day].phOffRoster = false;
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

/**
 * Creates a help box window with settings to confugure tax and net pay
 */
function taxConfigurator() {
    document.getElementById("helpboxTitle").textContent = "Tax Configuration";
    let contentElement = document.getElementById("helpboxContent");
    contentElement.innerHTML = ""; //clear any existing content
    let formHeader = document.createElement("div");
    formHeader.classList.add("grid-1-3")
    formHeader.innerHTML = "<p>Configure options for tax and net calculation.<br><strong>Please note:</strong> These settings will stay constant regardless of the currently set fortnight. Any changes to these settings will affect NET and TAX calculations for any previously saved fortnights.</p><hr>";

    let createDollarPercentInput = (id) => {
        let dollarLabel = document.createElement("label");
        dollarLabel.textContent = "$";
        let percentLabel = document.createElement("label");
        percentLabel.textContent = "%";
        let inputDiv = document.createElement("div");
        inputDiv.classList.add("dollar-percent-input");
        let inputElement = document.createElement("input");
        inputElement.id = id;
        inputElement.setAttribute("type", "text");
        inputElement.setAttribute("inputmode", "decimal");
        inputDiv.appendChild(dollarLabel);
        inputDiv.appendChild(inputElement);
        inputDiv.appendChild(percentLabel);
        return inputDiv;
    }
   


    let formArea = document.createElement("form");
    formArea.id = "taxSettings";
    formArea.classList.add("grid-taxform")

    //enable checkbox
    let enableTaxCalcId = "enableTaxCalc";
    let enableCheckboxLabel = document.createElement("span");
    enableCheckboxLabel.textContent = "Enable Tax Calculation";
    let enableCheckboxInput = document.createElement("input");
    enableCheckboxInput.id = enableTaxCalcId;
    enableCheckboxInput.setAttribute("type", "checkbox");
    enableCheckboxInput.addEventListener("input", function(){
        if(this.checked) setSaveData(enableTaxCalcId, "true", false);
        else setSaveData(enableTaxCalcId, "", false);
    });
    formArea.appendChild(enableCheckboxLabel);
    formArea.appendChild(enableCheckboxInput);

    //etdsc membership
    let etdscId = "etdscMembership";
    let etdscLabel = document.createElement("span");
    etdscLabel.textContent = "ETDSC Membership";
    let etdscInput = document.createElement("select");
    etdscInput.id = etdscId;
    let etdscInputOptionNone = document.createElement("option");
    etdscInputOptionNone.textContent = "None";
    etdscInputOptionNone.setAttribute("value", "none")
    let etdscInputOptionFull = document.createElement("option");
    etdscInputOptionFull.textContent = "Full-Time";
    etdscInputOptionFull.setAttribute("value", "full")
    let etdscInputOptionHalf = document.createElement("option");
    etdscInputOptionHalf.textContent = "Part-Time/Job-Share";
    etdscInputOptionHalf.setAttribute("value", "half")
    etdscInput.addEventListener("input", function(){
        if(this.value == "full") setSaveData(etdscId, "full", false);
        else if(this.value == "half") setSaveData(etdscId, "half", false);
        else setSaveData(etdscId, "", false);
    });
    etdscInput.appendChild(etdscInputOptionNone);
    etdscInput.appendChild(etdscInputOptionFull);
    etdscInput.appendChild(etdscInputOptionHalf);
    formArea.appendChild(etdscLabel);
    formArea.appendChild(etdscInput);

    //HECS/STSL
    let stslId = "stsl";
    let stslLabel = document.createElement("span");
    stslLabel.textContent = "STSL/HECS";
    let stslInput = document.createElement("input");
    stslInput.id = stslId;
    stslInput.setAttribute("type", "checkbox");
    stslInput.addEventListener("input", function(){
        if(this.checked) setSaveData(stslId, "true", false);
        else setSaveData(stslId, "", false);
    });
    formArea.appendChild(stslLabel);
    formArea.appendChild(stslInput);

    //super salary sacrifice
    let superSalSacId = "superSalSac";
    let superSalSacLabel = document.createElement("span");
    superSalSacLabel.textContent = "Super Salary Sacrifice";
    let superSalSacInput = createDollarPercentInput(superSalSacId);
    superSalSacInput.addEventListener("input", function(){
        setSaveData(superSalSacId, document.forms.taxSettings.elements.namedItem(superSalSacId).value, false);
    });
    formArea.appendChild(superSalSacLabel);
    formArea.appendChild(superSalSacInput);

    //novated lease
    let novatedLeasePreId = "novatedLeasePre";
    let novatedLeasePreLabel = document.createElement("span");
    novatedLeasePreLabel.textContent = "Novated Lease Pre-Tax";
    let novatedLeasePreInput = createDollarPercentInput(novatedLeasePreId);
    novatedLeasePreInput.addEventListener("input", function(){
        setSaveData(novatedLeasePreId, document.forms.taxSettings.elements.namedItem(novatedLeasePreId).value, false);
    });
    formArea.appendChild(novatedLeasePreLabel);
    formArea.appendChild(novatedLeasePreInput);

    let novatedLeasePostId = "novatedLeasePost";
    let novatedLeasePostLabel = document.createElement("span");
    novatedLeasePostLabel.textContent = "Novated Lease Post-Tax";
    let novatedLeasePostInput = createDollarPercentInput(novatedLeasePostId);
    novatedLeasePostInput.addEventListener("input", function(){
        setSaveData(novatedLeasePostId, document.forms.taxSettings.elements.namedItem(novatedLeasePostId).value, false);
    });
    formArea.appendChild(novatedLeasePostLabel);
    formArea.appendChild(novatedLeasePostInput);

    //additional tax withheld
    let withholdExtraId = "withholdExtra";
    let withholdExtraLabel = document.createElement("span");
    withholdExtraLabel.textContent = "Additional Tax Withheld";
    let withholdExtraInput = createDollarPercentInput(withholdExtraId);
    withholdExtraInput.addEventListener("input", function(){
        setSaveData(withholdExtraId, document.forms.taxSettings.elements.namedItem(withholdExtraId).value, false);
    });
    formArea.appendChild(withholdExtraLabel);
    formArea.appendChild(withholdExtraInput);

    //show helpbox
    contentElement.appendChild(formHeader);
    contentElement.appendChild(formArea);
    $("#topHelpDiv").addClass("show-top-helpbox");
    if(helpboxContent.clientHeight > 300) {
        $(".scroll-indicator").show()
    }
    else {
        $(".scroll-indicator").hide()
    }

    //check and load saved tax config data
    if(getSaveData(enableTaxCalcId, false) == "true") enableCheckboxInput.checked = true;
    switch(getSaveData(etdscId, false)) {
        case "full": etdscInput.value = "full"; break;
        case "half": etdscInput.value = "half"; break;
        default: etdscInput.value = "none";
    }
    if(getSaveData(stslId, false) == "true") stslInput.checked = true;
    let superSalSacSave = getSaveData(superSalSacId, false);
    let novatedLeasePreSave = getSaveData(novatedLeasePreId, false);
    let novatedLeasePostSave = getSaveData(novatedLeasePostId, false);
    let withholdExtraSave = getSaveData(withholdExtraId, false);
    if(superSalSacSave) document.forms.taxSettings.elements.namedItem(superSalSacId).value = superSalSacSave;
    if(novatedLeasePreSave)document.forms.taxSettings.elements.namedItem(novatedLeasePreId).value = novatedLeasePreSave;
    if(novatedLeasePostSave) document.forms.taxSettings.elements.namedItem(novatedLeasePostId).value = novatedLeasePostSave;
    if(withholdExtraSave) document.forms.taxSettings.elements.namedItem(withholdExtraId).value = withholdExtraSave;

    
}

/**
 * Display the information box at the top of the page with a given title and body text
 * @param {string} title - the title-bar text (text only)
 * @param {string} helpText - information box body text (HTML formatting OK)
 */
function topHelpBox(title, helpText) {
    document.getElementById("helpboxTitle").textContent = title;
    document.getElementById("helpboxContent").innerHTML = helpText;
    $("#topHelpDiv").addClass("show-top-helpbox");
    if(helpboxContent.clientHeight > 300) {
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
            helpText = "<p><strong>Fortnight Commencing</strong><br />Before entering shift details, first ensure the correct dates are set and shown near the top of the Data Entry area. Use the <i class='fas fa-angle-double-left'></i> and <i class='fas fa-angle-double-right'></i> buttons to change the date range a fortnight at a time, or click the <i class='far fa-calendar-alt'></i> button to open the the date-picker and select the fornight that way. The date range that is selected is used for two purposes: determining the base pay-rate the calculator will use, and saving the data you have entered to the selected date. See <a href='javascript:topHelpBoxPreset(\"saveInfo\");'>Data Saving Info</a> for more information.</p>"
            + "<p><strong>Shift Input</strong><br />There are two parts to entering the details for each shift: <em>Shift Options</em> and <em>Sign-On/Sign-Off times</em>. You can set either in any order, you don't need to put shift times in first or vice-versa."
            + "<ul><li>To set shift options, click the shift options button (looks like this: " + dummyButton("OFF", "black", true) + " or " + dummyButton("Normal", normalColour, true) + ")"
            + ", then click the relevant options to toggle them on and off for that shift.</li>"
            + "<li>Enter sign-on and off times as four-digit 24-hour time with no colon, for example: 0330 or 2100</li></ul></p>"
            + "<p><strong>DDOs and Public Holidays: Worked or OFF?</strong>"
            + "<br />There is no separate button to distinguish OFF vs. Worked shifts. The calculator determines if your DDO or PH is worked or OFF depending on if you have entered sign-on and sign-off times for that day. For instance, if you worked your DDO, set the " + dummyButton("DDO", ddoColour) + " shift option and enter valid sign-on and sign-off times for that shift.</p>"
            + "<p><strong>Sick-Part</strong>"
            + "<br />For shifts where you went home sick part-way through a shift, set the " + dummyButton("Sick", sickColour) + " shift option and enter your sign-on time as normal. For your sign-off time, instead of your shifts normal sign-off time, set this as the time you were signed-off as going home sick.</p>"
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
            helpText = "<p>All shift-times and shift-options entered are automatically saved to the currently selected fortnight. In other words, the calculator will remember all the details you enter every time you use it."
            + "<br />Data saving allows you to do things like enter in shifts as you go, so you don't have to enter them all at once at the end of a pay cycle. You can also change the dates to load any data you entered in a different fortnight! </p>"
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
            + "<br />If you find any problems with the calculator, I'd love to hear about it. Find me on the Facebook page <i class='far fa-grin-alt'></i></p>"
            + "<ul>"
            + "<li>Developed by Petar Stankovic</li>"
            + "<li><a href='https://github.com/Hyperchicken/webPayCalculator'>GitHub Respository</a></li>"
            + "<li>Version: " + calcVersion + "</li>"
            + "<li>Last Update: " + calcLastUpdateDate +"</li>"
            + "</ul>";
            break;
        case "changelog":
            helpTitle = "Changelog and Known Issues";
            helpText = "<ul><strong>Known Issues</strong>"
            + "<li>Conversion and TSO grade calculations not yet thoroughly tested.</li>"
            + "<li>Page doesn't fit correctly on some devices with smaller screens.</li>"
            + "<li>Not all public holidays have their information complete.</li>"
            + "</ul>"
            + "<ul><strong>Changelog</strong>"
            + "<li>12/06/2020 - Version 1.16<ul>"
            + "<li>EA2019 payrates to start from 7/6/20</li>"
            + "<li>Updated backpay calculator to require only 3 payslips to calculate instead of the previous 24.</li>"
            + "</ul></li>"
            + "<li>10/06/2020 - Version 1.15<ul>"
            + "<li>EA2019 payrates to start from 7/6/20</li>"
            + "<li>Created a backpay calculator for EA 2019. Accessed from the menu.</li>"
            + "<li>Removed confusing 'Physical Hours Worked' counter. Replaced by a new 'Total Hours' indicator below the sign-on/off times.</li>"
            + "<li>Removed leading zero from certain values in the results to better match the formatting of the payslips.</li>"
            + "<li>The Javascript code now has better documentation and added GitHub repository link to Javascript file.</li>"
            + "<li>Scrollable indicator added to these information boxes.</li>"
            + "<li>Changed the input mode on sign-on/off fields to have iOS devices show a decimal keypad instead of a telephone dialpad.</li>"
            + "<li>Fixed bug where setting PH-Roster shift option as part-time, then switching paygrade would cause a miscalculation.</li>"
            + "</ul></li>"
            + "<li>14/05/2020 - Version 1.14<ul>"
            + "<li>Fixed TSO shiftwork rates.</li>"
            + "<li>Fixed calculation issue where excess hours would be paid at time and a half on a double-time shift.</li>"
            + "</ul></li>"
            + "<li>11/05/2020 - Version 1.13<ul>"
            + "<li>Added rates from 2015-2017. Previously the calculator only had rates from 2018 onwards.</li>"
            + "</ul></li>"
            + "<li>30/04/2020 - Version 1.12<ul>"
            + "<li>Improved Sunday public holiday calculation.</li>"
            + "</ul></li>"
            + "<li>30/04/2020 - Version 1.11<ul>"
            + "<li>Added Easter Sunday as a public holiday.</li>"
            + "</ul></li>"
            + "<li>29/04/2020 - Version 1.10<ul>"
            + "<li>Added new pay rates from EA 2019-2023</li>"
            + "<li>Rates of pay are now applied on a per-day basis instead of the same pay-rates for the whole fortnight.</li>"
            + "<li>Added public holiday detection. A new indication and button will now display on days that are observed to be public holidays. Clicking the button will show information about that public holiday.</li>"
            + "<li>Time input error message will now automatically pop-up.</li>"
            + "</ul></li>"
            + "<li>07/04/2020 - Version 1.09<ul>"
            + "<li>Updated shiftwork penalty rates for TSOs (unconfirmed if correct yet).</li>"
            + "<li>Minor text adjustments around the place.</li>"
            + "<li>Fixed incorrect rounding of hours for WePen50.</li>"
            + "<li>Date bar is now not clickable.</li>"
            + "<li>Made the border thinner for mobile devices.</li>"
            + "</ul></li>"
            + "<li>26/02/2020 - Version 1.08<ul>"
            + "<li>Removed suburban allowance from TSO grade calculation.</li>"
            + "<li>Adjusted font and page sizing to better fit smaller screens.</li>"
            + "<li>Changed how OJT pay elements are displayed in the results.</li>"
            + "</ul></li>"
            + "<li>19/02/2020 - Version 1.07<ul>"
            + "<li>Added TSO (PD and Training Officer) grades.</li>"
            + "<li>Fixed PH Extra Pay persisting after unselecting Public Holiday shift option.</li>"
            + "<li>Removed calculation warning from Trainee pay grade.</li>"
            + "</ul></li>"
            + "<li>18/02/2020 - Version 1.06<ul>"
            + "<li>Added support for part-time public holiday shifts that have converted to PH-roster. Part-timers who have had a shift convert to PH should enter in the sign-on/off times of the original shift and select the shift options 'Public Holiday' and 'PH Roster'.</li>"
            + "<li>Added support for Public Holidays OFF-roster. New public holiday shift option button added.</li>"
            + "<li>Minor text adjustments for better page-display.</li>"
            + "<li>Position of EDO pay element in 'grouped' results view better matches payslips, and is now attached to a day in 'split-view'.</li>"
            + "</ul></li>"
            + "<li>06/02/2020 - Version 1.05<ul>"
            + "<li>Changed PH Extra Pay calculation to give a fixed payment of 8 hours (7.6 hours for trainee/part-time) as opposed to time worked. EA says time worked but payroll pays the fixed amount (which is arguably fairer overall).</li>"
            + "<li>Fixed some instances where calculations were a few cents off.</li>"
            + "</ul></li>"
            + "<li>03/02/2020 - Version 1.04<ul>"
            + "<li>Minor help guide text update.</li>"
            + "<li>Pushed this version to try and fix the calculator not working correctly for some people after the website went down briefly.</li>"
            + "</ul></li>"
            + "<li>22/01/2020 - Version 1.03<ul>"
            + "<li>Improved fortnight-commencing functionality with updated layout and new buttons to quickly change fortnight.</li>"
            + "<li>The page will now remember the most recent fortnight-commencing date and automatically load it (but not for fortnights in the past).</li>"
            + "<li>Title and menu bar should no longer double in height on smaller screens. Menu-button text now automatically hides on small screens.</li>"
            + "</ul></li>"
            + "<li>14/01/2020 - Version 1.02<ul>"
            + "<li>Fixed another calculation issue with weekend penalty calculation when working excess hours overtime.</li>"
            + "</ul></li>"
            + "<li>12/01/2020 - Version 1.01<ul>"
            + "<li>Added support for Part-Time/Job-Share.</li>"
            + "<li>Added Sick-Part calculation.</li>"
            + "<li>Fixed an issue with weekend penalty calculation on Saturday shifts that work into Sunday.</li>"
            + "</ul></li>"
            + "<li>08/01/2020 - Version 1.00<ul>"
            + "<li>Out of Beta and into version 1.00! ✨</li>"
            + "<li>Added scrollbar to menu information boxes with lots of content.</li>"
            + "<li>Fixed options buttons text-wrap issue on Chrome.</li>"
            + "<li>Fixed Guarantee calculation with PH-OFF shifts.</li>"
            + "</ul></li>"
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