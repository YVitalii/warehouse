const config = {
  connectionString:
    "mongodb://express:Danya@localhost:27017/warehouse?authSource=WorkersDB&readPreference=primary&appname=Express&ssl=false",
  testBaseConnectionString:
    "mongodb://express:Danya@localhost:27017/test_warehouse?authSource=WorkersDB&readPreference=primary&appname=Express&ssl=false",
  maxGetItemsPerTime: 10,
};
module.exports = config;
