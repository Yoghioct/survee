module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'react-app',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'next/core-web-vitals',
    'plugin:jest/recommended',
    'plugin:testing-library/react',
    'plugin:tailwindcss/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: [
    'react',
    'react-hooks',
    'jest',
    'testing-library',
    'tailwindcss',
    '@typescript-eslint',
    'prettier',
    'no-relative-import-paths',
  ],
  rules: {
    'semi': 'off',
    'quotes': 'off',
    'indent': 'off',
  
    // Tailwind
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/migration-from-tailwind-2': 'off',
    'tailwindcss/classnames-order': 'off',
    'tailwindcss/enforces-shorthand': 'off',
    'tailwindcss/no-unnecessary-arbitrary-value': 'off',
  
    // Import Path
    'import/first': 'off',
    'no-relative-import-paths/no-relative-import-paths': 'off',
  
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  
    // React
    'react/no-unescaped-entities': 'off',
  
    // Other
    'eqeqeq': 'off',
    'prefer-const': 'off',
  }
};
