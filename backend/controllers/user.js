const bcrypt = require("bcrypt");

const User = require("../models/user");

const jwt = require("jsonwebtoken");

// Controleur pour la création d'un compte utilisateur
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash, //Cryptage du mot de passe
      });
      user
        .save() //Pour sauvegarder l'utilisateur dans la base de données
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Contrôleur pour la connexion à un compte utilisateur
exports.login = (req, res, next) => {
  // Pour comparer le nom d'utilisateur, ici l'adresse mail
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        //Si l'utilisateur n'a pas été trouvé
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // Pour comparer le mot de passe
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            //Si ce n'est pas valable
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              //Création du token d'authentification
              { userId: user._id },
              process.env.JWT,
              { expiresIn: "24h" }
            ),
          });
        })
        // Erreur Serveur
        .catch((error) => res.status(500).json({ error }));
    })
    // Erreur serveur
    .catch((error) => res.status(500).json({ error }));
};
