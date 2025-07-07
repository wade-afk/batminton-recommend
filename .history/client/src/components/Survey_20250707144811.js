import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
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

function Survey({ onComplete, loading }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/survey-questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('질문 로드 중 오류:', error);
      }
    };
    fetchQuestions();
  }, []);

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
                style={{
                  borderColor: responses[currentQuestion] === option ? '#667eea' : '#e0e0e0',
                  background: responses[currentQuestion] === option ? '#f8f9ff' : 'white'
                }}
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
              disabled={!hasResponse}
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