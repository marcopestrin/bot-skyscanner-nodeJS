const argv = require("yargs").argv;
const fs = require("fs");
const Bot = require("./skyscannerbot/lib");

const configFile = (argv.config ? argv.config : "./config.js");

if (fs.existsSync(configFile)) {
    let bot = new Bot(require(configFile));
    bot.start();
} else {
    throw new Error("Config file not found");
}
