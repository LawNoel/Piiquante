// Import de JOI pour de la data validation
const Joi = require("joi");

// Création des données de validation de l'utilisateur
const authSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string()
    .min(10)
    .max(30)
    .required()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})")
    ),
});

exports.validAuth = async (req, res, next) => {
  try {
    await authSchema.validateAsync(req.body);
    next();
  } catch (err) {
    res.status(400).json(err);
  }
};
