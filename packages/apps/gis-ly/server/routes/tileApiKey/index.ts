import { Request, Response } from 'express';
import { validationResult } from 'express-validator';


import { toLowerSnakeCase } from '@markpthomas/common-libraries/utils';

export const getApiKey = async (req: Request, res: Response) => {
  console.log('getApiKey');
  // TODO: Fix/finish validation middleware. See tileApiKeyValidate
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   console.log('oops, errors: ', errors);
  //   return res.status(422).json({ errors: errors.array() });
  // }
  // else {
  // console.log('Processing')
  const e = process.env;

  const apiKeyRequest = req.query.apiKeyName as string;


  const nameProp = toLowerSnakeCase(apiKeyRequest).toUpperCase() + '_TILE_API_KEY';

  const apiKey = e[nameProp];

  console.log('apiKey: ', apiKey);

  res.json({ key: apiKey });
  // }
}