import { Request, Response } from 'express';
import { validationResult } from 'express-validator';


import toSnakeCase from '../../../../common/utils/toSnakeCase';

export const getApiKey = async (req: Request, res: Response) => {
  console.log('getApiKey');
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  else {
    const e = process.env;

    const apiKeyRequest = req.query.apiKeyName as string;

    const nameProp = toSnakeCase(apiKeyRequest).toUpperCase() + '_TILE_API_KEY';
    const apiKey = e[nameProp];

    res.json({ key: apiKey });
  }
}