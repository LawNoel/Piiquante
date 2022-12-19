const express = require("express");

const router = express.Router();

const sauceCtrl = require("../controllers/sauce");

const auth = require("../middleware/auth");

const multer = require("../middleware/multer-config");

const sauceValidator = require("../middleware/sauce-validator");

router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauce);
router.post(
  "/",
  auth,
  multer,
  sauceValidator.validSauce,
  sauceCtrl.createSauce
);
router.put(
  "/:id",
  auth,
  multer,
  sauceValidator.validUpdateSauce,
  sauceCtrl.modifySauce
);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
