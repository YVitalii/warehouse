/**
REM Встановлюємо
$env:NODE_ENV = 'development'
REM Перевіряємо
echo $env:NODE_ENV
 */

const config = {
  devMode: process.env.NODE_ENV !== "production",
};
config.db = require("./db_config.js");

module.exports = config;

if (!module.parent) {
  console.dir(config);
}
