const mongoose = require("mongoose");
const mongooseErrors = require("mongoose-errors");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(mongooseErrors);
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
