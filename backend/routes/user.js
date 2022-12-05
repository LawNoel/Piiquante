const express = require("express");

const router = express.Router();

const userCtrl = require("../controllers/user");

const userValidator = require("../middleware/user-validator");

router.post("/signup", userValidator.validAuth, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
