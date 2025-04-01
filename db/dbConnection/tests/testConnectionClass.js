const chai = require("chai");
const config = require("../../../config/db_config.js");
const expect = chai.expect;
const sinon = require("sinon");
const mongoose = require("mongoose");
const DbConnectionClass = require("../dbConnectionClass"); // Adjust the path if needed

describe("DbConnectionClass", function () {
  let dbConnection;

  beforeEach(function () {
    dbConnection = new DbConnectionClass(config.materials);
  });

  afterEach(function () {
    sinon.restore();
  });

  it("should initialize with default properties", function () {
    expect(dbConnection).to.have.property("props").that.is.a("object");
    expect(dbConnection).to.have.property("isConnected").that.equal(false);
  });

  it("should connect to the database successfully", async function () {
    const connectStub = sinon.stub(mongoose, "connect").resolves("Connected");
    const result = await dbConnection.connect();
    console.log("result=", result);
    expect(connectStub.calledOnce).to.be.true;
    expect(result).to.equal("Connected");
  });

  it("should handle connection errors", async function () {
    const connectStub = sinon
      .stub(mongoose, "connect")
      .rejects(new Error("Connection failed"));

    try {
      await dbConnection.connect();
    } catch (error) {
      expect(connectStub.calledOnce).to.be.true;
      expect(error.message).to.equal("Connection failed");
    }
  });

  it("should disconnect from the database successfully", async function () {
    const disconnectStub = sinon
      .stub(mongoose, "disconnect")
      .resolves("Disconnected");

    const result = await dbConnection.disconnect();
    expect(disconnectStub.calledOnce).to.be.true;
    expect(result).to.equal("Disconnected");
  });

  it("should handle disconnection errors", async function () {
    const disconnectStub = sinon
      .stub(mongoose, "disconnect")
      .rejects(new Error("Disconnection failed"));

    try {
      await dbConnection.disconnect();
    } catch (error) {
      expect(disconnectStub.calledOnce).to.be.true;
      expect(error.message).to.equal("Disconnection failed");
    }
  });
});
