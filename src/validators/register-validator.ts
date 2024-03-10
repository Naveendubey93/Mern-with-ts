import { checkSchema } from 'express-validator';
// export default [body('email').notEmpty().withMessage('Email is required')];
const registerValidator = checkSchema({
  email: {
    errorMessage: 'Email is required',
    notEmpty: true,
    trim: true,
  },
});

export default registerValidator;
