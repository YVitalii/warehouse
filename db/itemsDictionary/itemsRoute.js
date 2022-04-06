const mongoose = require("mongoose");
const Item = require("./itemModel.js");
const maxItemsQty = require("../../config/db_config.js").maxGetItemsPerTime;

// ------------ логгер  --------------------
const log = require("../../tools/log.js"); // логер
const res = require("express/lib/response");
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
let gTrace = 0; //=1 глобальная трассировка (трассируется все)
// ----------- настройки логгера локальные --------------
// let logN=logName+"описание:";
// let trace=0;   trace = (gTrace!=0) ? gTrace : trace;
// trace ? log("i",logN,"Started") : null;
// trace ? log("i",logN,"--- ---") : null;
// trace ? console.dir() : null;

/**
 * GET items/getByName маршрут для поиска материалов по частичному совпадению имени
 * возвращает обьект {err,data}, где err - обьект ошибки, а data = Array []
 * */
async function getByName(req, res) {
  // ----------- настройки логгера локальные --------------
  let logN = logName + "getByName('" + JSON.stringify(req.query) + "'):";
  let trace = 0;
  trace = gTrace != 0 ? gTrace : trace;
  trace ? log("i", logN, "Started") : null;
  let selectFields = {
    _id: 1,
    name: 1,
    techUnits: 1,
    accUnits: 1,
    techToAcc: 1,
    quantity: 1,
    price: 1,
    weightTech: 1,
  };
  let name = req.query.name;
  trace ? log("i", "GET: /items/getByName: name=", name) : null;
  if (!name) {
    res.status(400).json({
      err: {
        en: "Not found parameter: name ",
        ru: "Не найден параметр name",
        ua: "Не знайдено параметр name",
      },
      data: null,
    });
    return;
  }

  let query = await Item.find({ name: new RegExp(name, "i") })
    .select(selectFields)
    .limit(maxItemsQty)
    .sort({ name: 1 })
    .exec();
  log("i", "Sended data[0]=", query[0]);
  trace ? log("i", "----> query= ") : null;
  trace ? console.log(query) : null;
  res.json({ err: null, data: query });
} //function getByName

module.exports = { getByName };
