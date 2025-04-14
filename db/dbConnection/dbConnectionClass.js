const mongoose = require("mongoose");
const log = require("../../tools/log.js");

class dbConnectionClass {
  constructor(connectionString, props = {}) {
    this.ln = "DBConnectionClass::";

    let trace = 1,
      ln = this.ln + `constructor::`;
    if (trace) {
      log("i", ln, `props=`);
      console.dir(props, { depth: 2 });
    }
    if (!connectionString || connectionString == "") {
      throw new Error("Connection string is required");
    }

    this.db = mongoose.createConnection(connectionString, this.props);

    this.db.on("error", (err) => {
      log("e", this.ln + "Connection error: " + err);
    });
    this.db.on("disconnected", () => {
      log("e", this.ln + "Database disconnected");
      this.isConnected = false;
    });
    this.db.on("connected", () => {
      log("w", this.ln + "Database connected");
      this.isConnected = true;
    });
    this.db.on("reconnected", () => {
      log("w", this.ln + "Database reconnected");
      this.isConnected = true;
    });
    this.isConnected = false;
    if (trace) {
      log("i", ln, `this=`);
      console.dir(this);
    }
  }

  disconnect() {
    // Logic to close the database connection
    this.db.close();
    console.log("Database disconnected");
  }
}

module.exports = dbConnectionClass;
