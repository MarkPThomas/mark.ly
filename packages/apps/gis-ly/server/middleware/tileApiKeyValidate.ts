import { check } from 'express-validator';

// TODO: This validation middleware might only work on form submissions.
// Look into the docs & maybe more appropriate to use base library instead:
// Used: express-validator https://heynode.com/tutorial/how-validate-and-sanitize-expressjs-form/
// Base: validator.js https://github.com/validatorjs/validator.js#sanitizers
export const tileApiKeyValidate = [
  check('tile api key name', 'Tile API key name must contain only letters & numbers')
    .isAlphanumeric()
    .trim().escape()
];
