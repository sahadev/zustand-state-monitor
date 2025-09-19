const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

// 需要修复的文件
const filesToFix = [
  'index.js',
  'hooks.js', 
  'autoRegister.js',
  'DevTools.js'
];

// 需要添加.js扩展名的相对导入模式
const importPatterns = [
  /from '(\.\/.+?)'/g,
  /from "(\.\/.+?)"/g,
  /import '(\.\/.+?)'/g,
  /import "(\.\/.+?)"/g,
  /export \* from '(\.\/.+?)'/g,
  /export \* from "(\.\/.+?)"/g,
  /export \{[^}]+\} from '(\.\/.+?)'/g,
  /export \{[^}]+\} from "(\.\/.+?)"/g
];

function fixImportsInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  importPatterns.forEach(pattern => {
    content = content.replace(pattern, (match, importPath) => {
      // 只处理相对导入，且不已经有.js扩展名的
      if (importPath.startsWith('./') && !importPath.endsWith('.js') && !importPath.endsWith('.ts')) {
        modified = true;
        return match.replace(importPath, importPath + '.js');
      }
      return match;
    });
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed imports in: ${path.basename(filePath)}`);
  }
}

// 修复所有文件
filesToFix.forEach(file => {
  const filePath = path.join(distDir, file);
  fixImportsInFile(filePath);
});

console.log('Import fixing completed!');