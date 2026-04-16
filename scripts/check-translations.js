#!/usr/bin/env node
// check-translations.js
// Verifies that ru.json and az.json contain all keys present in en.json (the source of truth).
// Note: eslint-plugin-i18n-json with identical-keys rule covers this during `pnpm lint:translations`.
// This script provides a fast standalone check without running full ESLint.
//
// Usage: node scripts/check-translations.js
// Exit 0 = all keys present; Exit 1 = missing keys found.

const az = require('../src/translations/az.json');
const en = require('../src/translations/en.json');
const ru = require('../src/translations/ru.json');

function getKeys(obj, prefix = '') {
  return Object.keys(obj).flatMap((k) => {
    const val = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    return typeof val === 'object' && val !== null ? getKeys(val, key) : [key];
  });
}

const enKeys = getKeys(en);
let hasError = false;

for (const [name, dict] of [['ru', ru], ['az', az]]) {
  const dictKeys = getKeys(dict);
  const missing = enKeys.filter(k => !dictKeys.includes(k));
  if (missing.length > 0) {
    console.error(`[${name}] Missing ${missing.length} key(s) relative to en.json:`);
    missing.forEach(k => console.error(`  - ${k}`));
    hasError = true;
  }
  else {
    console.log(`[${name}] OK — ${dictKeys.length} keys match en.json`);
  }
}

if (hasError) {
  process.exit(1);
}
