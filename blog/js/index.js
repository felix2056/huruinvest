"use strict";
const calculate = async () => {
    if (!validateForm()) {
        return;
    }
    const btcPrices = await getBtcPrices();
    const month = getMonth();
    const amount = getAmount();
    const price = btcPrices[month];
    if (!price) {
        invalidMonthRange();
        return;
    }
    const lastPrice = btcPrices.lastMonth;
    const roi = (lastPrice - price) / price;
    const grossProfit = roi * amount;
    setGrossProfit(grossProfit);
    setROI(roi);
    showResults();
};
const getBtcPrices = async () => {
    const csv = await fetch("https://haruinvest.com/blog/wp-content/uploads/bal-btc/btc-prices.csv");
    const content = await csv.text();
    const table = Papa.parse(content, {
        header: true
    }).data;
    const result = {};
    table.forEach(({ Date, Price }) => {
        result[Date] = parseFloat(Price);
    });
    result["lastMonth"] = parseFloat(table[0].Price);
    return result;
};
const getMonth = () => {
    const value = document.querySelector("#month").value;
    return moment(value, "MM/YY").format("MMM YYYY");
};
const getAmount = () => {
    const value = document.querySelector("#amount").value;
    return parseFloat(value);
};
const setGrossProfit = (value) => {
    const asText = value.toFixed(2);
    document.querySelector("#gross-profit").textContent = `${asText} $`;
};
const setROI = (value) => {
    const asText = (value * 100).toFixed(2);
    document.querySelector("#roi").textContent = `${asText} %`;
};
const showResults = () => {
    document.querySelector("#results").classList.add("bal-active");
    document.querySelector(".bal-warn").classList.add("bal-active");
};
const validateForm = () => {
    const form = document.querySelector("#form");
    form.reportValidity();
    return form.checkValidity();
};
const invalidMonthRange = () => {
    //
};
const submit = async (e) => {
    e.preventDefault();
    await calculate();
};
const submitOnEnter = async (e) => {
    const kbdEvent = e;
    if (kbdEvent.key === "Enter") {
        await submit(e);
    }
};
document.querySelector("#cta").addEventListener("click", submit);
document.querySelector("#amount").addEventListener("keyup", submitOnEnter);
document.querySelector("#month").addEventListener("keyup", submitOnEnter);