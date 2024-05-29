import express from "express";
import cartRoutes from "./routes/cart.routes.js";
import productsRoutes from "./routes/product.routes.js";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/carts", cartRoutes);
app.use("/api/products", productsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});