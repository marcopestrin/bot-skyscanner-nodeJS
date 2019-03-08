const argv = require("yargs").argv;
const fs = require("fs");
const Bot = require("./skyscannerbot/lib");

const configFile = (argv.config ? argv.config : "./config.js");

const args = process.argv.slice(2)

if (fs.existsSync(configFile)) {
    let bot = new Bot(require(configFile));
    bot.start(args);
} else {
    throw new Error("Config file not found");
}
