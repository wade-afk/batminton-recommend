import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import ImageSlider from './ImageSlider';

const ResultsContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  overflow-x: auto;

  /* 사이드바 광고가 나타날 때 본문이 겹치지 않도록 조정 */
  @media (min-width: 1400px) {
    max-width: calc(100% - 180px); /* 사이드바 공간을 더 줄여서 광고와 정확히 맞춤 */
    margin-right: 20px; /* 사이드바와의 간격 */
    margin-left: -35px; /* 왼쪽으로 50px 조정 */
  }

  @media (max-width: 900px) {
    padding: 1rem;
  }
  @media (max-width: 600px) {
    padding: 0.5rem;
    border-radius: 12px;
  }
`;

const UserProfileSection = styled.div`
  background: #f8f9ff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid #667eea;
`;

const UserProfileTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
`;

const UserLabelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const LabelItem = styled.div`
  background: white;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const LabelName = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.3rem;
`;

const LabelValue = styled.div`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;

const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3개 라켓을 고정으로 배치 */
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr); /* 중간 크기에서는 2개씩 */
    gap: 1.5rem;
  }
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const RacketCard = styled.div`
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  word-break: break-all;

  @media (max-width: 900px) {
    padding: 1rem;
  }
  @media (max-width: 600px) {
    padding: 0.7rem;
    border-radius: 8px;
  }

  &:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
  }

  &:nth-child(1) {
    border-color: #ffd700;
    background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
  }

  &:nth-child(2) {
    border-color: #c0c0c0;
    background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
  }

  &:nth-child(3) {
    border-color: #cd7f32;
    background: linear-gradient(135deg, #fdf6e3 0%, #fff 100%);
  }
`;

const RankBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  
  ${props => {
    switch(props.rank) {
      case 1: return 'background: linear-gradient(135deg, #ffd700, #ffed4e);';
      case 2: return 'background: linear-gradient(135deg, #c0c0c0, #e0e0e0);';
      case 3: return 'background: linear-gradient(135deg, #cd7f32, #daa520);';
      default: return 'background: #667eea;';
    }
  }}
`;

const RacketName = styled.h3`
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 1rem;
  padding-right: 50px;
`;

const SimilarityScore = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ScoreBar = styled.div`
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-right: 1rem;
  overflow: hidden;
`;

const ScoreFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: ${props => props.score}%;
  transition: width 0.5s ease;
`;

const ScoreText = styled.span`
  font-weight: bold;
  color: #667eea;
  min-width: 50px;
`;

const RacketDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.2rem;
`;

const DetailValue = styled.span`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
`;

const Price = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 1rem;
`;

const Features = styled.div`
  background: #f8f9ff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const FeaturesTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

const FeaturesText = styled.div`
  font-size: 0.8rem;
  color: #666;
  line-height: 1.4;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
`;

const RestartButton = styled(Button)`
  background: #f0f0f0;
  color: #666;
  
  &:hover {
    background: #e0e0e0;
    transform: translateY(-2px);
  }
`;

const CompareButton = styled(Button)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

const SideAdContainer = styled.div`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 160px;
  z-index: 100;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 8px;
  overflow: hidden;
  
  @media (max-width: 1400px) {
    display: none;
  }
  
  @media (min-width: 1400px) {
    right: 20px; /* 사이드바 광고의 최종 위치 조정 */
  }
`;

function normalize(str) {
  return str
    .replace(/[^\w\d가-힣]/g, '') // 특수문자 제거
    .replace(/\s+/g, '') // 공백 제거
    .toLowerCase();
}

// Levenshtein 거리 계산 함수
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

function findBestFolder(racketName, indexData) {
  const norm = normalize(racketName);
  const keys = Object.keys(indexData);
  
  // 1. 정확한 매칭 먼저 시도 (정규화된 키와 비교)
  for (const k of keys) {
    if (norm === k) {
      return k;
    }
  }
  
  // 2. 실제 폴더명과 매칭 시도 (첫 번째 이미지 경로에서 폴더명 추출)
  for (const k of keys) {
    if (indexData[k] && indexData[k].length > 0) {
      const folderName = indexData[k][0].split('/')[0]; // "ARCSABER 7 PRO/1.png" -> "ARCSABER 7 PRO"
      const normalizedFolderName = normalize(folderName);
      if (norm === normalizedFolderName) {
        return k;
      }
    }
  }
  
  // 3. 부분 매칭 시도 (포함 관계)
  for (const k of keys) {
    if (norm.includes(k) || k.includes(norm)) {
      return k;
    }
  }
  
  // 4. 실제 폴더명과 부분 매칭 시도
  for (const k of keys) {
    if (indexData[k] && indexData[k].length > 0) {
      const folderName = indexData[k][0].split('/')[0];
      const normalizedFolderName = normalize(folderName);
      if (norm.includes(normalizedFolderName) || normalizedFolderName.includes(norm)) {
        return k;
      }
    }
  }
  
  // 5. Levenshtein 거리로 가장 가까운 폴더 선택
  let minDist = Infinity;
  let bestKey = null;
  for (const k of keys) {
    const dist = levenshtein(norm, k);
    if (dist < minDist) {
      minDist = dist;
      bestKey = k;
    }
  }
  
  // 거리가 너무 크면 매칭하지 않음 (임계값: 8로 증가)
  return minDist <= 8 ? bestKey : null;
}

function Results({ recommendations, userLabels, onRestart, onCompare }) {
  const sideAdRef = useRef(null);

  // 광고 로드
  useEffect(() => {
    if (window.adsbygoogle && sideAdRef.current) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('광고 로드 중 오류:', e);
      }
    }
  }, []);

  const getLabelDisplayName = (key) => {
    const labelNames = {
      PlayStyle: '플레이 스타일',
      WeightPref: '무게 선호도',
      BalancePref: '밸런스 선호도',
      ShaftFlex: '샤프트 유연성',
      GripStrength: '그립 강도',
      Level: '실력 레벨'
    };
    return labelNames[key] || key;
  };

  const formatPrice = (priceStr) => {
    if (!priceStr) return '가격 정보 없음';
    return priceStr.trim();
  };

  const formatFeatures = (features) => {
    if (!features) return '특징 정보 없음';
    return features.length > 100 ? features.substring(0, 100) + '...' : features;
  };

  const [imagesIndex, setImagesIndex] = React.useState(null);

  React.useEffect(() => {
    fetch('/images/index.json')
      .then(res => res.json())
      .then(setImagesIndex)
      .catch(() => setImagesIndex(null));
  }, []);

  return (
    <>
      {/* 사이드바 광고 */}
      <SideAdContainer>
        <ins 
          ref={sideAdRef}
          className="adsbygoogle"
          style={{display: 'block'}}
          data-ad-client="ca-pub-9588119791313794"
          data-ad-slot="2352948514"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
      </SideAdContainer>

      <ResultsContainer>
        <UserProfileSection>
        <UserProfileTitle>📊 당신의 배드민턴 프로필</UserProfileTitle>
        <UserLabelsGrid>
          {Object.entries(userLabels).map(([key, value]) => (
            value && (
              <LabelItem key={key}>
                <LabelName>{getLabelDisplayName(key)}</LabelName>
                <LabelValue>{value}</LabelValue>
              </LabelItem>
            )
          ))}
        </UserLabelsGrid>
      </UserProfileSection>

      <RecommendationsGrid>
        {recommendations.map((racket, index) => {
          let images = [];
          if (imagesIndex) {
            const folderKey = findBestFolder(racket['종류'], imagesIndex);
            if (folderKey) {
              images = imagesIndex[folderKey].map(f => `/images/${f}`);
              console.log(`매칭 성공: ${racket['종류']} -> ${folderKey} (${images.length}개 이미지)`);
            } else {
              console.log(`매칭 실패: ${racket['종류']} (정규화: ${normalize(racket['종류'])})`);
            }
          }
          return (
            <RacketCard key={index}>
              <RankBadge rank={index + 1}>{index + 1}</RankBadge>
              <RacketName>{racket['종류']}</RacketName>
              <SimilarityScore>
                <ScoreBar>
                  <ScoreFill score={racket.similarityScore} />
                </ScoreBar>
                <ScoreText>{Math.round(racket.similarityScore)}%</ScoreText>
              </SimilarityScore>
              <Price>{formatPrice(racket['가격'])}</Price>
              <RacketDetails>
                <DetailItem>
                  <DetailLabel>무게</DetailLabel>
                  <DetailValue>{racket['무게'] || '정보 없음'}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>밸런스</DetailLabel>
                  <DetailValue>{racket['밸런스 포인트'] || '정보 없음'}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>샤프트</DetailLabel>
                  <DetailValue>{racket['샤프트 유연성'] || '정보 없음'}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>출시일</DetailLabel>
                  <DetailValue>{racket['출시날짜'] || '정보 없음'}</DetailValue>
                </DetailItem>
              </RacketDetails>
              <Features>
                <FeaturesTitle>주요 특징</FeaturesTitle>
                <FeaturesText>{formatFeatures(racket['특징'])}</FeaturesText>
              </Features>
              {/* 이미지 슬라이더 */}
              {images.length > 0 && (
                <ImageSlider images={images} alt={racket['종류']} />
              )}
            </RacketCard>
          );
        })}
      </RecommendationsGrid>

      <ActionButtons>
        <RestartButton onClick={onRestart}>
          🔄 다시 추천받기
        </RestartButton>
        <CompareButton onClick={onCompare}>
          ⚖️ 라켓 비교하기
        </CompareButton>
      </ActionButtons>
    </ResultsContainer>
    </>
  );
}

export default Results; 