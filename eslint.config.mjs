import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "prefer-const": "off",
      "react/jsx-key": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/no-unescaped-entities": "off",
      "react/no-children-prop": "off",
      "react/no-unstable-nested-components": "off",
      "react/no-unknown-property": "off",
      "react/no-unescaped-entities": "off",
      "react/no-children-prop": "off",
      "react/no-unstable-nested-components": "off",
      "react/no-unknown-property": "off",
      "react/no-array-index-key": "off",
      "no-var": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-undef-init": "off",
      "no-unused-imports": "off",
      "no-unused-expressions": "off",
    },
  },
];

export default eslintConfig;
