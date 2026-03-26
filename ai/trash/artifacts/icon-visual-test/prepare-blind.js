import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const svgDir = '/home/jack/semantic/next/src/primitives/icon/sets/lucide/svg';
const outDir = '/home/jack/semantic/next/ai/workspace/icon-visual-test';

// 11 diverse icons spanning different visual complexity
const testIcons = [
  'house', // home — house shape
  'trash-2', // trash — bin/can
  'shield-check', // shield with checkmark
  'save', // floppy disk
  'refresh-ccw', // circular arrows
  'chart-pie', // pie chart
  'flask-conical', // science flask
  'fingerprint', // fingerprint pattern
  'venetian-mask', // mask shape
  'sparkles', // abstract sparkles
  'wand-sparkles', // wand with stars
];

// Shuffle so order doesn't correlate with the list above
const shuffled = testIcons.sort(() => Math.random() - 0.5);

const blindSamples = {};
const manifest = {};

shuffled.forEach((icon, i) => {
  const key = `sample_${i + 1}`;
  let svg = readFileSync(join(svgDir, `${icon}.svg`), 'utf8');

  // Strip everything identifying
  svg = svg
    .replace(/<!--.*?-->/gs, '') // license comments with icon name
    .replace(/class="[^"]*"/g, '') // class="lucide lucide-house"
    .replace(/id="[^"]*"/g, '') // any id attributes
    .replace(/\s+>/g, '>') // clean whitespace
    .trim();

  // Extract just the inner content (paths, circles, etc) — strip the <svg> wrapper entirely
  const inner = svg
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();

  blindSamples[key] = inner;
  manifest[key] = icon;
});

writeFileSync(join(outDir, 'blind-samples.json'), JSON.stringify(blindSamples, null, 2));
writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(`Wrote ${Object.keys(blindSamples).length} blind samples`);
console.log('Manifest (DO NOT share with describing agent):');
console.log(manifest);
