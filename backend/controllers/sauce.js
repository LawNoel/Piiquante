const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  console.log(sauceObject.name);
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// ***********************************************************************************

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (sauce.userId != req.auth.userId) {
      res.status(401).json({ message: "Non-autorisé !!" });
    } else {
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Sauce modifié !" }))
        .catch((error) => res.status(401).json({ error }));
    }
  });
};

// ***********************************************************************************************

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (sauce.userId != req.auth.userId) {
      res.status(401).json({ message: "Non-autorisé !!" });
    } else {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    }
  });
};

// ************************************************************************************************

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// ************************************************************************************************

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

// ************************************************************************************************

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //   Vérification si l'utilisateur a déjà son avis sur la sauce*****************

      if (req.body.like === 1) {
        if (sauce.usersLiked.includes(req.auth.userId)) {
          res.status(400).json({ error: "Avis déjà pris en compte" });
          return;
        }
        // Vérification de la présence d'un dislike********************************
        if (sauce.usersDisliked.includes(req.auth.userId)) {
          Sauce.updateOne({
            _id: req.params.id,
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.auth.userId },
          })
            .then((sauce) => {
              res.status(201).json({ message: "Dislike supprimé" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else {
          // L'utilisateur aime la sauce***********************************************
          Sauce.updateOne({
            _id: req.params.id,
            $inc: { likes: 1 },
            $push: { usersLiked: req.auth.userId },
          })
            .then((sauce) => res.status(201).json({ message: "Like sauce" }))
            .catch((error) => res.status(400).json({ error }));
        }
      }

      if (req.body.like === -1) {
        if (sauce.usersDisliked.includes(req.auth.userId)) {
          res.status(400).json({ error: "Avis déjà pris en compte" });
          return;
        }

        // Vérification de la présence d'un like*************************************
        if (sauce.usersLiked.includes(req.auth.userId)) {
          Sauce.updateOne({
            _id: req.params.id,
            $inc: { likes: -1 },
            $pull: { usersLiked: req.auth.userId },
          })
            .then((sauce) => {
              res.status(201).json({ message: "Like supprimé" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else {
          // L'utilisateur n'aime pas la sauce******************************************
          Sauce.updateOne({
            _id: req.params.id,
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.auth.userId },
          })
            .then((sauce) => res.status(201).json({ message: "Dislike sauce" }))
            .catch((error) => res.status(400).json({ error }));
        }
      }

      // Annulation du Like************************************************
      if (req.body.like === 0) {
        if (sauce.usersLiked.includes(req.auth.userId)) {
          Sauce.updateOne({
            _id: req.params.id,
            $inc: { likes: -1 },
            $pull: { usersLiked: req.auth.userId },
          })
            .then((sauce) => {
              res.status(201).json({ message: "Like supprimé" });
            })
            .catch((error) => res.status(400).json({ error }));
        }

        // Annulation du Dsilike *******************************************
        else if (sauce.usersDisliked.includes(req.auth.userId)) {
          Sauce.updateOne({
            _id: req.params.id,
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.auth.userId },
          })
            .then((sauce) => {
              res.status(201).json({ message: "Dislike supprimé" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      }
    })
    .catch((error) => res.status(400).json({ error }));
  // res.status(400).json({ error: "code raté" });
};
