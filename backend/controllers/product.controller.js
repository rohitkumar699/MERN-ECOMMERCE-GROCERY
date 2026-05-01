import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const addProduct = async (req, res) => {
  try {
    const imageFilenames = req.files?.length ? req.files.map((f) => f.filename) : [];
    const categoryId = req.body.category && mongoose.Types.ObjectId.isValid(req.body.category) ? req.body.category : undefined;
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      offerPrice: req.body.offerPrice,
      smallDesc: req.body.smallDesc,
      longDesc: req.body.longDesc,
      weight: req.body.weight,
      category: categoryId,
      images: imageFilenames,
    });
    await product.save();
    res.status(201).json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to add product", error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    if (product.images?.length > 0) {
      product.images.forEach((image) => {
        fs.unlink(path.join("uploads", image), (err) => { if (err) console.error(err.message); });
      });
    }
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete product", error: error.message });
  }
};
