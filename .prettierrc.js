module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 150,
  tabWidth: 2,
  overrides: [
    {
      files: '*.json',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '.*rc',
      options: {
        singleQuote: false,
        parser: 'json',
      },
    },
  ],
};
