import { Router } from "express";
import validate from "../middleware/validate.js";
import { estimateSingleSchema } from "../schemas/house.js";
import { estimate } from "../controllers/estimateController.js";

const router = Router();

router.post("/", validate(estimateSingleSchema), estimate);

export default router;
