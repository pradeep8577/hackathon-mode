/**
 * @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions &
 *       import("@ianvs/prettier-plugin-sort-imports").PluginConfig}
 */
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss' // MUST be last
  ],
  importOrder: [
    '^react$',
    '',
    '<TYPES>',
    '<TYPES>^[.]',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^[@]/',
    '',
    '^[.]'
  ]
};
