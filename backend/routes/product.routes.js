import express from "express";
import { isAdmin } from "../middlewares/isAdmin.js";
import { upload } from "../middlewares/multer.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
} from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.post("/add", isAdmin, upload.array("images"), addProduct);
productRouter.get("/all", getAllProducts);
productRouter.delete("/delete/:id", isAdmin, deleteProduct);

export default productRouter;