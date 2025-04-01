const mongoose = require("mongoose");
const log = require("../../tools/log.js");

class DBConnectionClass {
  constructor(props = {}) {
    this.ln = "DBConnectionClass::";

    let trace = 0,
      ln = this.ln + `constructor::`;
    if (trace) {
      log("i", ln, `props=`);
      console.dir(props);
    }
    if (props.connectionString == "") {
      throw new Error("Connection string is required");
    }
    this.props = props;
    this.db = mongoose.connection;
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

  async connect() {
    let trace = 1,
      ln = this.ln + `connect()::`;
    if (this.isConnected) {
      log(ln + "Already connected to the database");
      return true;
    }
    try {
      this.db = await mongoose.connect(
        this.props.connectionStrings,
        this.props
      );
    } catch (error) {
      log("e", ln + "Connection not established");
      log("e", error);
      throw error;
    }
    this.isConnected = true;
  }

  disconnect() {
    // Logic to close the database connection
    this.db.close();
    console.log("Database disconnected");
  }
}

module.exports = DBConnectionClass;
