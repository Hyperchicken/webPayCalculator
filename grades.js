//grades.js (vline)
//version 0.01
//defines each grade and their parameters.
const opsExcessHoursThreshold = 4
const driverExcessHoursThreshold = 3

const grades = {
    //DRIVING GRADES
    "drivervl" : {
        "name" : "DRIVER - V/L",
        "shortname": "Driver",
        "payCode": "PB205",
        "group": "Driver",
        "ordinaryDays" : 10,
        "ordinaryHours" : 8,
        "ddo" : false,
        "drivingGrade": true,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": "drivers",
        "suburbanAllowance" :  false,
        "ojt": true,
        "excessHoursThreshold": driverExcessHoursThreshold,
        "payRates": PB205,
        "earlyShiftRates": earlyShiftRatesLoco,
        "afternoonShiftRates": afternoonShiftRatesLoco,
        "nightShiftRates": nightShiftRatesLoco,
        "colour": "#753f98",
        "startDate": "",
        "endDate": ""
    }
}

const higherDutiesGroups = {
    "drivers": [
        "drivervl"
    ]
}