import {Router} from 'express';
import validate from '../middleware/validate.js';
import {estimatePortfolioSchema} from '../schemas/portfolio.js';
import {estimatePortfolio} from '../controllers/portfolioController.js';

const router = Router();
router.post('/', validate(estimatePortfolioSchema), estimatePortfolio);

export default router;