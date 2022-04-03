// ------------ логгер  --------------------
const log = require("../../tools/log.js"); // логер
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
let gTrace = 0; //=1 глобальная трассировка (трассируется все)
// ----------- настройки логгера локальные --------------
// let logN=logName+"описание:";
// let trace=0;   trace = (gTrace!=0) ? gTrace : trace;
// trace ? log("i",logN,"Started") : null;
// trace ? log("i",logN,"--- ---") : null;
// trace ? console.dir() : null;

// ------- file --------
const fs = require("fs");
const { open } = require("fs/promises");
const csv = require("csv-parser");
let inputFileName = "./import.csv";
let errLogFile = "./import_err.csv";
//let separator = "\t";

// -- db -----
let connStr = require("../../config/db_Config").connectionString;
const Item = require("./itemShema.js");
const mongoose = require("mongoose");
let conn, errLogFH;

(async () => {
  let logN = logName + "main:";
  let trace = 1;
  trace ? log("i", logN, "Started") : null;

  try {
    errLogFH = await open(errLogFile, "w");
    errLogFH.write("Start : " + new Date().toISOString() + "\n");
    trace ? log("i", logN, "errLogFH=", errLogFH) : null;
  } catch (error) {
    log("err", "err=", error.message);
  }

  try {
    trace ? log("i", logN, "connStr", connStr) : null;
    conn = await mongoose.connect(connStr);
    console.log("Connection established");
    //errLogFH.write("Connection established \n");
  } catch (error) {
    log("err", "Connection not established");
    console.dir(error);
    handleError(error);
  }

  fs.createReadStream(inputFileName)
    .pipe(
      csv({
        separator: "\t",
        mapValues: ({ header, index, value }) => value.trim(),
        mapHeaders: ({ header, index }) => header.trim(),
      })
    )
    .on("data", async function (data) {
      data.name;
      data.techToAcc = parseFloat(data.techToAcc.replace(",", "."));
      data.weightTech = parseFloat(data.weightTech.replace(",", "."));
      //errLogFH.write(JSON.stringify(data) + "\n");
      trace ? log("i", "file=", data) : null;
      let item = new Item(data);
      try {
        await item.save();
      } catch (error) {
        let errMsg = "data=" + JSON.stringify(data) + "\t" + error.message;
        log("e", errMsg);
        //console.dir(error);
        errLogFH.write(errMsg + "\n");
      }
    })
    .on("end", () => {
      log("w", "end event trigered");
      //errLogFH.close();
    });
  //
})();
