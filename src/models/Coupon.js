const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const Coupon = sequelize.define("Coupon", {
  code: { type: DataTypes.STRING, unique: true },
  discount_percent: { type: DataTypes.FLOAT, defaultValue: 0 }
}, {
  tableName: "coupons",
  timestamps: false
});

module.exports = Coupon;
