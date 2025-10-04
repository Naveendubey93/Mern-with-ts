import { checkSchema } from 'express-validator';
export default checkSchema({
  q: {
    trim: true,
    customSanitizer: {
      options: (value) => {
        return value ? `%${value}%` : '';
      },
    },
  },
  role: {
    trim: true,
    customSanitizer: {
      options: (value) => {
        return value ? value.toLowerCase() : '';
      },
    },
  },
  currentPage: {
    customSanitizer: {
      options: (value) => {
        if (value === undefined || value === null) {
          return 1;
        }
        return Number(value);
      },
    },
  },
  perPage: {
    customSanitizer: {
      options: (value) => {
        if (value === undefined || value === null) {
          return 7;
        }
        return Number(value);
      },
    },
  },
});
