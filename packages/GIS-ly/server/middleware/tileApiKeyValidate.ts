import { check } from 'express-validator';

export const tileApiKeyValidate = [
  check('tile api key name', 'Tile API key name must contain only letters & numbers')
    .isAlphanumeric()
    .trim().escape()
];
