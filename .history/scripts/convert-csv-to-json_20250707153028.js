const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// 설문 매핑 데이터를 JSON으로 변환
function convertSurveyMapping() {
  const results = [];
  
  fs.createReadStream(path.join(__dirname, '../배드민턴_성향_설문_라벨_매핑표.csv'))
    .pipe(csv())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      const outputPath = path.join(__dirname, '../client/public/data/survey-mapping.json');
      
      // 디렉토리가 없으면 생성
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
      console.log('설문 매핑 데이터가 JSON으로 변환되었습니다:', outputPath);
    });
}

// 라켓 데이터를 JSON으로 변환
function convertRacketData() {
  const results = [];
  
  fs.createReadStream(path.join(__dirname, '../요넥스 라켓비교.csv'))
    .pipe(csv())
    .on('data', (row) => {
      if (row['종류'] && row['종류'].trim() !== '') {
        results.push(row);
      }
    })
    .on('end', () => {
      const outputPath = path.join(__dirname, '../client/public/data/rackets.json');
      
      // 디렉토리가 없으면 생성
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
      console.log('라켓 데이터가 JSON으로 변환되었습니다:', outputPath);
    });
}

// 실행
convertSurveyMapping();
convertRacketData(); 