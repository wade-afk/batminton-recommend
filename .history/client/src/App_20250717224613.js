import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Survey from './components/Survey';
import Results from './components/Results';
import LandingPage from './components/LandingPage';
import RacketSelector from './components/RacketSelector';
import RacketComparison from './components/RacketComparison';
import { getRecommendations } from './utils/recommendationEngine';
import { 
  trackPageView, 
  trackSessionStart, 
  trackSurveyStart, 
  trackSurveyComplete,
  trackRacketCompare,
  trackAdClick 
} from './utils/analytics';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Noto Sans KR', sans-serif;
`;

const AdContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem; /* 컨테이너 패딩을 줄여서 높이 감소 */
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  min-height: 150px; /* 광고를 위한 최소 높이 -10px 조정 */
  
  @media (min-width: 1400px) {
    max-width: 1120px; /* 더 넓은 공간으로 확장 */
    margin: 0 auto; /* 중앙 정렬 */
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem; /* 모바일에서도 패딩 줄임 */
    margin: 0 1rem 1rem 1rem;
    min-height: 110px; /* 모바일에서도 -10px 조정 */
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

const TitleLink = styled.a`
  color: inherit;
  text-decoration: none;
  display: inline-block;
  outline: none;
  &:hover {
    opacity: 0.8;
  }
`;

// Removed unused Subtitle component

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (min-width: 1400px) {
    max-width: 1300px; /* 더 넓은 공간으로 확장 */
    margin: 0 auto; /* 중앙 정렬 */
  }
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
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

  // 세션 시작 추적
  useEffect(() => {
    trackSessionStart();
  }, []);

  // 페이지뷰 추적
  useEffect(() => {
    trackPageView(`Step: ${currentStep}`);
  }, [currentStep]);

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
    const loadAds = () => {
      if (window.adsbygoogle) {
        try {
          window.adsbygoogle.push({});
        } catch (e) {
          console.warn('광고 로드 중 오류 (정상적인 상황입니다):', e);
        }
      }
    };

    // 약간의 지연 후 광고 로드 시도
    const timer = setTimeout(loadAds, 1000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleSurveyComplete = async (responses) => {
    setLoading(true);
    try {
      const result = getRecommendations(responses, surveyMapping, racketData);
      
      // 설문 완료 추적
      const userLevel = result.userLabels?.level || 'unknown';
      const racketCategory = result.userLabels?.category || 'unknown';
      trackSurveyComplete(userLevel, racketCategory);
      
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
    trackSurveyStart();
    setCurrentStep('survey');
  };

  const handleCompareRackets = () => {
    trackRacketCompare(3); // 기본적으로 3개 라켓 비교
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
        <TitleLink href="https://bdmt.smallteras.com">
          <Title>배드민턴 라켓 추천 테스트</Title>
        </TitleLink>
        {/*<Subtitle>당신에게 맞는 최적의 라켓을 찾아보세요</Subtitle>*/}
      </Header>
      
      {/* 헤더 광고 */}
      <AdContainer style={{ marginBottom: '2rem' }}>
        <ins 
          ref={headerAdRef}
          className="adsbygoogle"
          style={{
            display: 'block', 
            textAlign: 'center',
            minHeight: '120px',
            width: '100%',
            maxWidth: '100%'
          }}
          data-ad-client="ca-pub-9588119791313794"
          data-ad-slot="3666030186"
          data-ad-format="auto"
          data-full-width-responsive="true"
          onClick={() => trackAdClick('header')}>
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
      <AdContainer style={{ marginTop: '4rem', marginBottom: '2rem' }}>
        <ins 
          ref={footerAdRef}
          className="adsbygoogle"
          style={{
            display: 'block', 
            textAlign: 'center',
            minHeight: '120px',
            width: '100%',
            maxWidth: '100%'
          }}
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