import React from 'react';
import styled from 'styled-components';

const ResultsContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 900px) {
    padding: 1rem;
    max-width: 100vw;
  }
  @media (max-width: 600px) {
    padding: 0.5rem;
    border-radius: 0;
  }
`;

const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ResultsTitle = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const ResultsSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;

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
  min-width: 0;
  word-break: keep-all;
  box-sizing: border-box;

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

function Results({ recommendations, userLabels, onRestart }) {
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

  return (
    <ResultsContainer>
      <ResultsHeader>
        <ResultsTitle>🎯 당신에게 추천하는 라켓</ResultsTitle>
        <ResultsSubtitle>
          설문 결과를 바탕으로 최적의 라켓을 찾았습니다
        </ResultsSubtitle>
      </ResultsHeader>

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
        {recommendations.map((racket, index) => (
          <RacketCard key={index}>
            <RankBadge rank={index + 1}>{index + 1}</RankBadge>
            
            <RacketName>{racket['종류']}</RacketName>
            
            <SimilarityScore>
              <ScoreBar>
                <ScoreFill score={racket.similarityScore} />
              </ScoreBar>
              <ScoreText>{Math.round(racket.similarityScore)}%</ScoreText>
            </SimilarityScore>
            
            <Price>{formatPrice(racket[' 가격 '])}</Price>
            
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
              <FeaturesText>{formatFeatures(racket['적용 소재 및 기술력'])}</FeaturesText>
            </Features>
          </RacketCard>
        ))}
      </RecommendationsGrid>

      <ActionButtons>
        <RestartButton onClick={onRestart}>
          🔄 다시 추천받기
        </RestartButton>
        <CompareButton onClick={() => alert('비교 기능은 추후 업데이트 예정입니다!')}>
          ⚖️ 라켓 비교하기
        </CompareButton>
      </ActionButtons>
    </ResultsContainer>
  );
}

export default Results; 