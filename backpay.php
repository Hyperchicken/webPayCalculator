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
    <title>Backpay Calculator</title>
    <link href="https://fonts.googleapis.com/css?family=Raleway|Source+Sans+Pro&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css?v=1.14">
    <link rel="stylesheet" href="jquery-ui.css">
    <link rel="shortcut icon" href="favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="apple-touch-icon-precomposed" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="manifest" href="site.webmanifest">
    <script src="jquery.js"></script> 
    <script src="jquery-ui.js"></script>
    <script src="backpay.js?v=1.00"></script> 
    <script defer src="icons/font-awesome-all.js"></script> 
</head>

<body>
    <ul class="topnav">
        <li class="topnav title"><i class="fas fa-money-check-alt title-icon"></i>Backpay<sup id="titleSuperscript"></sup></li>
        <li class="topnav dropdown">
            <a class="dropbtn" id="menuButton"><i class="fas fa-bars dropbtn-icon"></i></a>
            <div class="dropdown-content">
                <a id="paycalcMenuButton"><i class="fas fa-search-dollar menu-icon"></i>Pay Calculator</a>
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
        <div id="helpboxScroll" class="scroll-indicator">Scroll <i class="fas fa-arrow-circle-down"></i></div>
    </div>

    <span style="margin-bottom: 8px"></span>

    <div class="row">
        <div class="col-shift">
            <div class="container grid input-container" id="shift-details">
                <h3 style="margin-bottom: 0;">Data Entry</h3>
                <p class="grid-1-6" style="font-size: 0.9em;">Enter in the GROSS pay amount from each payslip between 7/7/19 and 6/6/20 to calculate the backpay amount.<br>The calculator simply applies 1% to the total of the payslips up to 4/1/20, then 2.5% to 6/6/20</p>
                <div class="grid-heading grid-1-3">FORTNIGHT</div>
                <div class="shift-options-heading grid-heading grid-3-5">TOTAL GROSS</div>

                <div class="day-of-week centre-text grid-1-3">7/7/19 <i class="fas fa-long-arrow-alt-right"></i> 20/7/19</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
            
                <div class="day-of-week centre-text grid-1-3">21/7/19 <i class="fas fa-long-arrow-alt-right"></i> 3/8/19</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>

                <div class="day-of-week centre-text grid-1-3">4/8/19 <i class="fas fa-long-arrow-alt-right"></i> 17/8/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">18/8/19 <i class="fas fa-long-arrow-alt-right"></i> 31/8/19</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">1/9/19 <i class="fas fa-long-arrow-alt-right"></i> 14/9/19</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">15/9/19 <i class="fas fa-long-arrow-alt-right"></i> 28/9/19</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">29/9/19 <i class="fas fa-long-arrow-alt-right"></i> 12/10/19</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">13/10/19 <i class="fas fa-long-arrow-alt-right"></i> 26/10/19</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">27/10/19 <i class="fas fa-long-arrow-alt-right"></i> 9/11/19</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">10/11/19 <i class="fas fa-long-arrow-alt-right"></i> 23/11/19</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">24/11/19 <i class="fas fa-long-arrow-alt-right"></i> 7/12/19</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">8/12/19 <i class="fas fa-long-arrow-alt-right"></i> 21/12/19</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">22/12/19 <i class="fas fa-long-arrow-alt-right"></i> 4/1/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>

                <div class="hr"></div>

                <div class="day-of-week centre-text grid-1-3">5/1/20 <i class="fas fa-long-arrow-alt-right"></i> 18/1/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">19/1/20 <i class="fas fa-long-arrow-alt-right"></i> 1/2/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">2/2/20 <i class="fas fa-long-arrow-alt-right"></i> 15/2/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">16/2/20 <i class="fas fa-long-arrow-alt-right"></i> 29/2/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>

                <div class="day-of-week centre-text grid-1-3">1/3/20 <i class="fas fa-long-arrow-alt-right"></i> 14/3/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
                
                <div class="day-of-week centre-text grid-1-3">15/3/20 <i class="fas fa-long-arrow-alt-right"></i> 28/3/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>

                <div class="day-of-week centre-text grid-1-3">29/3/20 <i class="fas fa-long-arrow-alt-right"></i> 11/4/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>

                <div class="day-of-week centre-text grid-1-3">12/4/20 <i class="fas fa-long-arrow-alt-right"></i> 25/4/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>

                <div class="day-of-week centre-text grid-1-3">26/4/20 <i class="fas fa-long-arrow-alt-right"></i> 9/5/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>

                <div class="day-of-week centre-text grid-1-3">10/5/20 <i class="fas fa-long-arrow-alt-right"></i> 23/5/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>

                <div class="day-of-week centre-text grid-1-3">24/5/20 <i class="fas fa-long-arrow-alt-right"></i> 6/6/20</div>
                <div class="grid-3-5" style="color: #000; background-color: #fff; border-radius: 5px;"><label style="padding-left: 5px;">$</label><input type="tel" placeholder="0.00" class="fortnight-value" pattern="\d+(\.\d{0,2})?" style="width: 70%" oninput="calculateBackpay()"></div>
            </div>
        </div> 
        
        <div class="col-50">
            <div class="container" id="results-container">
                <h3>Results</h3>
                <div id="result-area" style="font-family: 'Courier New', Courier, monospace;">
                    <p>No data entered.</p>
                </div>
            </div>
        </div>
    </div>
    
</body>
<script>
    function asd(){

    }
</script>
</html> 