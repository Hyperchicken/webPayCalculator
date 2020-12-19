/*
    Database of Victorian public holidays used for public holiday detection feature.

    Version: 1.05
    Public holdays from 2020 up to 2023

    Based on information provided in the Metro Enterprise Agreements and the following government website:
    https://www.business.vic.gov.au/victorian-public-holidays-and-daylight-saving/victorian-public-holidays

    Each entry should have the following keys:
    name: the name of the public holiday as a String
    dates: an array of Strings, with each string representing a date of the public holiday in the format YYYY-MM-DD
    infoTitle: the text in the title bar of the information box popup as String
    infoText: HTML formatted text in the body of the information box as String. Information about the public holiday, any special rules and instructions.
*/

//html for visual dummy buttons
const phDummyButton = "<a class=\"button\" style=\"background-color: #44c600; display: inline-block; border: none; cursor: default;\">Public Holiday</span></a>";
const phDummyButtonHollow = "<a class=\"button\" style=\"background-color: #5554; display: inline-block; border: solid; border-color: #44c600; border-width: 2px; cursor: default;\">Public Holiday</span></a>";

const publicHolidays = [
    {
        name: "New Year's Day",
        dates: [
            "2020-01-01",
            "2021-01-01",
            "2022-01-01",
            "2022-01-03",
            "2023-01-01",
            "2023-01-02" //As New Year's Day falls on a Sunday, the Monday is an additional public holiday.
        ],
        infoTitle: "New Year's Day Public Holiday",
        infoText: "PH Info placeholder"
    },
    {
        name: "Australia Day",
        dates: [
            "2020-01-27",
            "2021-01-26",
            "2022-01-26",
            "2023-01-26"
        ],
        infoTitle: "Australia Day Public Holiday",
        infoText: "<ul><li>Australia Day is celebrated on the 26th of January each year.</li><li>If Australia Day falls on a weekend, the public holiday is subtituted to the following weekday.</li><li>Select the " + phDummyButton + " shift option regardless of whether you're rostered to work or not (including if you're on leave).</li>"
    },
    {
        name: "Labour Day",
        dates: [
            "2020-03-09",
            "2021-03-08",
            "2022-03-14",
            "2023-03-13"
        ],
        infoTitle: "Labour Day Public Holiday",
        infoText: "<ul><li>No special rules or exceptions apply to Labour Day public holiday.</li><li>Select the " + phDummyButton + " shift option regardless of whether you're rostered to work or not (including if you're on leave).</li>"
    },
    {
        name: "Good Friday",
        dates: [
            "2020-04-10",
            "2021-04-02",
            "2022-04-15",
            "2023-04-07"
        ],
        infoTitle: "Good Friday Public Holiday",
        infoText: "<ul><li>No special rules or exceptions apply to Good Friday public holiday.</li><li>Select the " + phDummyButton + " shift option regardless of whether you're rostered to work or not (including if you're on leave).</li>"
    },
    {
        name: "Easter Saturday",
        dates: [
            "2020-04-11",
            "2021-04-03",
            "2022-04-16",
            "2023-04-08"
        ],
        infoTitle: "Easter Saturday Public Holiday",
        infoText: "<p class='warning-text'><i class='fas fa-exclamation-triangle fa-lg yellow-colour'></i>If you are underlined on the roster or have otherwise indicated that you are not available to work on Easter Saturday, paid leave of absence does not apply.</p><ul><li>If you are rostered to work Easter Saturday, or your shift has converted to PH on the roster, set the " + phDummyButton + " shift option.</li><li>If you are rostered OFF but not underlined, you should also set the " + phDummyButton + " shift option.</li><li>If you're not rostered to work and are either underlined or have otherwise indicated that you are not availble to work on Easter Saturday, you should <strong>not</strong> set the " + phDummyButtonHollow + " shift option.</li></ul><br><br>Excerpt from Metro EA 2015:<blockquote>4.17 Easter Saturday<br><br>4.17.1 Paid leave of absence will be made for the Easter Saturday Public Holiday to Employees who are rostered to work shifts over a seven (7) day cycle and are otherwise available to work, but are booked off.<br><br>4.17.2 Payment in these circumstances shall be in accordance with the following:<br><br>(a) Paid leave of absence does not count as a shift for the purpose of calculating Excess Shift entitlements;<br><br>(b) The provision shall not apply to Employees that are unavailable for duty on the day or days preceding the Public Holiday due to them being either on Annual Leave, Personal Leave, Long Service Leave, Compassionate/Bereavement Leave, Parental Leave, leave without pay or unable to attend work due to injury;<br><br>(c) Employees undertaking alternative duties that require them to work on a Monday to Friday basis shall not be entitled to the Easter Saturday Public Holiday as it occurs on a day when they would not be expected to work.</blockquote>"
    },
    {
        name: "Easter Sunday",
        dates: [
            "2020-04-12",
            "2021-04-04",
            "2022-04-17",
            "2023-04-09"
        ],
        infoTitle: "Easter Sunday Public Holiday",
        infoText: "<ul><li>As this public holiday falls on a Sunday, it is always paid at double time and a half.</li><li>There is no provision for extra leave.</li><li>Select the " + phDummyButton + " shift option regardless of whether you're rostered to work or not (including if you're on leave).</li>"
    },
    {
        name: "Easter Monday",
        dates: [
            "2020-04-13",
            "2021-04-05",
            "2022-04-18",
            "2023-04-10"
        ],
        infoTitle: "Easter Monday Public Holiday",
        infoText: "<ul><li>No special rules or exceptions apply to Easter Monday public holiday.</li><li>Select the " + phDummyButton + " shift option regardless of whether you're rostered to work or not (including if you're on leave).</li>"
    },
    {
        name: "ANZAC Day",
        dates: [
            "2020-04-25",
            "2021-04-25",
            "2022-04-25",
            "2023-04-25"
        ],
        infoTitle: "ANZAC Day Public Holiday",
        infoText: "<p class='warning-text'><i class='fas fa-exclamation-triangle fa-lg yellow-colour'></i> When ANZAC Day falls on a <strong>Saturday</strong> or a <strong>Sunday</strong>, paid leave of absence does not apply if you are not normally rostered to work on this day (ie: OFF-roster).</p><ul><li>ANZAC Day public holiday is always observed on the 25th of April.</li><li>ANZAC Day public holiday does not move to a weekday when ANZAC Day falls on a weekend.</li><li>If ANZAC Day falls on a Saturday or a Sunday, paid leave of absence does not apply if you are not normally rostered to work on this day (ie: OFF-roster).</li><li>If you are OFF roster, you should <strong>not</strong> select the " + phDummyButtonHollow + " shift option.</li><br>Excerpt from Metro EA 2015 section 2.15g:<blockquote>For full-time Employees who are not rostered to work and not required to work on the Public Holiday, the provision of paid leave of absence will not be made for the Public Holiday for Easter Saturday, or Anzac Day when it falls on a Saturday or Sunday.</blockquote>"
    },
    {
        name: "Queen's Birthday",
        dates: [
            "2020-06-08",
            "2021-06-14",
            "2022-06-13",
            "2023-06-12"
        ],
        infoTitle: "Queen's Birthday Public Holiday",
        infoText: "<ul><li>No special rules or exceptions apply to Queen's Birthday public holiday.</li><li>Select the " + phDummyButton + " shift option regardless of whether you're rostered to work or not (including if you're on leave).</li>"
    },
    {
        name: "Friday before the AFL Grand Final",
        dates: [
            //subject to AFL schedule
            "2020-10-23"
        ],
        infoTitle: "Friday before the AFL Grand Final Public Holiday",
        infoText: "<ul><li>No special rules or exceptions apply to Friday before the AFL Grand Final public holiday.</li><li>Select the " + phDummyButton + " shift option regardless of whether you're rostered to work or not (including if you're on leave).</li>"
    },
    {
        name: "Melbourne Cup",
        dates: [
            "2020-11-03",
            "2021-11-02",
            "2022-11-01",
            "2023-11-07"
        ],
        infoTitle: "Melbourne Cup Public Holiday",
        infoText: "<ul><li>No special rules or exceptions apply to Melbourne Cup public holiday.</li><li>Select the " + phDummyButton + " shift option regardless of whether you're rostered to work or not (including if you're on leave).</li>"
    },
    {
        name: "Christmas Day",
        dates: [
            "2020-12-25",
            "2021-12-25",
            "2021-12-27",
            "2022-12-25",
            "2022-12-27",
            "2023-12-25"
        ],
        infoTitle: "Christmas Day Public Holiday",
        infoText: "<ul><li>Where Christmas Day falls on a Saturday or Sunday, it is to be observed on 27th December.</li><li>Select the " + phDummyButton + " shift option regardless of whether you're rostered to work or not (including if you're on leave).</li>"
    },
    {
        name: "Boxing Day",
        dates: [
            "2020-12-26",
            "2020-12-28",
            "2021-12-26",
            "2021-12-28",
            "2022-12-26",
            "2023-12-26"
        ],
        infoTitle: "Boxing Day Public Holiday",
        infoText: "<ul><li>Where Boxing Day falls on a Saturday or Sunday, it is to be observed on 28th December.</li><li>Select the " + phDummyButton + " shift option regardless of whether you're rostered to work or not (including if you're on leave).</li>"
    },
];
