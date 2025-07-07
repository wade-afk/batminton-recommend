// 설문 응답을 라벨로 변환하는 함수
export function mapSurveyToLabels(surveyResponses, surveyMapping) {
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
      m['\ufeff\ubb38\ud56d'] === questionNumber && 
      m['\uc751\ub2f5'] === response
    );

    if (mapping && mapping['\ub9e4\ud551 \ub77c\ubca8'] && mapping['\ub9e4\ud551 \uac12']) {
      const labelType = mapping['\ub9e4\ud551 \ub77c\ubca8'];
      if (labels.hasOwnProperty(labelType)) {
        labels[labelType] = mapping['\ub9e4\ud551 \uac12'];
      }
    }
  });

  return labels;
}

// 라켓 유사도 점수 계산
export function calculateSimilarityScore(userLabels, racket) {
  let score = 0;
  let totalPossible = 0;

  // PlayStyle 매칭 (라켓 종류 기반)
  if (userLabels.PlayStyle) {
    totalPossible++;
    const racketType = racket['\uc885\ub958'] || '';
    if (userLabels.PlayStyle === '공격형' && racketType.includes('ASTROX')) {
      score++;
    } else if (userLabels.PlayStyle === '수비형' && racketType.includes('NANOFLARE')) {
      score++;
    } else if (userLabels.PlayStyle === '올라운드형' && racketType.includes('ARCSABER')) {
      score++;
    }
  }

  // WeightPref 매칭
  if (userLabels.WeightPref && racket['\ubb34\uac8c']) {
    totalPossible++;
    const racketWeight = racket['\ubb34\uac8c'];
    if (racketWeight.includes(userLabels.WeightPref)) {
      score++;
    }
  }

  // BalancePref 매칭
  if (userLabels.BalancePref && racket['\ubc38\ub7f0\uc2a4 \ud3ec\uc778\ud2b8']) {
    totalPossible++;
    const balance = racket['\ubc38\ub7f0\uc2a4 \ud3ec\uc778\ud2b8'];
    if (userLabels.BalancePref === '헤드헤비' && balance.includes('공격형')) {
      score++;
    } else if (userLabels.BalancePref === '헤드라이트' && balance.includes('기술형')) {
      score++;
    } else if (userLabels.BalancePref === '밸런스형' && balance.includes('올라운더형')) {
      score++;
    }
  }

  // ShaftFlex 매칭
  if (userLabels.ShaftFlex && racket['\uc0e4\ud504\ud2b8 \uc720\uc5f0\uc131']) {
    totalPossible++;
    const flex = racket['\uc0e4\ud504\ud2b8 \uc720\uc5f0\uc131'];
    if (userLabels.ShaftFlex === '단단함' && (flex.includes('Stiff') || flex.includes('STIFF'))) {
      score++;
    } else if (userLabels.ShaftFlex === '유연함' && (flex.includes('Flexible') || flex.includes('HI-FLEX'))) {
      score++;
    } else if (userLabels.ShaftFlex === '중간' && flex.includes('Medium')) {
      score++;
    }
  }

  // Level 매칭 (가격 기반)
  if (userLabels.Level && racket[' \uac00\uaca9 ']) {
    totalPossible++;
    const price = parseInt(racket[' \uac00\uaca9 '].replace(/[^\d]/g, ''));
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

// 라켓 추천 함수
export function getRecommendations(surveyResponses, surveyMapping, racketData) {
  // 설문 응답을 라벨로 변환
  const userLabels = mapSurveyToLabels(surveyResponses, surveyMapping);
  
  // 각 라켓에 대한 유사도 점수 계산
  const racketScores = racketData.map(racket => ({
    ...racket,
    similarityScore: calculateSimilarityScore(userLabels, racket)
  }));

  // 점수 순으로 정렬하고 상위 3개 선택
  const topRackets = racketScores
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 3);

  return {
    userLabels,
    recommendations: topRackets
  };
} 