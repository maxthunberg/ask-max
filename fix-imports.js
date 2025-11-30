#!/usr/bin/env node

/**
 * Script to remove version specifiers from imports in UI components
 * Converts: import X from "package@1.2.3"
 * To: import X from "package"
 */

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components', 'ui');

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all @version patterns in imports
  const fixed = content.replace(
    /(from\s+["'])([^"']+)@\d+\.\d+\.\d+(["'])/g,
    '$1$2$3'
  );
  
  if (content !== fixed) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`✓ Fixed: ${path.basename(filePath)}`);
    return true;
  }
  
  return false;
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);
  let fixedCount = 0;

  files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const filePath = path.join(dir, file);
      if (fixImportsInFile(filePath)) {
        fixedCount++;
      }
    }
  });

  console.log(`\nFixed ${fixedCount} file(s) in ${dir}`);
}

// Process components/ui directory
processDirectory(componentsDir);

console.log('\n✨ Import fixing complete!');
