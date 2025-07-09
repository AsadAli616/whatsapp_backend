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
      fileName: Joi.required().label("fileName").messages({
        "any.required": `Image  is Required`,
      }),
      firstName: Joi.string().required().label("firstName").messages({
        "any.required": `{#label} is Required`,
      }),

      password: Joi.string().required().label("Password").messages({
        "any.required": `{#label} is Required`,
      }),
    });
    return schema.validate(obj, { allowUnknown: true });
  },
  verifyAccount: async (obj) => {
    const schema = Joi.object({
      email: Joi.string().email().required().label("Email").messages({
        "any.required": `{#label} is Required`,
        "string.email": "Enter a valid email",
      }),
      code: Joi.string().required().label("code").messages({
        "any.required": `{#label} is Required`,
      }),
    });
    return schema.validate(obj, { allowUnknown: true });
  },
  editeProfileValidation: async (obj) => {
    const schema = Joi.object({
      whatappstatus: Joi.string().required().label("whatappstatus").messages({
        "any.required": `{#label} is Required`,
      }),
      name: Joi.string().required().label("name").messages({
        "any.required": `{#label} is Required`,
      }),
    });
    return schema.validate(obj, { allowUnknown: true });
  },
};
