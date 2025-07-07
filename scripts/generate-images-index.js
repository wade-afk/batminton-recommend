const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../client/public/images');
const output = path.join(imagesDir, 'index.json');

function normalize(str) {
  return str.replace(/[^\w\d가-힣]/g, '').toLowerCase();
}

function walkImagesDir(dir) {
  const result = {};
  const folders = fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory());

  folders.forEach(folder => {
    const folderName = folder.name;
    const norm = normalize(folderName);
    const folderPath = path.join(dir, folderName);
    const files = fs.readdirSync(folderPath)
      .filter(f => /\.(png|jpe?g)$/i.test(f));
    result[norm] = files.map(f => `${folderName}/${f}`);
  });
  return result;
}

const index = walkImagesDir(imagesDir);
fs.writeFileSync(output, JSON.stringify(index, null, 2), 'utf-8');
console.log('이미지 인덱스 생성 완료:', output); 