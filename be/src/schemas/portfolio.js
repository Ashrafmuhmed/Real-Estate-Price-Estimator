import joi from "joi";
import { estimateSingleSchema } from "./house.js";

export const estimatePortfolioSchema = joi.object({
  records: joi.array().min(1).required(),
});

