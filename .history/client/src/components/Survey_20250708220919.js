import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const SurveyContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 800px;
  margin: 0 auto;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const QuestionContainer = styled.div`
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const QuestionNumber = styled.div`
  font-size: 1.2rem;
  color: #667eea;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const QuestionText = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 2rem;
  line-height: 1.4;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
`;

const OptionButton = styled.button`
  padding: 1rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  line-height: 1.4;
  position: relative;

  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &.selected {
    border-color: #667eea;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }

  &.selected::after {
    content: '✓';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-weight: bold;
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
`;

const NavButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(NavButton)`
  background: #f0f0f0;
  color: #666;
  
  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
`;

const NextButton = styled(NavButton)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: white;
  font-size: 1.2rem;
  margin-top: 1rem;
`;

const MidAdContainer = styled.div`
  text-align: center;
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f9ff;
  border-radius: 12px;
  
  @media (max-width: 768px) {
    margin: 1rem 0;
    padding: 0.5rem;
  }
`;

function Survey({ onComplete, loading }) {
  const midAdRef = useRef(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [questions] = useState([
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
  ]);

  const handleOptionSelect = (option) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = option;
    setResponses(newResponses);
    
    // 자동으로 다음 질문으로 이동
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // 마지막 질문이면 추천 요청
        onComplete(newResponses);
      }
    }, 300); // 0.3초 후 다음 질문으로 이동
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 마지막 질문이면 추천 요청
      onComplete(responses);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const hasResponse = responses[currentQuestion];

  // 광고 로드
  useEffect(() => {
    if (window.adsbygoogle && midAdRef.current) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('광고 로드 중 오류:', e);
      }
    }
  }, [currentQuestion]);

  if (questions.length === 0) {
    return <div>질문을 불러오는 중...</div>;
  }

  return (
    <>
      {loading && (
        <LoadingOverlay>
          <div style={{ textAlign: 'center' }}>
            <LoadingSpinner />
            <LoadingText>최적의 라켓을 찾고 있습니다...</LoadingText>
          </div>
        </LoadingOverlay>
      )}
      
      <SurveyContainer>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>

        <QuestionContainer>
          <QuestionNumber>질문 {currentQuestion + 1} / {questions.length}</QuestionNumber>
          <QuestionText>{currentQ?.question}</QuestionText>
          
          <OptionsContainer>
                         {currentQ?.options.map((option, index) => (
               <OptionButton
                 key={index}
                 onClick={() => handleOptionSelect(option)}
                 className={responses[currentQuestion] === option ? 'selected' : ''}
               >
                 {option}
               </OptionButton>
             ))}
          </OptionsContainer>
        </QuestionContainer>

        <NavigationContainer>
          <PrevButton 
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            이전
          </PrevButton>
          
          {!hasResponse && (
            <NextButton 
              onClick={handleNext}
            >
              {currentQuestion === questions.length - 1 ? '추천받기' : '다음'}
            </NextButton>
          )}
        </NavigationContainer>
      </SurveyContainer>
    </>
  );
}

export default Survey; 