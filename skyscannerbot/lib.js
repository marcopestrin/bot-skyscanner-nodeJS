
module.exports = function (config) {
    this.config = config;
    this.browser = null;

    this.stop = async function () {
        await this.browser.newPage();
        await this.browser.close();
    };

    this.start = async function (args) {
        var bot = null;
        const fs = require("fs");
        let config = this.config;
        const puppeteer = require("puppeteer");
        const version = require("../version");
        let check = require("./common")(bot, null, config);
        if (config.ui !== true) {
            if (!fs.existsSync("./databases")) {
                fs.mkdirSync("./databases");
            }
            if (!fs.existsSync("./logs")) {
                fs.mkdirSync("./logs");
            }
        }
        
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
        let skyscanner = require("./mode/skyscanner")(bot, config, utils);

        /*
            VALIDATION DATA --> START
        */
            var currentMonth = new Date().getMonth() +1; // for ease I want January = 1
            if(args.length < 1 || args == undefined){
                // default params:
                args[0] = "Sydney"; //departure city
                args[1] = "Melbourne"; //destination city
                args[2] = true; //oneway?
                args[3] = currentMonth;
            }
            if(args[3] > 11) args[3] = currentMonth; //you can't have an input larger than 12
            if(args[3] < currentMonth) args[3] = currentMonth + 11; //because the first button is the current month

            //force from string to boolean
            if(args[2] == "true") args[2] = true;
            if(args[2] == "false") args[2] = false;
        /*
            VALIDATION DATA --> END
        */

        await skyscanner.start();

        if (skyscanner.isOk()) {
            skyscanner.setParams(args[0],args[1],args[2],args[3]);
        }
    };

};