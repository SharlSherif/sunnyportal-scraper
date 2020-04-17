const puppeteer = require('puppeteer');
const {liveData} = require("../public/database");

const opts = {
    url: 'https://sunnyportal.com',
    username: '<EMAIL>',
    password: '<PASSWORD>',
    plantOID: '<PLANTID>'
}

const openBrowser = async creds => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 620 })
    await page.goto(creds.url, { waitUntil: 'networkidle0', timeout: false }); // wait until page load
    await page.type('#txtUserName', creds.username);
    await page.type('#txtPassword', creds.password);
    return page;
}

class Table {
    constructor(power, energy, co2, weather, location) {
        this.power = power
        this.energy = energy
        this.co2 = co2
        this.weather = weather
        this.location = location
    }
}

const readData = async page => {
    /* ? "widgetBoxes" order is 
       Current PV Power
       PV Energy
       CO2 avoided
       Weather
       Location
    */
    const widgetBoxes = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".widgetBox .widgetBody .mainValue .mainValueAmount")).map(e => e.textContent).concat(Array.from(document.querySelectorAll("#ctl00_ContentPlaceHolder1_UserControlShowDashboard1_locationWidget_locationAddress")).map(e => e.textContent))
    })

    const Data = new Table(widgetBoxes[0], widgetBoxes[1], widgetBoxes[2], widgetBoxes[3], widgetBoxes[4])

    // save the live feed
    await liveData(Data)

    // * run this function recursively every 10 seconds

    setTimeout(()=> readData(page), 6000)
}

async function main(creds) {
    const page = await openBrowser(creds);

    await Promise.all([
        page.click('#ctl00_ContentPlaceHolder1_Logincontrol1_LoginBtn'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        await setTimeout(async () => await readData(page), 15000)
        // page.goto(creds.url, { waitUntil: 'networkidle0', timeout: false })
    ]);
}

main(opts);
