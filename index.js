const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const productsRouter = require("./routes/Products");
const categoryRouter = require("./routes/Category");
const brandRouter = require("./routes/Brand");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const path = require("path");

const server = express();

const { connectDB } = require("./dbConfig/db");

server.use(express.static(path.resolve(__dirname, "build")));
server.use(morgan("combined"));
dotenv.config();
connectDB();
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());

////////////////////        ROUTES      //////////////////////
server.use("/products", productsRouter);
server.use("/categories", categoryRouter);
server.use("/brands", brandRouter);
server.use("/users", userRouter);
server.use("/auth", authRouter);
server.use("/cart", cartRouter);
server.use("/orders", orderRouter);

const port = process.env.PORT || 8080;

///////////////////         SERVER      /////////////////////
server.listen(port, () => {
  console.log("server working");
});
