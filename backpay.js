$(document).ready(function() { 
    calculateBackpay();
});

function calculateBackpay() {
    let firstIncreaseTotals = [];
    let secondIncreaseTotals = [];
    for(let i = 0; i < 13; i++) {
        let currentValue = parseFloat($(".fortnight-value")[i].value);
        if(isNaN(currentValue)) {
            currentValue = 0;
        }
        firstIncreaseTotals.push(currentValue);
    }
    for(let i = 13; i < 24; i++) {
        let currentValue = parseFloat($(".fortnight-value")[i].value);
        if(isNaN(currentValue)) {
            currentValue = 0;
        }
        secondIncreaseTotals.push(currentValue);
    }
    let total = 0.0;
    for(let i = 0; i < firstIncreaseTotals.length; i++) {
        total += firstIncreaseTotals[i] * 0.01;
    }
    for(let i = 0; i < secondIncreaseTotals.length; i++) {
        total += secondIncreaseTotals[i] * 0.025;
    }
    return total;
}