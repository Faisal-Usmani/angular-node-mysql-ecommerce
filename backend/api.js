require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const categoriesRouter = require("./routers/categoriesRoutes");
const productsRouter = require("./routers/productsRoutes");
const usersRouter = require("./routers/usersRoutes");
const ordersRoute = require("./routers/ordersRoute");
const checkout = require("./routers/checkout");

app.use(cors());
app.use(express.json());

// Existing routes
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/orders", ordersRoute);

// Razorpay checkout route
app.use("/api/v1/checkout", checkout);

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
