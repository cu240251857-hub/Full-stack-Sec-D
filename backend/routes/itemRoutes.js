const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, price, category, isAvailable } = req.body;

    if (!name || price === undefined || price === null || !category) {
      return res.status(400).json({ message: "Name, price and category are required" });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    const item = new MenuItem({
      name,
      price: Number(price),
      category,
      isAvailable: isAvailable === undefined ? true : Boolean(isAvailable)
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to create menu item", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, price, category, isAvailable } = req.body;

    if (!name || price === undefined || price === null || !category) {
      return res.status(400).json({ message: "Name, price and category are required" });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price: Number(price),
        category,
        isAvailable: isAvailable === undefined ? true : Boolean(isAvailable)
      },
      { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.status(200).json(item);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(500).json({ message: "Failed to update menu item", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) return res.status(404).json({ message: "Menu item not found" });

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(500).json({ message: "Failed to delete menu item", error: error.message });
  }
});

module.exports = router;
