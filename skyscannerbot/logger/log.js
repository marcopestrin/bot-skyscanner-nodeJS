const TYPES_LOG = require("./types");
const fs = require("fs");

module.exports = class log {
    constructor (func, config) {
        this.func = func;
        this.config = config;
        this.channels = [];
    }

    setChannel (interfaceChannel) {
        this.channels.push(interfaceChannel);
    }

    channelsLog (type, message) {
        this.channels.forEach((channel) => {
            channel.log(type, this.func, message);
        });
    }

    appendFile (type, message) {
        const tzOffset = (new Date()).getTimezoneOffset() * 60000;
        const localIsoTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -5).replace("T", " ");
        const log = `${localIsoTime} [${type}] ${message}\n`;

        fs.appendFile(this.config.logPath, log, function (err) {
            if (err) {
                console.log(err);
            }
        });
        if (type === "ERROR") {
            fs.appendFile(this.config.loggerPath, log, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    }

    info (message) {
        this.channelsLog(TYPES_LOG.INFO, message);
        this.appendFile("INFO", message);
    }

    warning (message) {
        this.channelsLog(TYPES_LOG.WARNING, message);
        this.appendFile("WARNING", message);
    }

    error (message) {
        this.channelsLog(TYPES_LOG.ERROR, message);
        this.appendFile("ERROR", message);
    }

    debug (message) {
        this.channelsLog(TYPES_LOG.DEBUG, message);
        this.appendFile("DEBUG", message);
    }
};
