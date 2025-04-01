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
const unitsList = ["м", "м2", "м3", "шт", "л", "кг", "км"];

const currenciesList = ["UAH", "USD", "EUR"];
const PriceShema = new Schema(
  {
    // вартість за одиницю в бухгалтерських одиницях
    value: { type: Number, default: 0 }, // value
    lastUpdate: {
      // дата останнього оновлення ціни
      type: Date,
      default: Date.now(),
    }, //  lastUpdated
    currency: {
      // валюта
      type: String,
      default: "UAH",
      enum: currenciesList,
    }, //currency
  },
  { _id: false }
); //PriceShema
// --- схема додаткової властивості матеріалу ------
// Наприклад для симістора ТС-122-16:  ключ Map:"I", name:"Струм", value: 160, units: "А", note:"Максимальний робочий струм"
// Використовується як параметр для автоматичного розрахунку в сторонніх застосунках
// Датчик тиску DH-PT300; 6bar;24VDC;4-20mA;G1/2”з,Darhor
const PropertyShema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
    },
    units: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { _id: false }
); //PropertyShema

const MaterialSchema = new Schema({
  name: {
    // назва матеріалу,
    type: String,
    minlength: 5,
    maxlength: 60,
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

  price: {
    // вартість бухгалтерської одиниці
    type: PriceShema,
    required: true,
    default: { value: 0, currency: "UAH" },
    // set: function (v) { // на 2025-03-26 не працює
    //   let trace = 1,
    //     ln = "MaterialShema::" + `::${this._doc.name}::`;
    //   if (trace) {
    //     log("i", ln, `this=`);
    //     console.dir(this);
    //   }
    //   if (this._doc.price && this._doc.price.lastUpdate) {
    //     this.price.lastUpdate = new Date();
    //   }
    //   return v;
    // },
  }, //price

  note: {
    // короткий опис markdown or html
    type: String,
    default: "",
  },

  resources: {
    // всі картинки, файли, документи, які стосуються матеріалу зберігаються в окремих файлах
    // а в базі даних, зберігається масив з посиланнями на ці файли
    // всі ресурси мають номер від 0 - 256 = номеру в масиві resources
    type: [String],
    default: [],
  },

  properties: {
    // додаткові властивості
    type: Map,
    of: PropertyShema,
    default: {},
  }, // додаткові властивості
}); //MaterialSchema

MaterialSchema.statics.getByName = function (name) {
  return this.find({ name: new RegExp(name, "i") })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, _id: 1 });
};

MaterialSchema.statics.getById = function (_id) {
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
let model = mongoose.model("Materials", MaterialSchema);
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
