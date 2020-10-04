const puppeteer = require('puppeteer');

const pup = async content => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://nilc-fakenews.herokuapp.com/', {waitUntil: "domcontentloaded"});
    await page.type('#news', content);
    await page.click('#send'); 
    const veredict = await new Promise(resolve => {
        page.on('response', async (response) => {
            if (response.url() === "https://nilc-fakenews.herokuapp.com/ajax/check_web/") {
                const result =  await response.json();
                resolve(result.result);
            } 
        });
    });
    return veredict;
}

module.exports = {
    pup
}