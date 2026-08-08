import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base64 PNG buffer for icons
const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

function createMinimalPng(filename) {
  const buf = Buffer.from(base64Png, 'base64');
  fs.writeFileSync(path.join(__dirname, filename), buf);
}

createMinimalPng('icon16.png');
createMinimalPng('icon48.png');
createMinimalPng('icon128.png');

console.log('Extension icon PNGs generated successfully.');
