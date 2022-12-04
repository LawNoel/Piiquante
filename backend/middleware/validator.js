const Joi = require("joi");

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

// const schemaSauce = Joi.object({
//   userId: Joi.string().require(),
//   name: Joi.string().require(),
//   manufacturer: Joi.string().require(),
//   description: Joi.string().require(),
//   mainPepper: Joi.string().require(),
//   imageUrl: Joi.string().require(),
//   heat: Joi.number().require(),
// });

// exports.validSauce = async (req, res, next) => {
//   try {
//     await schemaSauce.validateAsync(req.body);
//     next();
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };
