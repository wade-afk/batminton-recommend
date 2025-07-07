import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Survey from './components/Survey';
import Results from './components/Results';
import { getRecommendations } from './utils/recommendationEngine';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Noto Sans KR', sans-serif;
`;

const Header = styled.header`
  text-align: center;
  padding: 2rem 0;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

function App() {
  const [currentStep, setCurrentStep] = useState('survey');
  const [surveyResponses, setSurveyResponses] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [userLabels, setUserLabels] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSurveyComplete = async (responses) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/recommend', {
        surveyResponses: responses
      });
      
      setRecommendations(response.data.recommendations);
      setUserLabels(response.data.userLabels);
      setCurrentStep('results');
    } catch (error) {
      console.error('추천 요청 중 오류:', error);
      alert('추천을 받는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep('survey');
    setSurveyResponses([]);
    setRecommendations(null);
    setUserLabels(null);
  };

  return (
    <AppContainer>
      <Header>
        <Title>🏸 배드민턴 라켓 추천</Title>
        <Subtitle>당신에게 맞는 최적의 라켓을 찾아보세요</Subtitle>
      </Header>
      
      <MainContent>
        {currentStep === 'survey' && (
          <Survey 
            onComplete={handleSurveyComplete}
            loading={loading}
          />
        )}
        
        {currentStep === 'results' && recommendations && (
          <Results 
            recommendations={recommendations}
            userLabels={userLabels}
            onRestart={handleRestart}
          />
        )}
      </MainContent>
    </AppContainer>
  );
}

export default App; 