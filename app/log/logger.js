// get the Console class
const { Console } = require("console");
// get fs module for creating write streams
const fs = require("fs");

// make a new logger
const myLogger = new Console({
  stdout: fs.createWriteStream("log.txt"),
});

module.exports = myLogger;