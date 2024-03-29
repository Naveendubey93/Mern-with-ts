import { checkSchema } from 'express-validator';

const tenantValidator = checkSchema({
  name: {
    errorMessage: 'Tenant name is required',
    notEmpty: true,
    trim: true,
  },
  address: {
    errorMessage: 'Tenant address is required',
    notEmpty: true,
    trim: true,
  },
});

export default tenantValidator;
