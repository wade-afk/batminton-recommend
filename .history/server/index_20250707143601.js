const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// CSV 데이터를 메모리에 로드
let surveyMapping = [];
let racketData = [];

// 설문 매핑 데이터 로드
fs.createReadStream(path.join(__dirname, '../배드민턴_성향_설문_라벨_매핑표.csv'))
  .pipe(csv())
  .on('data', (row) => {
    surveyMapping.push(row);
  })
  .on('end', () => {
    console.log('설문 매핑 데이터 로드 완료');
  });

// 라켓 데이터 로드
fs.createReadStream(path.join(__dirname, '../요넥스 라켓비교.csv'))
  .pipe(csv())
  .on('data', (row) => {
    if (row['종류'] && row['종류'].trim() !== '') {
      racketData.push(row);
    }
  })
  .on('end', () => {
    console.log('라켓 데이터 로드 완료');
  });

// 설문 응답을 라벨로 변환하는 함수
function mapSurveyToLabels(surveyResponses) {
  const labels = {
    PlayStyle: null,
    WeightPref: null,
    BalancePref: null,
    ShaftFlex: null,
    GripStrength: null,
    Level: null
  };

  surveyResponses.forEach((response, index) => {
    const questionNumber = `Q${index + 1}`;
    const mapping = surveyMapping.find(m => 
      m['문항'] === questionNumber && 
      m['응답'] === response
    );

    if (mapping && mapping['매핑 라벨'] && mapping['매핑 값']) {
      const labelType = mapping['매핑 라벨'];
      if (labels.hasOwnProperty(labelType)) {
        labels[labelType] = mapping['매핑 값'];
      }
    }
  });

  return labels;
}

// 라켓 유사도 점수 계산
function calculateSimilarityScore(userLabels, racket) {
  let score = 0;
  let totalPossible = 0;

  // PlayStyle 매칭 (라켓 종류 기반)
  if (userLabels.PlayStyle) {
    totalPossible++;
    const racketType = racket['종류'] || '';
    if (userLabels.PlayStyle === '공격형' && racketType.includes('ASTROX')) {
      score++;
    } else if (userLabels.PlayStyle === '수비형' && racketType.includes('NANOFLARE')) {
      score++;
    } else if (userLabels.PlayStyle === '올라운드형' && racketType.includes('ARCSABER')) {
      score++;
    }
  }

  // WeightPref 매칭
  if (userLabels.WeightPref && racket['무게']) {
    totalPossible++;
    const racketWeight = racket['무게'];
    if (racketWeight.includes(userLabels.WeightPref)) {
      score++;
    }
  }

  // BalancePref 매칭
  if (userLabels.BalancePref && racket['밸런스 포인트']) {
    totalPossible++;
    const balance = racket['밸런스 포인트'];
    if (userLabels.BalancePref === '헤드헤비' && balance.includes('공격형')) {
      score++;
    } else if (userLabels.BalancePref === '헤드라이트' && balance.includes('기술형')) {
      score++;
    } else if (userLabels.BalancePref === '밸런스형' && balance.includes('올라운더형')) {
      score++;
    }
  }

  // ShaftFlex 매칭
  if (userLabels.ShaftFlex && racket['샤프트 유연성']) {
    totalPossible++;
    const flex = racket['샤프트 유연성'];
    if (userLabels.ShaftFlex === '단단함' && (flex.includes('Stiff') || flex.includes('STIFF'))) {
      score++;
    } else if (userLabels.ShaftFlex === '유연함' && (flex.includes('Flexible') || flex.includes('HI-FLEX'))) {
      score++;
    } else if (userLabels.ShaftFlex === '중간' && flex.includes('Medium')) {
      score++;
    }
  }

  // Level 매칭 (가격 기반)
  if (userLabels.Level && racket[' 가격 ']) {
    totalPossible++;
    const price = parseInt(racket[' 가격 '].replace(/[^\d]/g, ''));
    if (userLabels.Level === '입문' && price <= 80000) {
      score++;
    } else if (userLabels.Level === '초급' && price <= 150000) {
      score++;
    } else if (userLabels.Level === '중급' && price <= 250000) {
      score++;
    } else if (userLabels.Level === '상급' && price > 250000) {
      score++;
    }
  }

  return totalPossible > 0 ? (score / totalPossible) * 100 : 0;
}

// 라켓 추천 API
app.post('/api/recommend', (req, res) => {
  try {
    const { surveyResponses } = req.body;
    
    if (!surveyResponses || surveyResponses.length !== 11) {
      return res.status(400).json({ error: '11개의 설문 응답이 필요합니다.' });
    }

    // 설문 응답을 라벨로 변환
    const userLabels = mapSurveyToLabels(surveyResponses);
    
    // 각 라켓에 대한 유사도 점수 계산
    const racketScores = racketData.map(racket => ({
      ...racket,
      similarityScore: calculateSimilarityScore(userLabels, racket)
    }));

    // 점수 순으로 정렬하고 상위 3개 선택
    const topRackets = racketScores
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 3);

    res.json({
      userLabels,
      recommendations: topRackets
    });

  } catch (error) {
    console.error('추천 처리 중 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 설문 질문 목록 API
app.get('/api/survey-questions', (req, res) => {
  const questions = [
    {
      id: 1,
      question: "어떤 샷을 가장 즐겨 사용하나요?",
      options: ["스매시 (강하게 공격)", "드라이브 (빠르게 툭툭 치기)", "리시브 (상대 공격 받아치기)", "클리어 (멀리 띄워서 거리 유지)"]
    },
    {
      id: 2,
      question: "경기 중 어떤 위치를 선호하나요?",
      options: ["전위(네트 근처)", "후위(코트 뒤쪽에서 스매시/클리어)", "상황에 따라 자유롭게 움직임"]
    },
    {
      id: 3,
      question: "복식 시 주로 맡는 역할은?",
      options: ["공격수 (후위 스매시 담당)", "수비수 (전위, 빠른 반응 중심)", "올라운드 (상황에 따라 바뀜)"]
    },
    {
      id: 4,
      question: "라켓의 어떤 특성을 중요하게 생각하나요?",
      options: ["가볍고 빠르게 움직이는 라켓", "묵직하고 강하게 때릴 수 있는 라켓", "컨트롤이 잘 되는 밸런스 좋은 라켓"]
    },
    {
      id: 5,
      question: "스윙 속도는 어떤 편인가요?",
      options: ["빠른 편이에요 (민첩하게 대응 가능)", "천천히 정확하게 휘둘러요", "상황에 따라 다르게 움직여요"]
    },
    {
      id: 6,
      question: "손목 힘은 어떤 편인가요?",
      options: ["강한 편이에요 (묵직한 라켓도 문제없음)", "중간이에요", "약한 편이에요 (무거운 라켓은 부담됨)"]
    },
    {
      id: 7,
      question: "라켓의 반발력(스매시 시 반동)은 어느 정도가 좋으신가요?",
      options: ["강한 반발력 (단단한 샤프트)", "부드러운 반발력 (유연한 샤프트)", "상관없음"]
    },
    {
      id: 8,
      question: "라켓 무게는 어떤 쪽이 편하신가요?",
      options: ["3U (무겁지만 파워 있음)", "4U (중간 무게)", "5U (가볍고 반응 빠름)"]
    },
    {
      id: 9,
      question: "지금까지 사용해본 라켓 중 가장 마음에 들었던 건 어떤 느낌이었나요?",
      options: ["스매시가 잘 나갔다", "손목이 편했다", "전체적으로 밸런스가 좋았다"]
    },
    {
      id: 10,
      question: "배드민턴을 얼마나 자주 치시나요?",
      options: ["일주일에 1회 이하", "주 2~3회", "거의 매일"]
    },
    {
      id: 11,
      question: "현재 자신이 생각하는 실력은?",
      options: ["입문자", "초급 (기본기 있음)", "중급 (경기 가능)", "상급 (클럽/대회 경험 있음)"]
    }
  ];

  res.json(questions);
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 