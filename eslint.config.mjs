import { defineConfig } from "eslint/config";
import next from "eslint-config-next";

export default defineConfig([
  {
    ignores: [
      '.next/**',
      '.claude/**',
      'node_modules/**',
      'neuroquest-academy-integration/**',
      'tmpnetroquest-academy/**',
      'public/play/**',
      'src/components/grade8-platform/**',
    ],
  },
  {
    extends: [...next],
  },
]);
