import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
  allConfig: {},
  eslintRecommendedConfig: {}
});

// Make sure the Next.js configs are properly loaded
const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
