const Invoice = require("../models/Invoice");
const InvoiceItem = require("../models/invoiceItem");
const Coupon = require('../models/Coupon')

// Create invoice with items hghghg
exports.createInvoice = async (req, res) => {
  try {
    let { coupon_code, discount_percent, items } = req.body; // items: [{ item_name, quantity, per_unit_price }]
    // calculate per item total and invoice total
    discount_percent = Number(discount_percent) || 0;
    const computedItems = items.map(i => {
      const qty = Number(i.quantity) || 0;
      const price = Number(i.per_unit_price) || 0;
      return { ...i, quantity: qty, per_unit_price: price, total_price: +(qty * price).toFixed(2) };
    });

    const total = computedItems.reduce((s, it) => s + it.total_price, 0);

    // fetch coupon percent if provided
  
    if (coupon_code) {
      const coupon = await Coupon.findOne({ where: { code: coupon_code }});
      if (coupon) discount_percent = Number(coupon.discount_percent);
    }

    const discountAmount = +(total * (discount_percent / 100));
    const payable = +(total - discountAmount).toFixed(2);

    // Transaction: create invoice then bulk create items
    const invoice = await Invoice.create({
      coupon_code: coupon_code || null,
      discount_percent,
      total_amount: total,
      payable_amount: payable
    });

    const itemsToCreate = computedItems.map(it => ({ ...it, invoiceId: invoice.id }));
    await InvoiceItem.bulkCreate(itemsToCreate);

    const createdInvoice = await Invoice.findByPk(invoice.id, { include: [{ model: InvoiceItem, as: "items" }] });

    res.status(201).json(createdInvoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Create failed", details: err.message });
  }
};

// Get invoice by id (with items)
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, { include: [{ model: InvoiceItem, as: "items" }]});
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update invoice and its items (replace items)
exports.updateInvoice = async (req, res) => {
  try {
    const id = req.params.id;
    let { coupon_code, discount_percent, items } = req.body;
    discount_percent = Number(discount_percent) || 0;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const computedItems = items.map(i => {
      const qty = Number(i.quantity) || 0;
      const price = Number(i.per_unit_price) || 0;
      return { ...i, quantity: qty, per_unit_price: price, total_price: +(qty * price).toFixed(2) };
    });

    const total = computedItems.reduce((s, it) => s + it.total_price, 0);

    if (coupon_code) {
      const coupon = await Coupon.findOne({ where: { code: coupon_code }});
      if (coupon) discount_percent = Number(coupon.discount_percent);
    }

    const payable = +(total - (total * discount_percent / 100)).toFixed(2);

    // Replace items: delete old and insert new (in transaction you could do better)
    await InvoiceItem.destroy({ where: { invoiceId: id }});
    const itemsToCreate = computedItems.map(it => ({ ...it, invoiceId: id }));
    await InvoiceItem.bulkCreate(itemsToCreate);

    invoice.coupon_code = coupon_code || null;
    invoice.discount_percent = discount_percent;
    invoice.total_amount = total;
    invoice.payable_amount = payable;
    await invoice.save();

    const updated = await Invoice.findByPk(id, { include: [{ model: InvoiceItem, as: "items" }] });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete invoice (and items via cascade)
exports.deleteInvoice = async (req, res) => {
  try {
    const id = req.params.id;
    const invoice = await Invoice.findByPk(id);
    if (!invoice) return res.status(404).json({ message: "Not found" });
    await invoice.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete single item (optionally used)
exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await InvoiceItem.destroy({ where: { id }});
    if (!del) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

