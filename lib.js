
module.exports = function (config) {
    this.config = config;
    this.browser = null;

    this.stop = async function () {
        await this.browser.newPage();
        await this.browser.close();
    };

    this.start = async function () {
        var bot = null;
        const fs = require("fs");
        let config = this.config;
        //let sqlite3 = require("sqlite3").verbose();
        //let db = [];
        const puppeteer = require("puppeteer");
        const version = require("../version");
        //const LOG = require("/logger/types");
        let check = require("./common")(bot, null, config);
        if (config.ui !== true) {
            if (!fs.existsSync("./databases")) {
                fs.mkdirSync("./databases");
            }
            if (!fs.existsSync("./logs")) {
                fs.mkdirSync("./logs");
            }
        }
        
        //db["logs"] = new sqlite3.Database(config.logdbPath);
        //db["fdf"] = new sqlite3.Database(config.fdfdatabasePath);
        
        await check.initEmpty();
        config = check.fixConfig(config);
        check.checkUpdates(version.version);
        
        if (config.executablePath === "" || config.executablePath === false) {
            this.browser = await puppeteer.launch({
                headless: config.chromeHeadless,
                args: config.chromeOptions,
                defaultViewport: {"width": 1024, "height": 768}
            });
        } else {
            this.browser = await puppeteer.launch({
                headless: config.chromeHeadless,
                args: config.chromeOptions,
                executablePath: config.executablePath,
                defaultViewport: {"width": 1024, "height": 768}
            });
        }
        
        bot = await this.browser.newPage();
        bot.setViewport({"width": 1024, "height": 768});
        let userAgent = await this.browser.userAgent();
        bot.setUserAgent(userAgent.replace("Headless", ""));
        let utils = require("./common")(bot, this.browser, config);
        let log = require("./logger/log");
        let skyscanner = require("./mode/skyscanner")(bot, config, utils);


        await skyscanner.start();

        if (skyscanner.isOk()) {
            /*
                params:
                1 - departure city
                2 - destination city
                3 - one-way --> true/false
            */
            skyscanner.setParams("Sydney","Melbourne",true);

        }
    };

};