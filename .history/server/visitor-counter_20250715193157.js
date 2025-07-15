const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// CORS 설정
app.use(cors());
app.use(express.json());

// 방문자 수 데이터 파일 경로
const dataFile = path.join(__dirname, 'visitor-data.json');

// 초기 데이터 구조
const initialData = {
  visitorCount: 76267,
  lastUpdated: new Date().toISOString()
};

// 데이터 파일 읽기
function readVisitorData() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('데이터 파일 읽기 오류:', error);
  }
  return initialData;
}

// 데이터 파일 쓰기
function writeVisitorData(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('데이터 파일 쓰기 오류:', error);
  }
}

// 방문자 수 증가 API
app.post('/api/visitor/increment', (req, res) => {
  try {
    const data = readVisitorData();
    data.visitorCount += 1;
    data.lastUpdated = new Date().toISOString();
    writeVisitorData(data);
    
    res.json({
      success: true,
      visitorCount: data.visitorCount,
      message: '방문자 수가 증가했습니다.'
    });
  } catch (error) {
    console.error('방문자 수 증가 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 방문자 수 조회 API
app.get('/api/visitor/count', (req, res) => {
  try {
    const data = readVisitorData();
    res.json({
      success: true,
      visitorCount: data.visitorCount,
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    console.error('방문자 수 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`방문자 카운터 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`API 엔드포인트:`);
  console.log(`- GET  http://localhost:${PORT}/api/visitor/count`);
  console.log(`- POST http://localhost:${PORT}/api/visitor/increment`);
});

module.exports = app; 