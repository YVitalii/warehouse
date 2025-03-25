const config = {
  connectionString:
    "mongodb://express:Danya@localhost:27017/warehouse?authSource=WorkersDB&readPreference=primary&appname=Express&ssl=false",
  testBaseConnectionString:
    "mongodb+srv://api:_Bortek1994_@materials.b0rnw.mongodb.net/?appName=Materials",
  maxGetItemsPerTime: 10,
};
module.exports = config;
