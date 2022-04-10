var express = require("express");
var router = express.Router();
const item = require("../db/itemsDictionary/itemsRoute.js");

// ------------ логгер  --------------------
const log = require("../tools/log.js"); // логер
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
let gTrace = 0; //=1 глобальная трассировка (трассируется все)
// ----------- настройки логгера локальные --------------
// let logN=logName+"описание:";
// let trace=0;   trace = (gTrace!=0) ? gTrace : trace;
// trace ? log("i",logN,"Started") : null;
// trace ? log("i",logN,"--- ---") : null;
// trace ? console.dir() : null;

//
// async function (req, res, next) {
//   console.log("req.query=", req.query);
//   if (!req.query.name) {
//     console.log("===> Empty query");
//     res.status(400).json({ err: "not find parameter 'name'", data: null });
//     return;
//   }
//   let selector = await Item.byName(req.query.name.trim());
//   console.log("selector=");
//   console.dir(selector);
//   res.status(200).send("material was added");
// });
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Items" });
});
router.get("/getByName", function (req, res) {
  log("i", "GET /getByName");
  log("w", "req.query=", req.query);
  item.getByName(req, res);
  //res.send("GET /byName");
});

module.exports = router;
