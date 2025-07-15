const fs = require('fs');
const path = require('path');

// CSV 파일 읽기
const csvPath = path.join(__dirname, '../요넥스 라켓비교.csv');
const outputPath = path.join(__dirname, '../client/public/data/rackets.json');

try {
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n');
  
  // 헤더 추출
  const headers = lines[0].split(',').map(h => h.trim());
  
  // 데이터 파싱
  const rackets = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // 쉼표로 분할하되, 따옴표 안의 쉼표는 무시
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim()); // 마지막 값
    
    // 객체 생성
    const racket = {};
    headers.forEach((header, index) => {
      racket[header] = values[index] || '';
    });
    
    rackets.push(racket);
  }
  
  // JSON 파일로 저장
  fs.writeFileSync(outputPath, JSON.stringify(rackets, null, 2), 'utf8');
  
  console.log(`✅ ${rackets.length}개의 라켓 데이터가 ${outputPath}에 저장되었습니다.`);
  
} catch (error) {
  console.error('❌ 오류 발생:', error.message);
} 