#!/usr/bin/env node
// Patches @react-navigation/elements to add generic scale variants alongside
// platform-specific ones. Metro's asset server requires back-icon@3x.png (generic)
// even when only back-icon@3x.ios.png / back-icon@3x.android.png exist.
// Run automatically via "postinstall" in package.json.

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(
  __dirname,
  '../node_modules/@react-navigation/elements/lib/module/assets',
);

const icons = ['back-icon', 'search-icon'];
const scales = ['1x', '2x', '3x', '4x'];

for (const icon of icons) {
  for (const scale of scales) {
    const dest = path.join(assetsDir, `${icon}@${scale}.png`);
    if (!fs.existsSync(dest)) {
      const src = path.join(assetsDir, `${icon}@${scale}.ios.png`);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`patched: ${icon}@${scale}.png`);
      }
    }
  }
}
