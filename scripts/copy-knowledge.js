const fs = require('fs');
const path = require('path');

// Create knowledge directory in server folder if it doesn't exist
const targetDir = path.join(__dirname, '../supabase/functions/server/knowledge');
const sourceDir = path.join(__dirname, '../knowledge');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy all markdown files
const files = fs.readdirSync(sourceDir);
files.forEach(file => {
  if (file.endsWith('.md')) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${file} to server/knowledge/`);
  }
});

console.log('✅ Knowledge files copied successfully');
