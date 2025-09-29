import { Linter } from 'eslint';

const config = {
  root: true,
  extends: ['next/core-web-vitals'],
  ignores: ['**/*.generated.ts'], // <-- игнорируем все сгенерированные файлы
  rules: {
    // здесь общие правила
  },
  overrides: [
    {
      files: ['*.generated.ts', 'src/**/*.generated.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // отключаем проверку any
      },
    },
  ],
};

export default config;
