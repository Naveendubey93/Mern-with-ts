import { checkSchema } from 'express-validator';

export default checkSchema({
  firstName: {
    errorMessage: 'First name is required!',
    notEmpty: true,
    trim: true,
  },
  lastName: {
    errorMessage: 'Last name is required!',
    notEmpty: true,
    trim: true,
  },
  role: {
    errorMessage: 'Role is required!',
    notEmpty: true,
    trim: true,
  },
  email: {
    isEmail: {
      errorMessage: 'Email is not valid!',
    },
    notEmpty: true,
    errorMessage: 'Email is required!',
    trim: true,
  },
  tenantId: {
    isInt: {
      errorMessage: 'Tenant ID must be an integer!',
    },
    notEmpty: true,
    errorMessage: 'Tenant ID is required!',
  },
});
