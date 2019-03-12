const class_manager_state = require("../state").manager_state;

class skyscanner extends class_manager_state {
    constructor (bot, config, utils) {
        super();
        this.bot = bot;
        this.config = config;
        this.utils = utils;
        this.STATE = require("../state").STATE;
        this.STATE_EVENTS = require("../state").EVENTS;
        this.Log = require("../logger/log");
        this.log = new this.Log(this.LOG_NAME, this.config);
    }

    async openWebSite() {
        this.log.info("open website www.skyscanner.com");
        try {
            await this.bot.goto("https://www.skyscanner.com.au/");
        }catch (err) {
            this.log.error("I can't open the website: ".err);
        }
    }
    async setParams(cityOrigin, cityDestination, oneway, month) {
        this.log.info(`City Origin: ${cityOrigin}`);
        this.log.info(`City Destination: ${cityDestination}`);
        this.log.info(`Oneway? ${oneway}`);

        // ALL SELECTOR
        var idOrigin = "#fsc-origin-search";
        var idDestination = "#fsc-destination-search";
        var departDateFirstStep = "button#depart-fsc-datepicker-button";
        var buttonWholeMonth = "#depart-fsc-datepicker-popover nav ul li:nth-child(2)";
        var selectMonth = "#depart-fsc-datepicker-popover div[class^='Monthselector'] button:nth-child("+month+")";
        var justOneWay = "#flights-search-controls-root form label:nth-child(2) input";
        var submitButton = "#flights-search-controls-root form button[type=\'submit\']";
        // ALL SELECTOR

        await this.bot.waitForSelector(idOrigin);
        await this.bot.type(idOrigin, " ", {delay:100})
        await this.bot.type(idOrigin, cityOrigin, {delay:100})
        await this.utils.sleep(this.utils.randomInterval(1, 4));

        await this.bot.waitForSelector(idDestination);
        await this.bot.type(idDestination, " ", {delay:100})
        await this.bot.type(idDestination, cityDestination, {delay:100})
        await this.utils.sleep(this.utils.randomInterval(1, 4));
        
        if(oneway) {
            await this.bot.waitForSelector(justOneWay);
            var button = await this.bot.$(justOneWay);
            await button.click();
            this.log.info("select just one way, not return fly!"); 
        }
        
        try  {
            await this.bot.waitForSelector(departDateFirstStep);
            var button = await this.bot.$(departDateFirstStep);
            await button.click();
            this.log.info("departDate: first step");

            await this.bot.waitForSelector(buttonWholeMonth);
            var button = await this.bot.$(buttonWholeMonth);
            await button.click();
            this.log.info("departDate: second step");

            await this.bot.waitForSelector(selectMonth);
            var button = await this.bot.$(selectMonth);
            await button.click();
            this.log.info("departDate: third step");

        }catch(err){
            this.log.error("web scraping not working! re-ispect selector page");
        }

        this.log.info("sending data and looking the flights");
        await this.bot.waitForSelector(submitButton);
        let iniziaRicerca = await this.bot.$(submitButton);
        await iniziaRicerca.click();
    }

    async isOk() {
        return true
    }

    async start() {
        this.log.info("Start");
        await this.isOk();
        await this.openWebSite();
    }

}
module.exports = (bot, config, utils) => {
    return new skyscanner(bot, config, utils);
};