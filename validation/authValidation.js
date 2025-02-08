const Joi = require("joi");

module.exports = {
  logINValidation: async (obj) => {
    const schema = Joi.object({
      email: Joi.string().email().required().label("Email").messages({
        "any.required": `{#label} is Required`,
        "string.email": "Enter a valid email",
      }),
      password: Joi.string().required().label("Password").messages({
        "any.required": `{#label} is Required`,
      }),
    });
    return schema.validate(obj, { allowUnknown: true });
  },
  signUpValidation: async (obj) => {
    const schema = Joi.object({
      email: Joi.string().email().required().label("Email").messages({
        "any.required": `{#label} is Required`,
        "string.email": "Enter a valid email",
      }),
      fileName: Joi.string().required().label("fileName").messages({
        "any.required": `{#label} is Required`,
      }),
      firstName: Joi.string().required().label("firstName").messages({
        "any.required": `{#label} is Required`,
      }),
      lastName: Joi.string().required().label("lastName").messages({
        "any.required": `{#label} is Required`,
      }),
      password: Joi.string().required().label("Password").messages({
        "any.required": `{#label} is Required`,
      }),
    });
    return schema.validate(obj, { allowUnknown: true });
  },
};
