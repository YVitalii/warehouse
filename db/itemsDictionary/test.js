const mongoose = require("mongoose");
const Item = require("./itemShema.js");
let connStr = require("../../config/db_Config").connectionString;

(async () => {
  console.log("test started 12345");
  try {
    await mongoose.connect(connStr);
  } catch (error) {
    handleError(error);
  }
  let mat = new Item({
    name: "Кутн 63х63х6",
    techUnits: "м",
    accUnits: "кг",
    techToAcc: 2.3,
    weightTech: 2.3,
  });
  console.dir(mat);
  try {
    await mat.save();
  } catch (err) {
    console.error(err);
  }
})();
