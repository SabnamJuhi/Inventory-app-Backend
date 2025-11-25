const express = require("express");
const cors = require("cors");
const sequelize = require("./db");

const Coupon = require("./src/models/Coupon");

const invoiceRoutes = require("./src/routes/invoiceRoutes");
const couponRoutes = require("./src/routes/couponRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// mount routes
app.use("/api/invoices", invoiceRoutes);
app.use("/api/coupons", couponRoutes);

// sync models and start
(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    await sequelize.sync({ alter: true });
    console.log("Models synced");

    await Coupon.findOrCreate({ where: { code: "ABC" }, defaults: { discount_percent: 10 }});

    app.listen(3001, () => console.log("Server running on 3001"));
  } catch (err) {
    console.error("DB connect failed:", err);
  }
})();
