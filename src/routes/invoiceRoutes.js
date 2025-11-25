const express = require("express");
const { createInvoice, getInvoice, updateInvoice, deleteInvoice, deleteItem } = require("../controllers/invoiceController");

const router = express.Router();

router.post("/", createInvoice);
router.get("/:id", getInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);
router.delete("/item/:id", deleteItem);

module.exports = router;