const express = require("express");
const cors = require("cors");
const sequelize = require("./db");

const Coupon = require("./models/Coupon");

const invoiceRoutes = require("./routes/invoiceRoutes");
const couponRoutes = require("./routes/couponRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// mount routes
app.use("/api/invoices", invoiceRoutes);
app.use("/api/coupons", couponRoutes);

const PORT = process.env.PORT || 3001;

// sync models and start
(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    await sequelize.sync({ force: false })
    console.log("Models synced");

    await Coupon.findOrCreate({ where: { code: "ABC" }, defaults: { discount_percent: 10 }});

    app.listen(PORT, () => console.log("Server running on 3001"));
  } catch (err) {
    console.error("DB connect failed:", err);
  }
})();
