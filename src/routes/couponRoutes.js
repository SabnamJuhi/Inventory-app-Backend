const express = require("express");
const {createCoupon, getCoupon, getAllCoupons} = require('../controllers/couponController')
const router = express.Router();


router.post('/create', createCoupon);
router.get('/', getAllCoupons);
router.get('/:code', getCoupon);


module.exports = router;