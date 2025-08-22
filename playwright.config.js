// playwright.config.js
const { defineConfig } = require('playwright/test');

module.exports = defineConfig({
  // E2Eテストのファイルが置かれているディレクトリを指定します。
  testDir: './e2e',
});
