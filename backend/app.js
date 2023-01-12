const express = require("express");

const dotenv = require("dotenv");

const helmet = require("helmet");

const userRoutes = require("./routes/user");

const sauceRoutes = require("./routes/sauce");

const mongoose = require("mongoose");

const path = require("path");

const app = express();

// const rateLimit = require("express-rate-limit");

dotenv.config();

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Connextion à MongoDB
mongoose
  .connect(process.env.MANGODB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((e) => console.log("Connexion à MongoDB échouée", e));

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 3,
//   message: "tentatives de connextion dépassées, veuillez réessayer plus tard !",
// });

// // Apply the rate limiting middleware to all requests
// app.use("/api/auth", limiter);

// Accès au corps de la requête
app.use(express.json());

app.use(express.urlencoded());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
console.log(path.join(__dirname, "images"));

module.exports = app;
