import {estimatePortfolioPrice, estimatePrice} from '../services/predictorService.js';
import { estimateSingleSchema } from '../schemas/house.js';

export async function estimatePortfolio(req, res, next) {
  try {
    const { records } = req.validatedBody;
    
    const houses=[];
    let totalPredictedPrice=0;

    for (const house of records){const{error,value}=estimateSingleSchema.validate(house);
      if (error){
        houses.push({
          house,status:"failed",error:error.details[0].message,
        })
        continue;
      }

      try{
        const price = await estimatePrice(value);
        houses.push({
          house:value,
          predictedPrice:price,
        });

        totalPredictedPrice+=price
      }
      catch(error){
        houses.push({
          house:value,
          status:"failed",
          error:"Predictor service unavailable",
        });
      };
    }
    res.json({
      houses,totalPredictedPrice
    });}
  catch(error)
  {
next(error);
  }
}   