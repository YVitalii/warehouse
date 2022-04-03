const mongoose = require("mongoose");
const { Schema } = mongoose;
const unitsList = ["м", "м2", "м3", "шт", "л", "кг"];
const ItemSchema = new Schema({
  name: {
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
  },
  weightTech: {
    // вага технічної одиниці в "кг", наприклад для "кутн 63х63" → 2,5 кг/м
    type: Number,
    required: true,
  },
}); //ItemShema

ItemSchema.query.byName = function (name) {
  return this.where({ name: new RegExp(name, "i") });
};
ItemSchema.query.byId = function (_id) {
  return this.where({ _id });
};
ItemSchema.method.addItem = function (item) {
  return this.save(item);
};

// let reg = new RegExp("кутн", "ig");
// let str = "Кутн пкутн мама сало премкутн кутник швеллер";
// console.log("-------->", reg);
// let arr = str.match(reg);
// console.dir(arr);
module.exports = mongoose.model("ItemName", ItemSchema);
