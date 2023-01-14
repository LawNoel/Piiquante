// Import de Joi
const Joi = require("joi");

// Création des données de validation pour la sauce
const sauceSchema = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().required(),
  manufacturer: Joi.string().required(),
  description: Joi.string().required(),
  mainPepper: Joi.string().required(),
  heat: Joi.number().required(),
});

exports.validSauce = async (req, res, next) => {
  try {
    await sauceSchema.validateAsync(JSON.parse(req.body.sauce));
    next();
  } catch (err) {
    res.status(400).json(err);
  }
};

const sauceUpdateSchema = Joi.object({
  userId: Joi.string(),
  name: Joi.string(),
  manufacturer: Joi.string(),
  description: Joi.string(),
  mainPepper: Joi.string(),
  heat: Joi.number(),
}).unknown();

exports.validUpdateSauce = async (req, res, next) => {
  try {
    await sauceUpdateSchema.validateAsync(req.body);
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
