const express = require("express");

const sauceCtrl = require("../controllers/sauce");

const auth = require("../middleware/auth");

const multer = require("../middleware/multer-config");

const sauceValidator = require("../middleware/sauce-validator");

const router = express.Router();

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
