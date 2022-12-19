const Joi = require("joi");

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
