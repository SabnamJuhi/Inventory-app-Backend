const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Invoice = require("./Invoice");

const InvoiceItem = sequelize.define("InvoiceItem", {
  item_name: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  per_unit_price: { type: DataTypes.FLOAT, defaultValue: 0 },
  total_price: { type: DataTypes.FLOAT, defaultValue: 0 }
}, {
  tableName: "invoice_items",
  timestamps: false
});

Invoice.hasMany(InvoiceItem, { foreignKey: "invoiceId", as: "items", onDelete: "CASCADE" });
InvoiceItem.belongsTo(Invoice, { foreignKey: "invoiceId", as: "invoice" });

module.exports = InvoiceItem;
