import { checkSchema } from 'express-validator';

const loginValidator = checkSchema({
  email: {
    errorMessage: 'Email is required',
    notEmpty: true,
    trim: true,
  },
  password: {
    errorMessage: 'Password is required',
    notEmpty: true,
    trim: true,
  },
});

export default loginValidator;
