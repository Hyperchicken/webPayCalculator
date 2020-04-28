/*
    Database of all Victorian public holidays

    Version: 1.00

    PHs from 2020 to 2023

    Dates must in format YYYY-MM-DD
*/
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
        infoText: "PH Info placeholder"
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
        infoText: "PH Info placeholder"
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
        infoText: "PH Info placeholder"
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
        infoText: "PH Info placeholder"
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
        infoText: "PH Info placeholder"
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
        infoText: "<ul><li>ANZAC Day public holiday is always observed on the 25th of April.</li><li>The public holiday does not move to a weekday when ANZAC Day falls on a weekend.</li><li>If ANZAC Day falls on a Saturday or a Sunday, paid leave of absence does not apply if you are OFF-roster.</li><li>If you are OFF roster, you should <em>not</em> select the Public Holiday shift option.</li><br>Excerpt from Metro EA 2015:<blockquote>For full-time Employees who are not rostered to work and not required to work on the Public Holiday, the provision of paid leave of absence will not be made for the Public Holiday for Easter Saturday, or Anzac Day when it falls on a Saturday or Sunday.</blockquote>"
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
        infoText: "PH Info placeholder"
    },
    {
        name: "Friday before the AFL Grand Final",
        dates: [
            //subject to AFL schedule
        ],
        infoTitle: "Friday before the AFL Grand Final Public Holiday",
        infoText: "PH Info placeholder"
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
        infoText: "PH Info placeholder"
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
        infoText: "PH Info placeholder"
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
        infoText: "PH Info placeholder"
    },
];
