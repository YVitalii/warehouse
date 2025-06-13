/*
nodemon --exec "mocha -c" -w "./" -w "./test"


*/

// ------------ логгер  --------------------
const log = require("../../../tools/log.js"); // логер
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
let gTrace = 0; //=1 глобальная трассировка (трассируется все)
// ----------- настройки логгера локальные --------------
// let logN=logName+"описание:";
// let trace=0;   trace = (gTrace!=0) ? gTrace : trace;
// trace ? log("i",logN,"Started") : null;
// trace ? log("i",logN,"--- ---") : null;
// trace ? console.dir() : null;

const mongoose = require("mongoose");
//console.log("------- mongoose.models ----------");
//console.dir(mongoose.models, { depth: 1 });
const Item = mongoose.models.ItemName
  ? mongoose.models.ItemName
  : require("../itemModel.js"); //mongoose.models ? mongoose.models :

let connStr = require("../../../config/db_config.js").testBaseConnectionString;
console.log("\n\n-------------------------------------------------------");
console.log(
  `-----     Start tests at:  ${new Date().toLocaleString()}    ----`
);

before(async () => {
  //console.log("------ Before  -----");
  try {
    await mongoose.connect(connStr);
    log(
      "i",
      "Connection to base: '" + mongoose.connections[0].name + "' established"
    );
    //console.dir(mongoose.connections, { depth: 2 });
  } catch (error) {
    console.err(error.message);
  }
});

describe("Пошук в базі по назві товару", () => {
  it("", async function () {
    let items = await Item.findByName("кутн");
    console.log("--- items = ");
    console.log(items);
  });

  // it("Пошук в базі", async function (done) {
  //   // let cursor = await Item.find.byName("кутн ").exec();
  //   // console.dir(cursor);
  //   //done();
  // });
}); //describe("Пошук в базі по назві товару"

// (async () => {
//   console.log("test started 12345");
//   try {
//
//
//   } catch (error) {
//     handleError(error);
//   }
//   let mat = new Item({
//     name: "Кутн 63х63х6",
//     techUnits: "м",
//     accUnits: "кг",
//     techToAcc: 2.3,
//     weightTech: 2.3,
//   });
//   console.dir(mat);
//   try {
//     await mat.save();
//   } catch (err) {
//     console.error(err);
//   }
// })();
