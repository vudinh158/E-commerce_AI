import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import banners from "./routes/banners.js";
import products from "./routes/products.js";
import auth from "./routes/auth.js";
import cart from "./routes/cart.js";
import orders from "./routes/orders.js";
import me from "./routes/me.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/banners", banners);
app.use("/api/products", products);
app.use("/api/auth", auth);
app.use("/api/cart", cart);
app.use("/api/orders", orders);
app.use("/api/me", me);

// health
app.get("/api/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("API on http://localhost:" + port));
