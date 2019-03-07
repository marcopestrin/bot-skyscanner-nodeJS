class utils {
    constructor (bot, browser, config) {
        this.bot = bot;
        this.browser = browser;
        this.config = config;
        this.fs = require("fs");
        this.LOG_NAME = "common.js";
        this.LOG = require("./logger/types");
        this.MAP_COLORS = require("./logger/types").MAP_COLORS;
        this.Log = require("./logger/log");
        this.log = new this.Log(this.LOG_NAME, this.config);
    }

    compareVersion (version) {
        const currentVersion = require("../version").version;
        const compareVersions = require("compare-versions");
        return compareVersions(currentVersion, version);
    }

    checkUpdates (version) {
        //TO DO!
        return version;
    }

    randomInterval (min, max) {
        return (Math.floor(Math.random() * (max - min + 1)) + min) * 1000;
    }
    
    sleep (sec) {
        return new Promise(resolve => setTimeout(resolve, sec));
    }

    async createFileToWrite (name, path, content) {
        let self = this;
        return new Promise(function (resolveWrite, rejectWrite) {
            self.fs.writeFile(path, content, function (err) {
                if (err) {
                    self.log.error(`${name} don't created: ${err}`);
                    rejectWrite(err);
                } else {
                    self.log.info(`${name} created`);
                }
                resolveWrite(true);
            });
        });
    }

    async alreadyExist (name, path) {
        let self = this;
        return new Promise(function (resolveExists) {
            self.fs.open(path, "wx", function (exists) {
                if (exists && exists.code === "EEXIST") {
                    self.log.info(`${name} exist`);
                    resolveExists("exist");
                } else {
                    resolveExists("create");
                }
            });
        });
    }

    async createEmpty (name, path, content) {
        if (await this.alreadyExist(name, path) == "create") {
            await this.createFileToWrite(name, path, content);
        }
    }

    async initEmpty () {
        await this.createEmpty("logs/debug.log", this.config.logPath, "");
        await this.createEmpty("logs/errors.log", this.config.loggerPath, "");
    }

    async screenshot (func, name) {
        if (this.config.log.screenshot) {
            try {
                await this.bot.screenshot({
                    path: `${this.config.screenshotPath}_${func}_${name}.jpg`
                });
                this.log.info("Screenshot done!");
            } catch (err) {
                this.log.error(`screenshot: error ${err}`);
            }
        }
    }

    async keepAlive () {
        let pages = null;

        try {
            pages = (await this.browser.pages()).map(t => t.url());
        } catch (err) {
            this.log.info("Bye bye! Shutdown... wait ~30sec for the bot stopping...");
            return false;
        }

        if (pages.length == 2) {
            return true;
        } else {
            this.log.info("Bye bye! Shutdown... wait ~30sec for the bot stopping...");
        }

        return false;
    }

    isDebug () {
        return this.config.debug === true;
    }

    fixConfig (config) {
        if (typeof config.chromeHeadless === "undefined" || config.chromeHeadless === "" ) {
            config.chromeHeadless = false;
            this.log.error("config.chromeHeadless use the default value");
        }
        if (typeof config.chromeOptions === "undefined" || config.chromeOptions === "" ) {
            config.chromeOptions = ["--disable-gpu", "--no-sandbox", "--window-size=1920x1080"];
            this.log.error("config.chromeOptions use the default value");
        }
        if (typeof config.executablePath === "undefined" || config.executablePath === "" ) {
            config.executablePath = "";
            this.log.error("config.executablePath use the default value");
        }
        return config
    }
}

module.exports = (bot, browser, config) => {
    return new utils(bot, browser, config);
};