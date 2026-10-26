// Self-contained so it runs with a bare `npx eslint@9` (no installed packages needed)
export default [
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        CONFIG: "readonly",
        Hooks: "readonly",
        console: "readonly",
        document: "readonly",
        foundry: "readonly",
        game: "readonly",
        globalThis: "readonly",
        libWrapper: "readonly",
        ui: "readonly"
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { args: "after-used" }],
      "no-unreachable": "error",
      "no-dupe-keys": "error",
      "no-redeclare": "error",
      "prefer-const": "error",
      "semi": ["error", "always"]
    }
  }
];
