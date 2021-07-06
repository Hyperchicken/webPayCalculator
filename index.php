<?php
  //set headers to NOT cache a page
  header("Cache-Control: no-cache, must-revalidate"); //HTTP 1.1
  header("Pragma: no-cache"); //HTTP 1.0
  header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pay Calculator</title>
    <link href="https://fonts.googleapis.com/css?family=Raleway|Source+Sans+Pro&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css?v=1.28">
    <link rel="stylesheet" href="jquery-ui.css">
    <link rel="shortcut icon" href="favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="apple-touch-icon-precomposed" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="manifest" href="site.webmanifest">
    <script src="jquery.js"></script> 
    <script src="jquery-ui.js"></script>
    <script src="publicHolidays.js?v1.05"></script> 
    <script src="rates.js?v=1.02"></script> 
    <script src="grades.js?v=1.00"></script> 
    <script src="scripts.js?v=1.28"></script> 
    <script defer src="icons/font-awesome-all.js"></script> 
</head>

<body>
    <ul class="topnav">
        <li class="topnav title"><i class="fas fa-search-dollar title-icon"></i>Pay Calculator<sup id="titleSuperscript"></sup></li>
        <li class="topnav dropdown">
            <a class="dropbtn" id="menuButton"><i class="fas fa-bars dropbtn-icon"></i></a>
            <div class="dropdown-content">
                <a id="helpMenuButton"><i class="fas fa-question-circle fa-fw menu-icon"></i>Help Guide</a>
                <!--<a id="backpayMenuButton"><i class="fas fa-money-check-alt fa-fw menu-icon"></i>Backpay Calculator</a>-->
                <!--<a id="printViewMenuButton"><i class="fas fa-print fa-fw menu-icon"></i>Print View</a>-->
                <a id="resetMenuButton"><i class="fas fa-undo fa-fw menu-icon"></i>Clear Form</a>
                <a id="saveInfoMenuButton"><i class="fas fa-save fa-fw menu-icon"></i>Saved Data</a>
                <a id="bulkLeaveMenuButton"><i class="fas fa-calendar-alt fa-fw menu-icon"></i>Bulk Leave</a>
                <a id="taxConfigurationMenuButton"><i class="fas fa-funnel-dollar fa-fw menu-icon"></i>Net Income Settings</a>
                <a id="changelogMenuButton"><i class="fas fa-code-branch fa-fw menu-icon"></i>Changelog</a>
                <a id="aboutMenuButton"><i class="fas fa-info-circle fa-fw menu-icon"></i>About</a>
            </div>
        </li>
    </ul>
    
    <noscript>Sorry, your browser does not support JavaScript or it is disabled! Please enable JavaScript to use the calculator!</noscript>

    <div id="topHelpDiv">
        <ul class="helpbox-topnav">
            <li class="helpbox-topnav" id="helpboxTitle"></li>
            <li class="helpbox-topnav dropdown helpbox-close-button"><i class="fas fa-times fa-fw fa-lg helpbox-close-button-icon"></i></a></li>
        </ul>
        <div id="helpboxContent"></div>
        <div id="helpboxScroll" class="scroll-indicator"><i class="fas fa-arrow-circle-down fa-fw"></i></div>
    </div>

    <span style="margin-bottom: 8px"></span>

    <div class="row">
        <div class="col-shift">
            <div class="container grid input-container" id="shift-details">
                <h3>Data Entry</h3>

                <div class="pay-grade-container">
                    <span>Grade:</span>
                    <select id="pay-grade" oninput="updateGrade()">
                        <option value="spot">SPOT</option>
                        <option value="level1">TD Lvl 1</option>
                        <option value="trainee">Trainee</option>
                        <option value="conversion">Conversion</option>
                        <option value="parttime">Part-Time (SPOT)</option>
                        <option value="jobshare">Job-Share (SPOT)</option>
                        <option value="so8">TSO SO-8</option>
                        <option value="so9">TSO SO-9</option>
                        <option value="so10">TSO SO-10</option>
                        <option value="so11">TSO SO-11</option>
                        <option value="so12">TSO SO-12</option>
                        <option value="dao">DAO</option>
                        <option value="daoteamleader">DAO Team-Leader</option>
                    </select>
                </div>

                <div id="payClassWarning" class="grid-1-6 start-hidden">
                    <p style="font-size: 0.8em; font-family: Verdana, sans-serif; border-style: solid; border-radius: 3px; border-width: 1px; background-color: #0005; padding: 5px;"><i class="fas fa-exclamation-triangle" style="color: yellow;"></i> Calculations for this pay-grade have not been thoroughly tested for accuracy!</p>
                </div>

                <div class="week-commencing">
					<span class="calendar-nav-button" onclick="datepickerShiftDays(-14)"><i class="fas fa-angle-double-left fa-fw calendar-nav-icon"></i></span><span class="week-commencing-button"><input type="text" id="date-button" placeholder="Select date" onchange="updateDates()" readonly="readonly"></span><span class="calendar-nav-button" onclick="datepickerShiftDays(14);"><i class="fas fa-angle-double-right fa-fw calendar-nav-icon"></i></span><span class="calendar-nav-button" onclick="toggleDatepicker();"><i class="far fa-calendar-alt fa-fw calendar-nav-icon"></i></span>
                </div>
                <div id="week-commencing-date">
                </div>
                
                <div class="hr"></div>

                <div class="grid-heading">DAY OF WEEK</div>
                <div class="shift-options-heading grid-heading">SHIFT OPTIONS</div>
                <div class="sign-on grid-heading">SIGN<br>ON</div>
                <div class="sign-off grid-heading">SIGN<br>OFF</div>
                <div class="grid-heading">HRS</div>

                <div class="day-of-week">Sunday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="sun1-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(0)">
                <input type="text" inputmode="decimal" id="sun1-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(1)">
                <div class="shift-hours" id="sun1-hours"></div>
                <div class="shift-options-shelf" id="sun1-options">[options buttons]</div>
            
                <div class="day-of-week">Monday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="mon1-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(2)">
                <input type="text" inputmode="decimal" id="mon1-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(3)">
                <div class="shift-hours" id="mon1-hours"></div>
                <div class="shift-options-shelf" id="mon1-options">[options buttons]</div>
            
                <div class="day-of-week">Tuesday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="tue1-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(4)">
                <input type="text" inputmode="decimal" id="tue1-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(5)">
                <div class="shift-hours" id="tue1-hours"></div>
                <div class="shift-options-shelf" id="tue1-options">[options buttons]</div>
            
                <div class="day-of-week">Wednesday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="wed1-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(6)">
                <input type="text" inputmode="decimal" id="wed1-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(7)">
                <div class="shift-hours" id="wed1-hours"></div>
                <div class="shift-options-shelf" id="wed1-options">[options buttons]</div>
            
                <div class="day-of-week">Thursday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="thu1-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(8)">
                <input type="text" inputmode="decimal" id="thu1-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(9)">
                <div class="shift-hours" id="thu1-hours"></div>
                <div class="shift-options-shelf" id="thu1-options">[options buttons]</div>
            
                <div class="day-of-week">Friday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="fri1-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(10)">
                <input type="text" inputmode="decimal" id="fri1-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(11)">
                <div class="shift-hours" id="fri1-hours"></div>
                <div class="shift-options-shelf" id="fri1-options">[options buttons]</div>
            
                <div class="day-of-week">Saturday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="sat1-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(12)">
                <input type="text" inputmode="decimal" id="sat1-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(13)">
                <div class="shift-hours" id="sat1-hours"></div>
                <div class="shift-options-shelf" id="sat1-options">[options buttons]</div>

                <div class="hr"></div>
            
                <div class="day-of-week">Sunday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="sun2-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(14)">
                <input type="text" inputmode="decimal" id="sun2-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(15)">
                <div class="shift-hours" id="sun2-hours"></div>
                <div class="shift-options-shelf" id="sun2-options">[options buttons]</div>
            
                <div class="day-of-week">Monday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="mon2-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(16)">
                <input type="text" inputmode="decimal" id="mon2-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(17)">
                <div class="shift-hours" id="mon2-hours"></div>
                <div class="shift-options-shelf" id="mon2-options">[options buttons]</div>
            
                <div class="day-of-week">Tuesday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="tue2-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(18)">
                <input type="text" inputmode="decimal" id="tue2-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(19)">
                <div class="shift-hours" id="tue2-hours"></div>
                <div class="shift-options-shelf" id="tue2-options">[options buttons]</div>
            
                <div class="day-of-week">Wednesday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="wed2-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(20)">
                <input type="text" inputmode="decimal" id="wed2-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(21)">
                <div class="shift-hours" id="wed2-hours"></div>
                <div class="shift-options-shelf" id="wed2-options">[options buttons]</div>
            
                <div class="day-of-week">Thursday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="thu2-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(22)">
                <input type="text" inputmode="decimal" id="thu2-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(23)">
                <div class="shift-hours" id="thu2-hours"></div>
                <div class="shift-options-shelf" id="thu2-options">[options buttons]</div>
            
                <div class="day-of-week">Friday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="fri2-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(24)">
                <input type="text" inputmode="decimal" id="fri2-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(25)">
                <div class="shift-hours" id="fri2-hours"></div>
                <div class="shift-options-shelf" id="fri2-options">[options buttons]</div>
            
                <div class="day-of-week">Saturday</div>
                <div class="shift-options"><a class="button options-button">...</a></div>
                <input type="text" inputmode="decimal" id="sat2-start" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(26)">
                <input type="text" inputmode="decimal" id="sat2-end" placeholder="0000" maxlength="4" pattern="([0-1][0-9]|2[0-3])[0-5][0-9]" class="time" oninput="timeChanged(27)">
                <div class="shift-hours" id="sat2-hours"></div>
                <div class="shift-options-shelf" id="sat2-options">[options buttons]</div>

                <div class="day-of-week last-sunday">Sunday</div>
                <div class="last-sunday grid-2-6">
                    <a id="lastSunPhNo" class="button yes-no-button dual-button-l">No</a>
                    <a id="lastSunPhYes" class="button yes-no-button dual-button-r">Yes</a>
                    <p>Public Holiday?</p>
                </div>

                <div class="total-hours-text">Total Hours:</div>
                <div class="shift-hours total-hours"></div>
            </div>
        </div> 
        
        <div class="col-50">
            <div class="container" id="results-container">
                <h3>Results</h3>
                <div class="view-mode">
                    <span>View Mode:</span>
                    <form class="radio-buttons" id="results-view-radios" name="resultsViewForm" oninput="updateResults()">
                        <label class="radio-container no-left-margin">Payslip
                            <input type="radio" name="resultsView" value="grouped" checked="checked">
                            <span class="checkmark"></span>
                        </label>
                        <label class="radio-container">Day-by-day
                            <input type="radio" name="resultsView" value="split">
                            <span class="checkmark"></span>
                        </label>
                        <label class="radio-container debug">Debug-Grouped
                            <input type="radio" name="resultsView" value="debug-grouped">
                            <span class="checkmark"></span>
                        </label>
                        <label class="radio-container debug">Debug-Split
                            <input type="radio" name="resultsView" value="debug-split">
                            <span class="checkmark"></span>
                        </label>
                    </form>
                </div>
                <hr>
                <div id="result-area">
                    <p>No data entered.</p>
                </div>
            </div>
        </div>
    </div>
    
</body>
</html> 