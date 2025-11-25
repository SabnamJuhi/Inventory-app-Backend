const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("inventory_db", "root", "Juhi@1234", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

module.exports = sequelize;
