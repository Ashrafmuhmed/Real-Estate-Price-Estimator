import Joi from "joi";

export const estimateSingleSchema = Joi.object({
  sqft: Joi.number().positive().min(300).max(10000).required(),
  bedrooms: Joi.number().integer().positive().min(1).max(10).required(),
  bathrooms: Joi.number().positive().min(1).max(10).required(),
  age: Joi.number().integer().min(0).max(150).required(),
});
