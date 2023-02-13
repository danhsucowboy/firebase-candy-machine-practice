module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["functions/tsconfig.json", "functions/tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "quote-props": ["error", "consistent-as-needed"],
    // eslint-disable-next-line quote-props
    quotes: ["error", "double"],
    // eslint-disable-next-line quote-props
    indent: ["error", 2],
    "object-curly-spacing": ["error", "always"],
    "import/no-unresolved": 0,
  },
};
