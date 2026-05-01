import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  smallDesc: { type: String, required: true },
  longDesc: { type: String, required: true },
  weight: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false },
  images: { type: [String], required: true },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
