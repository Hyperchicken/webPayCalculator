//grades.js
//version 1.07
//defines each grade and their parameters.
const opsExcessHoursThreshold = 4
const driverExcessHoursThreshold = 3

const grades = {
    "spot" : {
        "name" : "Qualified Driver (SPOT)",
        "ordinaryDays" : 10,
        "ordinaryHours" : 8,
        "ddo" : true,
        "drivingGrade": true,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance" :  true,
        "excessHoursThreshold": driverExcessHoursThreshold,
        "payRates": spotRates,
        "earlyShiftRates": earlyShiftRatesLoco,
        "afternoonShiftRates": afternoonShiftRatesLoco,
        "nightShiftRates": nightShiftRatesLoco,
        "colour": "#4691db"
    },
    "level1" : {
        "name" : "Train Driver Level 1",
        "ordinaryDays" : 10,
        "ordinaryHours" : 8,
        "ddo" : true,
        "drivingGrade": true,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance" :  true,
        "excessHoursThreshold": driverExcessHoursThreshold,
        "payRates": driverLevel1Rates,
        "earlyShiftRates": earlyShiftRatesLoco,
        "afternoonShiftRates": afternoonShiftRatesLoco,
        "nightShiftRates": nightShiftRatesLoco,
        "colour": "rgb(114, 99, 191)"
    },
    "trainee" : {
        "name" : "Trainee Driver",
        "ordinaryDays" : 10,
        "ordinaryHours" : 7.6,
        "ddo" : false,
        "drivingGrade": true,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance" :  false,
        "excessHoursThreshold": driverExcessHoursThreshold,
        "payRates": traineeRates,
        "earlyShiftRates": earlyShiftRatesLoco,
        "afternoonShiftRates": afternoonShiftRatesLoco,
        "nightShiftRates": nightShiftRatesLoco,
        "colour": "rgb(56, 149, 149)"
    },
    "conversion" : {
        "name" : "Conversion Trainee Driver",
        "ordinaryDays" : 10,
        "ordinaryHours" : 8,
        "ddo" : true,
        "drivingGrade": true,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance" :  true,
        "excessHoursThreshold": driverExcessHoursThreshold,
        "payRates": conversionRates,
        "earlyShiftRates": earlyShiftRatesLoco,
        "afternoonShiftRates": afternoonShiftRatesLoco,
        "nightShiftRates": nightShiftRatesLoco,
        "colour": "rgb(207, 133, 50)"
    },
    "so8" : {
        "name" : "Train Services Officer SO-8",
        "ordinaryDays" : 10,
        "ordinaryHours" : 8,
        "ddo" : true,
        "drivingGrade": true,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance" :  false,
        "excessHoursThreshold": driverExcessHoursThreshold,
        "payRates": so8Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "#606060"
    },
    "so9" : {
        "name" : "Train Services Officer SO-9",
        "ordinaryDays" : 10,
        "ordinaryHours" : 8,
        "ddo" : true,
        "drivingGrade": true,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance" :  false,
        "excessHoursThreshold": driverExcessHoursThreshold,
        "payRates": so9Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "#606060"
    },
    "so10" : {
        "name" : "Train Services Officer SO-10",
        "ordinaryDays" : 10,
        "ordinaryHours" : 8,
        "ddo" : true,
        "drivingGrade": true,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance" :  false,
        "excessHoursThreshold": driverExcessHoursThreshold,
        "payRates": so10Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "#606060"
    },
    "so11" : {
        "name" : "Train Services Officer SO-11",
        "ordinaryDays" : 10,
        "ordinaryHours" : 8,
        "ddo" : true,
        "drivingGrade": true,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance" :  false,
        "excessHoursThreshold": driverExcessHoursThreshold,
        "payRates": so11Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "#606060"
    },
    "so12" : {
        "name" : "Train Services Officer SO-12",
        "ordinaryDays" : 10,
        "ordinaryHours" : 8,
        "ddo" : true,
        "drivingGrade": true,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance" :  false,
        "excessHoursThreshold": driverExcessHoursThreshold,
        "payRates": so12Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "#606060"
    },
    "so13" : {
        "name" : "Train Services Officer SO-13",
        "ordinaryDays" : 10,
        "ordinaryHours" : 8,
        "ddo" : true,
        "drivingGrade": true,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance" :  false,
        "excessHoursThreshold": driverExcessHoursThreshold,
        "payRates": so13Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "#606060"
    },
    "dao" : {
        "name" : "Driver Allocation Officer",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance":  false,
        "excessHoursThreshold": 4,
        "payRates": so2Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(157, 29, 29)"
    },
    "daoteamleader" : {
        "name": "Driver Allocation Officer Team Leader",
        "ordinaryDays": 9,
        "ordinaryHours": 8.5,
        "ddo": false,
        "drivingGrade": false,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance":  false,
        "excessHoursThreshold": 4,
        "payRates": so9Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(157, 29, 29)"
    },
    "driverrosters" : {
        "name": "Driver Rosters",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": false,
        "relievingExpenses": false,
        "higherDutiesGroup": false,
        "suburbanAllowance":  false,
        "excessHoursThreshold": 4,
        "payRates": so4Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(157, 29, 29)"
    },
    "sac1y1" : {
        "name": "SA1 Yr1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": saC1Y1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "sac1y2" : {
        "name": "SA1 Yr2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": saC1Y2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "sac1y3" : {
        "name": "SA1 Yr3",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": saC1Y3Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "sac2y1" : {
        "name": "SA2 Yr1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": saC2Y1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    }
    ,
    "sac2y2" : {
        "name": "SA2 Yr2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": saC2Y2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    }
    ,
    "sac2y3" : {
        "name": "SA2 Yr3",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": saC2Y3Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "sac3y1" : {
        "name": "SA3 Yr1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": saC3Y1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "sac3y2" : {
        "name": "SA3 Yr2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": saC3Y2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "sac3y3" : {
        "name": "SA3 Yr3",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": saC3Y3Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "lsay1" : {
        "name": "LSA Yr1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": lsaY1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "lsay2" : {
        "name": "LSA Yr2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": lsaY2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "lsay3" : {
        "name": "LSA Yr3",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": lsaY3Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "soc1d1" : {
        "name": "SO1 Div1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": soC1D1Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "soc1d2" : {
        "name": "SO1 Div2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": soC1D2Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "soc2d1" : {
        "name": "SO2 Div1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": soC2D1Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "soc2d2" : {
        "name": "SO2 Div2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": soC2D2Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "soc3d1" : {
        "name": "SO3 Div1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": soC3D1Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "soc3d2" : {
        "name": "SO3 Div2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": soC3D2Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "smc4d1" : {
        "name": "SM4 Div1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": smC4D1Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "smc4d2" : {
        "name": "SM4 Div2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": smC4D2Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "smc5d1" : {
        "name": "SM5 Div1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": smC5D1Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "smc5d2" : {
        "name": "SM5 Div2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": smC5D2Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "smc6d1" : {
        "name": "SM6 Div1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": smC6D1Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    }
    ,
    "smc6d2" : {
        "name": "SM6 Div2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": smC6D2Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "smc7d1" : {
        "name": "SM7 Div1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": smC7D1Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "smc7d2" : {
        "name": "SM7 Div2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": smC7D2Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "smc8d1" : {
        "name": "SM8 Div1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": smC8D1Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    },
    "smc8d2" : {
        "name": "SM8 Div2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": opsExcessHoursThreshold,
        "payRates": smC8D2Rates,
        "earlyShiftRates": earlyShiftRatesSal,
        "afternoonShiftRates": afternoonShiftRatesSal,
        "nightShiftRates": nightShiftRatesSal,
        "colour": "rgb(19, 49, 96)"
    }
    
}

const higherDutiesGroups = {
    "stations": [
        "sac1y1",
        "sac1y2",
        "sac1y3",
        "sac2y1",
        "sac2y2",
        "sac2y3",
        "sac3y1",
        "sac3y2",
        "sac3y3",
        "lsay1",
        "lsay2",
        "lsay3",
        "soc1d1",
        "soc1d2",
        "soc2d1",
        "soc2d2",
        "soc3d1",
        "soc3d2",
        "smc4d1",
        "smc4d2",
        "smc5d1",
        "smc5d2",
        "smc6d1",
        "smc6d2",
        "smc7d1",
        "smc7d2",
        "smc8d1",
        "smc8d2"
    ],
    "drivers": [
        "spot",
        "level1",
        "trainee",
        "conversion",
        "so8",
        "so9",
        "so10",
        "so11",
        "so12",
        "so13"
    ]
}