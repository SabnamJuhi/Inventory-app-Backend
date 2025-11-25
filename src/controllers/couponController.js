const express = require("express");
const Coupon = require("../models/Coupon"); 


// Create new coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discount_percent, expiry } = req.body;

    if (!code || !discount_percent) {
      return res.status(400).json({ message: "code and discount are required" });
    }

    const exists = await Coupon.findOne({ where: { code } });
    if (exists) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code,
      discount_percent,
      expiry, // optional
    });

    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

exports.getCoupon = async (req, res) => {
  try {
    const c = await Coupon.findOne({ where: { code: req.params.code } });
    if (!c) return res.status(404).json({ message: "Coupon not found" });
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll();

    res.json({
      count: coupons.length,
      coupons,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
