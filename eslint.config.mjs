import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["Portfolio Site Details-handoff/**", ".next/**"],
  },
];

export default eslintConfig;
