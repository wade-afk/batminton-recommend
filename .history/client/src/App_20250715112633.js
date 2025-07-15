import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Survey from './components/Survey';
import Results from './components/Results';
import LandingPage from './components/LandingPage';
import RacketSelector from './components/RacketSelector';
import RacketComparison from './components/RacketComparison';
import { getRecommendations } from './utils/recommendationEngine';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Noto Sans KR', sans-serif;
`;

const AdContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    margin: 0 1rem 1rem 1rem;
  }
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
  const [currentStep, setCurrentStep] = useState('landing');
  const [recommendations, setRecommendations] = useState(null);
  const [userLabels, setUserLabels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [surveyMapping, setSurveyMapping] = useState([]);
  const [racketData, setRacketData] = useState([]);
  const [selectedRackets, setSelectedRackets] = useState([]);
  const headerAdRef = useRef(null);
  const footerAdRef = useRef(null);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const [surveyMappingRes, racketDataRes] = await Promise.all([
          fetch('/data/survey-mapping.json'),
          fetch('/data/rackets.json')
        ]);
        
        const surveyMappingData = await surveyMappingRes.json();
        const racketDataData = await racketDataRes.json();
        
        setSurveyMapping(surveyMappingData);
        setRacketData(racketDataData);
      } catch (error) {
        console.error('데이터 로드 중 오류:', error);
      }
    };
    
    loadData();
  }, []);

  // 광고 로드
  useEffect(() => {
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('광고 로드 중 오류:', e);
      }
    }
  }, [currentStep]);

  const handleSurveyComplete = async (responses) => {
    setLoading(true);
    try {
      const result = getRecommendations(responses, surveyMapping, racketData);
      
      setRecommendations(result.recommendations);
      setUserLabels(result.userLabels);
      setCurrentStep('results');
    } catch (error) {
      console.error('추천 처리 중 오류:', error);
      alert('추천을 받는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep('landing');
    setRecommendations(null);
    setUserLabels(null);
    setSelectedRackets([]);
  };

  const handleStart = () => {
    setCurrentStep('survey');
  };

  const handleCompareRackets = () => {
    setCurrentStep('selector');
  };

  const handleRacketSelection = (rackets) => {
    setSelectedRackets(rackets);
    setCurrentStep('comparison');
  };

  const handleBackFromSelector = () => {
    setCurrentStep('results');
  };

  const handleBackFromComparison = () => {
    setCurrentStep('selector');
  };

  const handleSelectMoreRackets = () => {
    setCurrentStep('selector');
  };

  return (
    <AppContainer>
      <Header>
        <Title>🏸 배드민턴 라켓 추천</Title>
        <Subtitle>당신에게 맞는 최적의 라켓을 찾아보세요</Subtitle>
      </Header>
      
      {/* 헤더 광고 */}
      <AdContainer>
        <ins 
          ref={headerAdRef}
          className="adsbygoogle"
          style={{display: 'block'}}
          data-ad-client="ca-pub-9588119791313794"
          data-ad-slot="3666030186"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
      </AdContainer>
      
      <MainContent>
        {currentStep === 'landing' && (
          <LandingPage onStart={handleStart} />
        )}
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
            onCompare={handleCompareRackets}
          />
        )}
        {currentStep === 'selector' && (
          <RacketSelector
            onCompare={handleRacketSelection}
            onBack={handleBackFromSelector}
          />
        )}
        {currentStep === 'comparison' && (
          <RacketComparison
            selectedRackets={selectedRackets}
            onBack={handleBackFromComparison}
            onSelectMore={handleSelectMoreRackets}
          />
        )}
      </MainContent>
      
      {/* 푸터 광고 */}
      <AdContainer>
        <ins 
          ref={footerAdRef}
          className="adsbygoogle"
          style={{display: 'block'}}
          data-ad-client="ca-pub-9588119791313794"
          data-ad-slot="3666030186"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
      </AdContainer>
    </AppContainer>
  );
}

export default App; 