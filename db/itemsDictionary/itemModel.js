/* supervisor --no-restart-on error itemModel.js */

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

const mongoose = require("mongoose");
const { Schema } = mongoose;
const unitsList = ["м", "м2", "м3", "шт", "л", "кг"];
const ItemSchema = new Schema({
  name: {
    // назва матеріалу, всі букви в нижньому регістрі, щоб не було проблем з пошуком
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
  },
  techUnits: {
    // технічні одиниці, наприклад для "кутн 63х63" це "м"
    type: String,
    required: true,
    trim: true,
    enum: unitsList,
  },
  accUnits: {
    // бухгалтерські одиниці, наприклад для "кутн 63х63" це "кг"
    type: String,
    required: true,
    trim: true,
    enum: unitsList,
  },
  techToAcc: {
    // коеф. перерахунку техн.од → бухг.од., наприклад для "кутн 63х63" це 1 м = 2,5 кг
    type: Number,
    required: true,
    default: null,
  },
  weight: {
    // вага технічної одиниці в "кг", наприклад для "кутн 63х63" → 2,5 кг/м
    type: Number,
    required: true,
    default: null,
  },
  quantity: {
    instock: {
      // кількість на складі в техн.одиницях
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reserved: {
      // кількість зарезервовано в техн.одиницях
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reservList: {
      // список id об'єктів що зарезервували матеріал
      type: Array,
      default: [],
    },
    minRest: {
      // мінімальна кількість на складі в техн.одиницях
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },

  price: {
    // вартість за одиницю в бухгалтерських одиницях
    value: { type: Number, default: 0, min: 0 }, // value
    lastUpdated: {
      // дата останнього оновлення ціни
      type: Date,
      default: Date.now(),
    }, //  lastUpdated
    currency: {
      // валюта
      type: String,
      default: "USD",
    }, //currency
    story: {
      // історія змін ціни
      type: String,
      default: "",
    },
  }, //price

  note: {
    // опис markdown or html
    type: String,
    default: "",
  },

  storyPlace: {
    // місце зберігання
    type: String,
    default: "",
  },

  properties: {}, // додаткові властивості
}); //ItemShema

ItemSchema.statics.getByName = function (name) {
  return this.find({ name: new RegExp(name, "i") })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, _id: 1 });
};

ItemSchema.statics.getById = function (_id) {
  // ----------- настройки логгера локальные --------------
  let logN = logName + "byId('" + _id + "'):";
  let trace = 0;
  trace = gTrace != 0 ? gTrace : trace;
  trace ? log("i", logN, " Started ") : null;
  return this.findById(_id).exec();
};

// let reg = new RegExp("кутн", "ig");
// let str = "Кутн пкутн мама сало премкутн кутник швеллер";
// console.log("-------->", reg);
// let arr = str.match(reg);
// console.dir(arr);
let model = mongoose.model("ItemName", ItemSchema);
module.exports = model;

if (!module.parent) {
  let connStr = require("../../config/db_config").testBaseConnectionString;
  (async () => {
    let trace = 1;
    function l(name, item) {
      if (trace) {
        log("i", "------ ", name, "= ------");
        console.log(item); //, { depth: 2 }
      }
    }
    let items;
    await mongoose.connect(connStr);
    items = await model.getByName("кутн");
    l("items[0]", items[0]);
    items = await model.getById("624d3c520588aede29c8fbba");
    l("byId", items);
  })();
}
