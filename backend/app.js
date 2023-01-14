// Imports des packages

// Création de l'application web
const express = require("express");

// Protection des donées de connexion de MongoDB et du TOKEN d'authentification
const dotenv = require("dotenv");

// Protection contre les attaques XSS
const helmet = require("helmet");

// Imports des routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Connexion à la base de donnée
const mongoose = require("mongoose");

const path = require("path");

const app = express();

// const rateLimit = require("express-rate-limit");

dotenv.config();

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

// Analyze le corps de la requête
app.use(express.json());

app.use(express.urlencoded());

app.use((req, res, next) => {
  // Ajout des conditions d'acces à l'API
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Ajout des en-tête utilisable sur l'objet requête
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // Ajout des verbes de requête
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Ajouts des routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
