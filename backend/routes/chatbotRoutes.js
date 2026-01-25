import express from "express";
import Product from "../models/productModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    // Greeting Check
    const greetings = ["hi", "hello", "hey", "hii"];
    if (greetings.includes(message.toLowerCase().trim())) {
      return res.json({
        success: true,
        reply: "Hi 👋 Welcome to Forever Store! How can I help you today?",
      });
    }

    // Load ALL Products (Full Catalog)
    const products = await Product.find();

    // Send Detailed Catalog
    const productList = products
      .map(
        (p) =>
          `• ${p.name} | Category: ${p.category} | Price: ₹${p.price}`
      )
      .join("\n");

    // Prompt
   const prompt = `
You are Forever Store AI Shopping Assistant.

Store Policies:
- Delivery fee: ₹50
- COD Available
- Return within 7 days

Full Product Catalog:
${productList}

User Question: ${message}

Instructions:
- Reply in only 2–4 short lines
- Suggest max 2 relevant products
- NEVER say unavailable if product exists

Formatting Rules:
- DO NOT use markdown
- DO NOT use ** or bold formatting
- Only reply in clean plain text
- Use bullet points like:
  - Women Jacket (₹699)
`;


    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 160,
        temperature: 0.4,
      },
    });

    const reply = result.response.text();

    res.json({ success: true, reply });
  } catch (error) {
    console.log("❌ Gemini Chatbot Error:", error.message);

    res.json({
      success: true,
      reply: "⚠️ AI is unavailable right now. Please try again later.",
    });
  }
});

export default router;
