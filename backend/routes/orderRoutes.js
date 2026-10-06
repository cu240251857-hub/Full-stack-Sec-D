const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

const statusOrder = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

router.post("/", async (req, res) => {
  try {
    const { customerName, phone, address, items } = req.body;

    if (!customerName || !phone || !address) {
      return res.status(400).json({
        message: "Customer name, phone and address are required"
      });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits"
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item"
      });
    }

    for (const item of items) {
      if (!item.itemId || !Number.isInteger(Number(item.qty)) || Number(item.qty) < 1) {
        return res.status(400).json({
          message: "Every item quantity must be 1 or more"
        });
      }
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const requestedItem of items) {
      const menuItem = await MenuItem.findById(requestedItem.itemId);

      if (!menuItem) {
        return res.status(400).json({
          message: `Menu item ${requestedItem.itemId} does not exist`
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          message: `${menuItem.name} is currently unavailable`
        });
      }

      const qty = Number(requestedItem.qty);
      totalAmount += menuItem.price * qty;

      orderItems.push({
        itemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        qty
      });
    }

    totalAmount = Number(totalAmount.toFixed(2));

    const order = new Order({
      customerName,
      phone,
      address,
      items: orderItems,
      totalAmount,
      status: "Placed"
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Failed to place order",
      error: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "Placed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "Cancelled") {
      if (order.status !== "Placed") {
        return res.status(400).json({
          message: "Order can only be cancelled while status is Placed"
        });
      }

      order.status = "Cancelled";
      await order.save();
      return res.status(200).json(order);
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Cancelled orders cannot be updated" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ message: "Delivered orders cannot be updated" });
    }

    const currentIndex = statusOrder.indexOf(order.status);
    const newIndex = statusOrder.indexOf(status);

    if (newIndex !== currentIndex + 1) {
      return res.status(400).json({
        message: "Order status can only move forward one step at a time"
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(500).json({
      message: "Failed to update order status",
      error: error.message
    });
  }
});

module.exports = router;
