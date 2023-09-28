/*
    rates.js - pay rates, allowances, tax rates and more.
    version 1.06
*/

//enterprise agreement pay rates
//rate array indexes correlate to the date of the same index of the rateDates array.

//Driver Rates
const rateDates =               ["2015-01-11", "2015-07-12", "2016-01-10", "2016-07-10", "2017-01-08", "2017-07-09", "2018-01-07", "2018-07-08", "2019-01-06", "2020-06-07", "2020-07-05", "2021-01-03", "2021-07-04", "2022-01-02", "2022-07-03", "2023-01-01"]; //the date which the corresponding rate begins. MUST BE IN CHRONOLOGICAL ORDER (left to right)
const spotRates =               [45.1833,      45.8611,      46.5490,      47.2472,      47.9559,      48.6752,      49.4054,      50.6405,      51.9065,      53.7362,      54.2736,      55.6304,      56.1867,      57.5914,      58.1673,      /*5%*/62.6026 /*6%*//*63.1988*/ /*7%*//*63.7950*/ /*base*//*59.6215*/];
const driverLevel1Rates =       [30.6682,      31.1282,      31.5951,      32.0691,      32.5501,      33.0383,      33.5339,      34.3723,      35.2316,      36.4735,      36.8382,      37.7592,      38.1368,      39.0902,      39.4811,      40.4681];
const traineeRates =            [26.2727,      26.6668,      27.0668,      27.4728,      27.8849,      28.3031,      28.7277,      29.4459,      30.1820,      31.2459,      31.5584,      32.3473,      32.6708,      33.4876,      33.8225,      34.6680];
const conversionRates =         [42.1618,      42.7942,      43.4362,      44.0877,      44.7490,      45.4202,      46.1015,      47.2541,      48.4354,      50.1427,      50.6442,      51.9103,      52.4294,      53.7401,      54.2775,      55.6345];
const so2Rates =                [46.0125,      46.7027,      47.4033,      48.1143,      48.8360,      49.5686,      50.3121,      51.5699,      52.8591,      54.7224,      55.2696,      56.6513,      57.2179,      58.6483,      59.2384,      60.7157];
const so4Rates =                [0,            0,            0,            0,            0,            0,            0,            56.1014,      56.6624,      58.0790,      58.6598,      60.1263,      60.7275,      62.2457,      62.8682,      64.4399]
const so7Rates =                [53.0766,      53.8727,      54.6808,      55.5010,      56.3335,      57.1785,      58.0362,      59.4871,      60.9743,      63.1236,      63.7549,      65.3488,      66.0022,      67.6523,      68.3288,      70.0370];
const so8Rates =                [54.4860,      55.3033,      56.1328,      56.9748,      57.8295,      58.6969,      59.5774,      61.0668,      62.5935,      64.7999,      65.4479,      67.0841,      67.7550,      69.4488,      70.1433,      71.8969];
const so9Rates =                [55.8979,      56.7364,      57.5875,      58.4513,      59.3280,      60.2180,      61.1212,      62.6493,      64.2155,      66.4791,      67.1439,      68.8225,      69.5107,      71.2485,      71.9610,      73.7600];
const so10Rates =               [57.3130,      58.1727,      59.0453,      59.9310,      60.8300,      61.7424,      62.6686,      64.2353,      65.8412,      68.1621,      68.8437,      70.5648,      71.2705,      73.0522,      73.7827,      75.6273];
const so11Rates =               [58.7235,      59.6044,      60.4984,      61.4059,      62.3270,      63.2619,      64.2108,      65.8161,      67.4615,      69.8395,      70.5379,      72.3014,      73.0244,      74.8500,      75.5985,      77.4884];
const so12Rates =               [60.1328,      61.0348,      61.9503,      62.8796,      63.8228,      64.7801,      65.7518,      67.3956,      69.0805,      71.5156,      72.2307,      74.0365,      74.7769,      76.6463,      77.4128,      79.3481];
const so13Rates =               [0,            0,            0,            0,            0,            0,            0,            70.7132,      71.4203,      73.2058,      73.9379,      75.7863,      76.5442,      78.4578,      79.2424,      81.2235];

//Station Officer Rates
const soC1D1Rates =             [0,            0,            0,            0,            0,            0,            0,            34.5576,      34.9032,      35.7757,      36.1335,      37.0368,      37.4072,      38.3424,      38.7258,      39.6940];
const soC1D2Rates =             [0,            0,            0,            0,            0,            0,            0,            35.2409,      35.5933,      36.4831,      36.8480,      37.7692,      38.1469,      39.1005,      39.4915,      40.4788];
const soC2D1Rates =             [0,            0,            0,            0,            0,            0,            0,            35.9206,      36.2798,      37.1868,      37.5587,      38.4977,      38.8827,      39.8547,      40.2533,      41.2596];
const soC2D2Rates =             [0,            0,            0,            0,            0,            0,            0,            36.5944,      36.9604,      37.8844,      38.2632,      39.2198,      39.6120,      40.6023,      41.0083,      42.0335];
const soC3D1Rates =             [0,            0,            0,            0,            0,            0,            0,            37.6637,      38.0404,      38.9914,      39.3813,      40.3658,      40.7695,      41.7887,      42.2066,      43.2618];
const soC3D2Rates =             [0,            0,            0,            0,            0,            0,            0,            38.4953,      38.8803,      39.8523,      40.2508,      41.2571,      41.6697,      42.7114,      43.1385,      44.2170];
        
//Stationmaster Rates
const smC4D1Rates =             [0,            0,            0,            0,            0,            0,            0,            39.9302,      40.3295,      41.3377,      41.7511,      42.7949,      43.2228,      44.3034,      44.7464,      45.8651];
const smC4D2Rates =             [0,            0,            0,            0,            0,            0,            0,            41.0118,      41.4219,      42.4574,      42.8820,      43.9541,      44.3936,      45.5034,      45.9585,      47.1074];
const smC5D1Rates =             [0,            0,            0,            0,            0,            0,            0,            41.7971,      42.2151,      43.2704,      43.7031,      44.7957,      45.2437,      46.3748,      46.8385,      48.0095];
const smC5D2Rates =             [0,            0,            0,            0,            0,            0,            0,            42.4313,      42.8557,      43.9270,      44.3663,      45.4755,      45.9302,      47.0785,      47.5493,      48.7380];
const smC6D1Rates =             [0,            0,            0,            0,            0,            0,            0,            43.4759,      43.9107,      45.0085,      45.4586,      46.5950,      47.0610,      48.2375,      48.7199,      49.9379];
const smC6D2Rates =             [0,            0,            0,            0,            0,            0,            0,            44.2649,      44.7076,      45.8253,      46.2835,      47.4406,      47.9150,      49.1129,      49.6040,      50.8441];
const smC7D1Rates =             [0,            0,            0,            0,            0,            0,            0,            45.4446,      45.8991,      47.0466,      47.5170,      48.7050,      49.1920,      50.4218,      50.9260,      52.1992];
const smC7D2Rates =             [0,            0,            0,            0,            0,            0,            0,            46.7432,      47.2107,      48.3909,      48.8749,      50.0967,      50.5977,      51.8626,      52.3813,      53.6908];
const smC8D1Rates =             [0,            0,            0,            0,            0,            0,            0,            48.1837,      48.6656,      49.8822,      50.3810,      51.6405,      52.1570,      53.4609,      53.9955,      55.3454];
const smC8D2Rates =             [0,            0,            0,            0,            0,            0,            0,            49.6039,      50.0999,      51.3524,      51.8659,      53.1626,      53.6942,      55.0366,      55.5869,      56.9766];

//Station Assistant Rates
const saC3Y1Rates =                 [0,            0,            0,            0,            0,            0,            0,            28.6495,      28.9360,      29.6594,      29.9560,      30.7049,      31.0120,      31.7873,      32.1052,      32.9078];
const saC3Y2Rates =                 [0,            0,            0,            0,            0,            0,            0,            28.9409,      29.2303,      29.9611,      30.2607,      31.0172,      31.3273,      32.1105,      32.4316,      33.2424];
const saC3Y3Rates =                 [0,            0,            0,            0,            0,            0,            0,            29.2438,      29.5363,      30.2747,      30.5774,      31.3418,      31.6553,      32.4466,      32.7711,      33.5904];
const saC3Y1_12THSRates =           [0,            0,            0,            0,            0,            0,            0,            28.9218,      29.2110,      29.9413,      30.2407,      30.9967,      31.3067,      32.0894,      32.4103,      33.2205];
const saC3Y2_12THSRates =           [0,            0,            0,            0,            0,            0,            0,            29.2133,      29.5054,      30.2430,      30.5455,      31.3091,      31.6222,      32.4127,      32.7369,      33.5553];
const saC3Y3_12THSRates =           [0,            0,            0,            0,            0,            0,            0,            29.5161,      29.8112,      30.5565,      30.8621,      31.6336,      31.9500,      32.7487,      33.0762,      33.9031];
const saC2Y1Rates =                 [0,            0,            0,            0,            0,            0,            0,            29.3612,      29.6548,      30.3962,      30.7002,      31.4677,      31.7824,      32.5769,      32.9027,      33.7253];
const saC2Y2Rates =                 [0,            0,            0,            0,            0,            0,            0,            29.6526,      29.9491,      30.6978,      31.0048,      31.7799,      32.0977,      32.9002,      33.2292,      34.0599];
const saC2Y3Rates =                 [0,            0,            0,            0,            0,            0,            0,            29.9555,      30.2551,      31.0114,      31.3215,      32.1046,      32.4256,      33.2363,      33.5686,      34.4079];
const saC1Y1Rates =                 [0,            0,            0,            0,            0,            0,            0,            29.8503,      30.1488,      30.9025,      31.2115,      31.9918,      32.3117,      33.1195,      33.4507,      34.2870];
const saC1Y2Rates =                 [0,            0,            0,            0,            0,            0,            0,            30.1416,      30.4430,      31.2041,      31.5161,      32.3040,      32.6271,      33.4428,      33.7772,      34.6216];
const saC1Y3Rates =                 [0,            0,            0,            0,            0,            0,            0,            30.4445,      30.7490,      31.5177,      31.8329,      32.6287,      32.9550,      33.7789,      34.1167,      34.9696];
const lsaY1Rates =                  [0,            0,            0,            0,            0,            0,            0,            30.2272,      30.5295,      31.2927,      31.6056,      32.3958,      32.7197,      33.5377,      33.8731,      34.7199];
const lsaY2Rates =                  [0,            0,            0,            0,            0,            0,            0,            30.5184,      30.8236,      31.5942,      31.9101,      32.7079,      33.0350,      33.8608,      34.1994,      35.0544];
const lsaY3Rates =                  [0,            0,            0,            0,            0,            0,            0,            30.8215,      31.1297,      31.9079,      32.2270,      33.0327,      33.3630,      34.1971,      34.5391,      35.4025];

//Allowances
const ojtAllowanceRates =       [8.8927,       9.0261,       9.1615,       9.2989,       9.4384,       9.5800,       9.7237,       9.9668,       10.2159,      10.5760,      10.6818,      10.9488,      11.0583,      11.3348,      11.4481,      11.7343];
const mealAllowanceRates =      [10.6413,      10.8010,      10.9630,      11.1274,      11.2943,      11.4637,      11.6357,      11.9266,      12.2248,      12.6557,      12.7823,      13.1018,      13.2329,      13.5637,      13.6993,      14.0418];
const suburbanAllowanceRates =  [7.6496,       7.7644,       7.8809,       7.9991,       8.1190,       8.2408,       8.3644,       8.5736,       8.7879,       9.0977,       9.1887,       9.4184,       9.5126,       9.7504,       9.8479,       10.0941];
const relievingExpensesRates =  [0,            0,            0,            0,            0,            0,            0,            24.4495,      24.6940,      25.3113,      25.5645,      26.2036,      26.4656,      27.1272,      27.3985,      28.0835];
const suburbanGroupWorkingRates=[0,            0,            0,            0,            0,            0,            0,            7.4036,       7.4776,       7.6646,       7.7412,       7.9348,       8.0141,       8.2145,       8.2966,       8.5040];

const earlyShiftRatesLoco =     [2.9730,       3.0176,       3.0628,       3.1088,       3.1554,       3.2027,       3.2508,       3.3321,       3.4154,       3.5358,       3.5712,       3.6604,       3.6970,       3.7895,       3.8274,       3.9230]; //a shift which is rostered to commence at or between 0400 and 0530
const afternoonShiftRatesLoco = [2.9730,       3.0176,       3.0628,       3.1088,       3.1554,       3.2027,       3.2508,       3.3321,       3.4154,       3.5358,       3.5712,       3.6604,       3.6970,       3.7895,       3.8274,       3.9230]; //a shift which is rostered to commence before 1800 and conclude at or after 1830.
const nightShiftRatesLoco =     [3.4944,       3.5468,       3.6000,       3.6540,       3.7088,       3.7644,       3.8209,       3.9164,       4.0143,       4.1558,       4.1974,       4.3023,       4.3453,       4.4540,       4.4985,       4.6110]; //a shift which is rostered to commence at or between 1800 and 0359 hours.

const earlyShiftRatesTPW =      [3.0595,       3.1054,       3.1519,       3.1992,       3.2472,       3.2959,       3.3453,       3.4290,       3.5147,       3.6386,       3.6750,       3.7669,       3.8045,       3.8996,       3.9386,       4.0371];
const afternoonShiftRatesTPW =  [3.0595,       3.1054,       3.1519,       3.1992,       3.2472,       3.2959,       3.3453,       3.4290,       3.5147,       3.6386,       3.6750,       3.7669,       3.8045,       3.8996,       3.9386,       4.0371];
const nightShiftRatesTPW =      [3.5639,       3.6173,       3.6716,       3.7266,       3.7825,       3.8393,       3.8969,       3.9943,       4.0942,       4.2385,       4.2809,       4.3879,       4.4318,       4.5426,       4.5880,       4.7027];

const earlyShiftRatesSal =      [3.0773,       3.1234,       3.1703,       3.2178,       3.2661,       3.3151,       3.3648,       3.4489,       3.5352,       3.6598,       3.6964,       3.7888,       3.8267,       3.9224,       3.9616,       4.0606];
const afternoonShiftRatesSal =  [3.0773,       3.1234,       3.1703,       3.2178,       3.2661,       3.3151,       3.3648,       3.4489,       3.5352,       3.6598,       3.6964,       3.7888,       3.8267,       3.9224,       3.9616,       4.0606];
const nightShiftRatesSal =      [3.5988,       3.6528,       3.7076,       3.7632,       3.8196,       3.8769,       3.9351,       4.0335,       4.1343,       4.2800,       4.3228,       4.4309,       4.4752,       4.5871,       4.6330,       4.7488];

const disruptionAllowanceRates= [0,            0,            0,            0,            0,            0,            0,            0.8610,       0.8696,       0.8914,       0.9003,       0.9228,       0.9320,       0.9553,       0.9649,       0.9890]

//ETDSC fortnightly membership rates
const etdscFullMemberRate = 6;
const etdscHalfMemberRate = 3;
const etdscJobshareMemberRate = 12;

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
    }
];