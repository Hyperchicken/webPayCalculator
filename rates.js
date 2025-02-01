/*
    rates.js (vline) - pay rates, allowances, tax rates and more.
    version 0.01
*/

//enterprise agreement pay rates
//rate array indexes correlate to the date of the same index of the rateDates array.

//Driver Rates
const rateDates =                       ["2024-01-14", "2024-07-14", "2025-01-12", "2025-07-13", "2026-01-11", "2026-07-12", "2027-01-10"]; //the date which the corresponding rate begins. MUST BE IN CHRONOLOGICAL ORDER (left to right)
const PB205 = /** DRIVER V/L */         [76.72,	       77.87,        79.04,        81.01,        83.04,        85.11,        87.24];

//Allowances        
const ojtAllowanceRates =               [11.00,        11.17,        11.33,        11.50,        11.67,        11.85,        12.03];
const pdtWeekendAllowanceRates =        [14.00,        14.21,        14.42,        14.64,        14.86,        15.08,        15.31];
const mealAllowanceRates =              [36.66,        37.20,        37.76,        38.33,        38.90,        39.49,        40.08];
//const suburbanAllowanceRates =          [10.6051,      13.1772,      13.3935,      18.6366,      18.8331,      24.4030,      24.6064];          
//const relievingExpensesRates =          [29.5052,      30.0953,      30.6972,      31.2344,      31.7810,      32.3372,      32.9031];
const suburbanGroupWorkingRates=        [8.9345,       9.1132,       9.2955,       9.4582,       9.6237,       9.7921,       9.9634];
const tAndIBedsRates =                  [147.14,       149.35,       151.59,       153.87,       156.17,       158.52,       160.89];

const earlyShiftRatesLoco =             [4.1216,       4.2041,       4.2882,       4.3632,       4.4396,       4.5172,       4.5963]; //a shift which is rostered to commence at or between 0400 and 0530
const afternoonShiftRatesLoco =         [4.1216,       4.2041,       4.2882,       4.3632,       4.4396,       4.5172,       4.5963]; //a shift which is rostered to commence before 1800 and conclude at or after 1830.
const nightShiftRatesLoco =             [4.8444,       4.9413,       5.0401,       5.1283,       5.2180,       5.3094,       5.4023]; //a shift which is rostered to commence at or between 1800 and 0359 hours.

const earlyShiftRatesSal =              [4.2662,       4.3515,       4.4386,       4.5162,       4.5953,       4.6757,       4.7575];
const afternoonShiftRatesSal =          [4.2662,       4.3515,       4.4386,       4.5162,       4.5953,       4.6757,       4.7575];
const nightShiftRatesSal =              [4.9892,       5.0890,       5.1908,       5.2816,       5.3740,       5.4681,       5.5638];

const earlyShiftRatesTPW =              [4.2415,       4.3263,       4.4128,       4.4901,       4.5686,       4.6486,       4.7299];
const afternoonShiftRatesTPW =          [4.2415,       4.3263,       4.4128,       4.4901,       4.5686,       4.6486,       4.7299];
const nightShiftRatesTPW =              [4.9408,       5.0396,       5.1404,       5.2304,       5.3219,       5.4150,       5.5098];

const disruptionAllowanceRates=         [1.0390,       1.0598,       1.0810,       1.0999,       1.1192,       1.1388,       1.1587];

//ETDSC fortnightly membership rates
const etdscDeductionDate =      ["2014-07-01",  "2024-08-25"];
const etdscFullMemberRate =     [6,             10];
const etdscHalfMemberRate =     [3,             5];
const etdscJobshareMemberRate = [12,            20];

//compulsary super contribution rates
const superRatesDate =  ["2014-07-01",  "2021-07-01",   "2022-07-01",   "2023-07-01",   "2024-07-01",   "2025-07-01"];
const superRates =      [0.095,         0.1,            0.105,          0.11,           0.115,          0.12];

//tax scales
//the dates of each set of scales must be in chronological order (earliest date first/top)
//data from Australian Tax Office - Statement of formulas for calculating amounts to be withheld
const taxScales = [
    {
        startDate: "2018-07-01",
        // [weekly earning less than, 'a' coefficient, 'b' coefficient]
        scale1: [ //Where the tax-free threshold is not claimed
            [72, 0.1900, 0.1900],
            [361, 0.2342, 3.2130],
            [932, 0.3477, 44.2476],
            [1380, 0.3450, 41.7311],
            [3111, 0.3900, 103.8657],
            [Infinity, 0.4700, 352.7888]
        ],
        scale2: [ //Where the employee claimed the tax‑free threshold
            [355, 0, 0],
            [422, 0.1900, 67.4635],
            [528, 0.2900, 109.7327],
            [711, 0.2100, 67.4635],
            [1282, 0.3477, 165.4423],
            [1730, 0.3450, 161.9808],
            [3461, 0.3900, 239.8654],
            [Infinity,  0.4700, 516.7885]
        ]
    },
    {
        startDate: "2020-10-13",
        // [weekly earning less than, 'a' coefficient, 'b' coefficient]
        scale1: [ //Where the tax-free threshold is not claimed
            [88, 0.1900, 0.1900],
            [371, 0.2348, 3.9639],
            [515, 0.2190, -1.9003],
            [932, 0.3477, 64.4297],
            [1957, 0.3450, 61.9132],
            [3111, 0.3900, 150.0093],
            [Infinity, 0.4700, 398.9324]
        ],
        scale2: [ //Where the employee claimed the tax‑free threshold
            [359, 0, 0],
            [438, 0.1900, 68.3462],
            [548, 0.2900, 112.1942],
            [721, 0.2100, 68.3465],
            [865, 0.2190, 74.8369],
            [1282, 0.3477, 186.2119],
            [2307, 0.3450, 182.7504],
            [3461, 0.3900, 286.5965],
            [Infinity,  0.4700, 563.5196]
        ]
    },
    {
        startDate: "2024-06-29",
        // [weekly earning less than, 'a' coefficient, 'b' coefficient]
        scale1: [ //Where the tax-free threshold is not claimed
            [150, 0.1600, 0.1600],
            [371, 0.2117, 7.7550],
            [515, 0.1890, -0.6702],
            [932, 0.3227, 68.2367],
            [2246, 0.3200, 65.7202],
            [3303, 0.3900, 222.9510],
            [Infinity, 0.4700, 487.2587]
        ],
        scale2: [ //Where the employee claimed the tax‑free threshold
            [361, 0, 0],
            [500, 0.1600, 57.8462],
            [625, 0.2600, 107.8462],
            [721, 0.1800, 57.8462],
            [865, 0.1890, 64.3365],
            [1282, 0.3227, 180.0385],
            [2596, 0.3200, 176.5769],
            [3653, 0.3900, 358.3077],
            [Infinity,  0.4700, 650.6154]
        ]
    }
];

//study and training support loans (STSL)/HECS
//the dates of each set of rates must be in chronological order (earliest date first/top).
const stslScales = [
    {
        startDate: "2018-07-01",
        scale1: [ //tax-free threshold NOT claimed
            // [weekly earnings less than, rate]
                [649, 0],
                [760, 0.02],
                [886, 0.04],
                [1013, 0.045],
                [1084, 0.05],
                [1192, 0.055],
                [1320, 0.06],
                [1408, 0.065],
                [1584, 0.07],
                [1711, 0.075],
                [Infinity, 0.08]
            ],
        scale2: [ //tax-free threshold CLAIMED
            // [weekly earnings less than, rate]
                [999, 0],
                [1110, 0.02],
                [1236, 0.04],
                [1363, 0.045],
                [1434, 0.05],
                [1542, 0.055],
                [1670, 0.06],
                [1758, 0.065],
                [1934, 0.07],
                [2061, 0.075],
                [Infinity, 0.08]
            ]
    },
    {
        startDate: "2019-07-01",
        scale1: [ //tax-free threshold NOT claimed
            // [weekly earnings less than, rate]
                [532, 0],
                [668, 0.01],
                [729, 0.02],
                [794, 0.025],
                [863, 0.03],
                [936, 0.035],
                [1013, 0.04],
                [1095, 0.045],
                [1181, 0.05],
                [1273, 0.055],
                [1371, 0.06],
                [1474, 0.065],
                [1583, 0.07],
                [1699, 0.075],
                [1822, 0.08],
                [1953, 0.085],
                [2091, 0.09],
                [2237, 0.095],
                [Infinity, 0.1]
            ],
        scale2: [ //tax-free threshold CLAIMED
            // [weekly earnings less than, rate]
                [882, 0],
                [1018, 0.01],
                [1079, 0.02],
                [1144, 0.025],
                [1213, 0.03],
                [1286, 0.035],
                [1363, 0.04],
                [1445, 0.045],
                [1531, 0.05],
                [1623, 0.055],
                [1721, 0.06],
                [1824, 0.065],
                [1933, 0.07],
                [2049, 0.075],
                [2172, 0.08],
                [2303, 0.085],
                [2441, 0.09],
                [2587, 0.095],
                [Infinity, 0.1]
            ]
    },
    {
        startDate: "2020-07-01",
        scale1: [ //tax-free threshold NOT claimed
            // [weekly earnings less than, rate]
                [546, 0],
                [685, 0.01],
                [747, 0.02],
                [813, 0.025],
                [882, 0.03],
                [956, 0.035],
                [1035, 0.04],
                [1118, 0.045],
                [1206, 0.05],
                [1299, 0.055],
                [1398, 0.06],
                [1503, 0.065],
                [1615, 0.07],
                [1732, 0.075],
                [1855, 0.08],
                [1990, 0.085],
                [2130, 0.09],
                [2279, 0.095],
                [Infinity, 0.1]
            ],
        scale2: [ //tax-free threshold CLAIMED
            // [weekly earnings less than, rate]
                [896, 0],
                [1035, 0.01],
                [1097, 0.02],
                [1163, 0.025],
                [1232, 0.03],
                [1306, 0.035],
                [1385, 0.04],
                [1468, 0.045],
                [1556, 0.05],
                [1649, 0.055],
                [1748, 0.06],
                [1853, 0.065],
                [1956, 0.07],
                [2082, 0.075],
                [2205, 0.08],
                [2340, 0.085],
                [2480, 0.09],
                [2629, 0.095],
                [Infinity, 0.1]
            ]
    },
    {
        startDate: "2023-07-01",
        scale1: [ //tax-free threshold NOT claimed
            // [weekly earnings less than, rate]
                [641, 0],
                [794, 0.01],
                [863, 0.02],
                [936, 0.025],
                [1023, 0.03],
                [1095, 0.035],
                [1181, 0.04],
                [1273, 0.045],
                [1371, 0.05],
                [1474, 0.055],
                [1583, 0.06],
                [1699, 0.065],
                [1822, 0.07],
                [1953, 0.075],
                [2091, 0.08],
                [2237, 0.085],
                [2393, 0.09],
                [2557, 0.095],
                [Infinity, 0.1]
            ],
        scale2: [ //tax-free threshold CLAIMED
            // [weekly earnings less than, rate]
                [991, 0],
                [1144, 0.01],
                [1213, 0.02],
                [1286, 0.025],
                [1363, 0.03],
                [1445, 0.035],
                [1531, 0.04],
                [1623, 0.045],
                [1721, 0.05],
                [1824, 0.055],
                [1933, 0.06],
                [2049, 0.065],
                [2172, 0.07],
                [2303, 0.075],
                [2441, 0.08],
                [2587, 0.085],
                [2743, 0.09],
                [2907, 0.095],
                [Infinity, 0.1]
            ]
    },
    {
        startDate: "2024-06-29",
        scale1: [ //tax-free threshold NOT claimed
            // [weekly earnings less than, rate]
                [696, 0],
                [858, 0.01],
                [931, 0.02],
                [1008, 0.025],
                [1089, 0.03],
                [1175, 0.035],
                [1267, 0.04],
                [1364, 0.045],
                [1467, 0.05],
                [1576, 0.055],
                [1692, 0.06],
                [1814, 0.065],
                [1944, 0.07],
                [2082, 0.075],
                [2228, 0.08],
                [2382, 0.085],
                [2546, 0.09],
                [2720, 0.095],
                [Infinity, 0.1]
            ],
        scale2: [ //tax-free threshold CLAIMED
            // [weekly earnings less than, rate]
                [1046, 0],
                [1208, 0.01],
                [1281, 0.02],
                [1358, 0.025],
                [1439, 0.03],
                [1525, 0.035],
                [1617, 0.04],
                [1714, 0.045],
                [1817, 0.05],
                [1926, 0.055],
                [2042, 0.06],
                [2164, 0.065],
                [2294, 0.07],
                [2432, 0.075],
                [2578, 0.08],
                [2732, 0.085],
                [2896, 0.09],
                [3070, 0.095],
                [Infinity, 0.1]
            ]
    }
];