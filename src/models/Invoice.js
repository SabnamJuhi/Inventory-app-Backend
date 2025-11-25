const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const Invoice = sequelize.define("Invoice", {
  coupon_code: { type: DataTypes.STRING, allowNull: true },
  discount_percent: { type: DataTypes.FLOAT, defaultValue: 0 },
  total_amount: { type: DataTypes.FLOAT, defaultValue: 0 }, // sum of rows before discount
  payable_amount: { type: DataTypes.FLOAT, defaultValue: 0 } // after discount
}, {
  tableName: "invoices",
  timestamps: true
});

module.exports = Invoice;
