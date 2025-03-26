const mongoose = require("mongoose");

let devMode = process.env.NODE_ENV !== "production";
let ln = "db_Config::";
const config = {
  materials: {},
};

if (devMode) {
  config.materials.connectionString =
    "mongodb+srv://api:_Bortek1994_@materials.b0rnw.mongodb.net/testBase?appName=Materials";
} else {
  config.materials.connectionString =
    "mongodb+srv://api:_Bortek1994_@materials.b0rnw.mongodb.net/Materials?appName=Materials";
}
config.materials.maxGetItemsPerTime = 15;
config.materials.connect = async function () {
  let conn;
  try {
    conn = await mongoose.connect(config.materials.connectionString);
    console.log(
      ln +
        "Connection established::connStr=" +
        config.materials.connectionString
    );
  } catch (error) {
    console.error(ln + "Connection not established");
    console.dir(error);
    throw error;
  }
  return conn;
};

module.exports = config;
