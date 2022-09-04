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
        "excessHoursThreshold": 3,
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
        "excessHoursThreshold": 3,
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
        "excessHoursThreshold": 3,
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
        "excessHoursThreshold": 3,
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
        "excessHoursThreshold": 3,
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
        "excessHoursThreshold": 3,
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
        "excessHoursThreshold": 3,
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
        "excessHoursThreshold": 3,
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
        "excessHoursThreshold": 3,
        "payRates": so12Rates,
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
        "ordinaryDays": 7,
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
    "sac1y1" : {
        "name": "SA C1 Y1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": saC1Y1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "sac1y2" : {
        "name": "SA C1 Y2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": saC1Y2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "sac1y3" : {
        "name": "SA C1 Y3",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": saC1Y3Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "sac2y1" : {
        "name": "SA C2 Y1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": saC2Y1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    }
    ,
    "sac2y2" : {
        "name": "SA C2 Y2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": saC2Y2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    }
    ,
    "sac2y3" : {
        "name": "SA C2 Y3",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": saC2Y3Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "sac3y1" : {
        "name": "SA C3 Y1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": saC3Y1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "sac3y2" : {
        "name": "SA C3 Y2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": saC3Y2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "sac3y3" : {
        "name": "SA C3 Y3",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": saC3Y3Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "lsay1" : {
        "name": "LSA Y1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": lsaY1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "lsay2" : {
        "name": "LSA Y2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": lsaY2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "lsay3" : {
        "name": "LSA Y3",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": lsaY3Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "soc1d1" : {
        "name": "SO C1 D1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": soC1D1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "soc1d2" : {
        "name": "SO C1 D2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": soC1D2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "soc2d1" : {
        "name": "SO C2 D1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": soC2D1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "soc2d2" : {
        "name": "SO C2 D2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": soC2D2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "soc3d1" : {
        "name": "SO C3 D1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": soC3D1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "soc3d2" : {
        "name": "SO C3 D2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": soC3D2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "smc4d1" : {
        "name": "SM C4 D1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": smC4D1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "smc4d2" : {
        "name": "SM C4 D2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": smC4D2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "smc5d1" : {
        "name": "SM C5 D1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": smC5D1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "smc5d2" : {
        "name": "SM C5 D2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": smC5D2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "smc6d1" : {
        "name": "SM C6 D1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": smC6D1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    }
    ,
    "smc6d2" : {
        "name": "SM C6 D2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": smC6D2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "smc7d1" : {
        "name": "SM C7 D1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": smC7D1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "smc7d2" : {
        "name": "SM C7 D2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": smC7D2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "smc8d1" : {
        "name": "SM C8 D1",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": smC8D1Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
        "colour": "rgb(19, 49, 96)"
    },
    "smc8d2" : {
        "name": "SM C8 D2",
        "ordinaryDays": 10,
        "ordinaryHours": 8,
        "ddo": true,
        "drivingGrade": false,
        "suburbanGroupWorking": true,
        "relievingExpenses": true,
        "higherDutiesGroup": "stations",
        "suburbanAllowance":  false,
        "excessHoursThreshold": 2,
        "payRates": smC8D2Rates,
        "earlyShiftRates": earlyShiftRatesTPW,
        "afternoonShiftRates": afternoonShiftRatesTPW,
        "nightShiftRates": nightShiftRatesTPW,
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
    ]
}