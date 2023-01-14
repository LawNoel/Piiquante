// Import de mongoose
const mongoose = require("mongoose");

// Import de mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Utilisation de la constante uniqueValidator sur userSchema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
