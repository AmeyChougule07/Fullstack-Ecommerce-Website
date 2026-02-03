import express from "express";
import Product from "../models/productModel.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { occasion } = req.body;

  let top, bottom, outer;

  if (occasion === "party") {
    top = await Product.findOne({ category: "Topwear" });
    bottom = await Product.findOne({ category: "Bottomwear" });
    outer = await Product.findOne({ category: "Winterwear" });
  }

  res.json({
    success: true,
    outfit: {
      top,
      bottom,
      outer,
    },
  });
});

export default router;
