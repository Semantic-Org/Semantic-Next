// src/pages/package.json.js
import fs from 'fs';
import path from 'path';

import { npmPackages } from './importmap.json.js';

const version = '^0.0.1';

export const dependencies = {};

for (const pkg of npmPackages) {
  dependencies[pkg] = version;
};

export const packageFile = {
  dependencies
};

export const packageJSON = JSON.stringify(packageFile, null, 2);

export const GET = async () => {
  return new Response(packageJSON, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=31536000',
    }
  });
};
