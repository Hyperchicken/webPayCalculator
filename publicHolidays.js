/*
    Database of all Victorian public holidays

    Version: 1.0

    PHs from 2020 to 2023

    Dates must be a date object with format YYYY-MM-DDT00:00
*/
const publicHolidays = [
    {
        name: "New Year's Day",
        dates: [
            new Date("2020-01-01T00:00"),
            new Date("2021-01-01T00:00"),
            new Date("2022-01-01T00:00"),
            new Date("2022-01-03T00:00"),
            new Date("2023-01-01T00:00"),
            new Date("2023-01-02T00:00") //As New Year's Day falls on a Sunday, the Monday is an additional public holiday.
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
    {
        name: "Australia Day",
        dates: [
            new Date("2020-01-27T00:00"),
            new Date("2021-01-26T00:00"),
            new Date("2022-01-26T00:00"),
            new Date("2023-01-26T00:00")
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
    {
        name: "Labour Day",
        dates: [
            new Date("2020-03-09T00:00"),
            new Date("2021-03-08T00:00"),
            new Date("2022-03-14T00:00"),
            new Date("2023-03-13T00:00")
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
    {
        name: "Good Friday",
        dates: [
            new Date("2020-04-10T00:00"),
            new Date("2021-04-02T00:00"),
            new Date("2022-04-15T00:00"),
            new Date("2023-04-07T00:00")
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
    {
        name: "Easter Saturday",
        dates: [
            new Date("2020-04-11T00:00"),
            new Date("2021-04-03T00:00"),
            new Date("2022-04-16T00:00"),
            new Date("2023-04-08T00:00")
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
    {
        name: "Easter Sunday",
        dates: [
            new Date("2020-04-12T00:00"),
            new Date("2021-04-04T00:00"),
            new Date("2022-04-17T00:00"),
            new Date("2023-04-09T00:00")
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
    {
        name: "Easter Monday",
        dates: [
            new Date("2020-04-13T00:00"),
            new Date("2021-04-05T00:00"),
            new Date("2022-04-18T00:00"),
            new Date("2023-04-10T00:00")
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
    {
        name: "ANZAC Day",
        dates: [
            new Date("2020-04-25T00:00"),
            new Date("2021-04-25T00:00"),
            new Date("2022-04-25T00:00"),
            new Date("2023-04-25T00:00")
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
    {
        name: "Queen's Birthday",
        dates: [
            new Date("2020-06-08T00:00"),
            new Date("2021-06-14T00:00"),
            new Date("2022-06-13T00:00"),
            new Date("2023-06-12T00:00")
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
    {
        name: "Friday before the AFL Grand Final",
        dates: [
            //subject to AFL schedule
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
    {
        name: "Melbourne Cup",
        dates: [
            new Date("2020-11-03T00:00"),
            new Date("2021-11-02T00:00"),
            new Date("2022-11-01T00:00"),
            new Date("2023-11-07T00:00")
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
    {
        name: "Christmas Day",
        dates: [
            new Date("2020-12-25T00:00"),
            new Date("2021-12-25T00:00"),
            new Date("2021-12-27T00:00"),
            new Date("2022-12-25T00:00"),
            new Date("2022-12-27T00:00"),
            new Date("2023-12-25T00:00")
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
    {
        name: "Boxing Day",
        dates: [
            new Date("2020-12-26T00:00"),
            new Date("2020-12-28T00:00"),
            new Date("2021-12-26T00:00"),
            new Date("2021-12-28T00:00"),
            new Date("2022-12-26T00:00"),
            new Date("2023-12-26T00:00")
        ],
        informationLink: function () { topHelpBox(this.name + " Public Holiday", "PH Info placeholder"); },
    },
];
