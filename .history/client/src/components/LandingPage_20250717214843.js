import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// 메인 컨테이너 (테스트 시작하기, 친구와 공유하기용)
const MainContainer = styled.div`
  max-width: 480px;
  margin: 40px auto;
  text-align: center;
`;

// 광고용 컨테이너 (최상단 광고용)
const AdContainer = styled.div`
  max-width: 1184px;
  margin: 40px auto;
  text-align: center;
  padding: 0 1rem;
`;

// 메인 카드 컨테이너
const MainCard = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 2em 1em;
  background: #f8fafe;
  border-radius: 2em;
  box-shadow: 0 8px 32px rgba(40,80,140,.05);
  margin-bottom: 1.5rem;
`;

// 수평 배치 컨테이너
const HorizontalContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin: 2em auto;
  width: 100%;
  max-width: 1184px;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    max-width: 480px;
  }
`;

// 추천 예시 카드
const ExampleCard = styled.div`
  background: ${props => props.$bg || '#f6fafc'};
  border-radius: 1.1em;
  box-shadow: 0 4px 16px #e2e6ee;
  padding: 1.8em 1.2em;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
  }
`;

const RacketImage = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const RacketType = styled.div`
  font-weight: bold;
  font-size: 1.3em;
  color: ${props => props.$color || '#2186eb'};
  margin-bottom: 0.5em;
  text-align: center;
`;

const RacketDescription = styled.div`
  font-size: 1.1em;
  color: #111;
  margin-bottom: 1em;
  text-align: center;
  line-height: 1.4;
`;

const RacketExample = styled.div`
  font-size: 1em;
  color: #888;
  text-align: center;
`;

// 사용자 후기 컨테이너
const ReviewsContainer = styled.div`
  padding: 1.8em 1.2em;
  background: #fff;
  border-radius: 1.1em;
  box-shadow: 0 4px 16px #e2e6ee;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
  }
`;

const ReviewsTitle = styled.h3`
  font-size: 1.3em;
  color: #333;
  margin: 0 0 1.2rem 0;
  font-weight: 600;
  text-align: center;
`;

const UserReviewItem = styled.div`
  font-size: 1.1em;
  color: #444;
  background: #f6f8fc;
  border-radius: 0.8em;
  padding: 0.8em 1em;
  margin-bottom: 0.8em;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  line-height: 1.4;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const UserName = styled.span`
  font-weight: bold;
  color: #333;
  font-size: 1.1em;
`;

const ReviewText = styled.span`
  color: ${props => props.$color || '#2186eb'};
  font-size: 1em;
  margin-top: 0.3em;
`;

const Description = styled.p`
  font-size: 1.1em;
  color: #5a5a5a;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
`;

const StartButton = styled.button`
  font-size: 1.3em;
  padding: 0.7em 2.5em;
  background: #25C3B0;
  color: #fff;
  border-radius: 1.3em;
  border: none;
  margin: 1.5em 0 0 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13);
  transition: 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }
`;

const ReviewSection = styled.div`
  margin-top: 1.2em;
  font-size: 0.98em;
  color: #999;
  line-height: 1.4;
`;

const ShareTitle = styled.div`
  margin: 1.5rem 0 1rem 0;
  color: #444;
  font-size: 1.1rem;
`;

const ShareRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  justify-content: center;
`;

const ShareCircle = styled.button`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  background: ${({$bg}) => $bg};
  border: none;
  cursor: pointer;
  &:hover {
    box-shadow: 0 4px 16px rgba(66,133,244,0.12);
    filter: brightness(0.95);
  }
`;

const URLButton = styled.button`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #6c63ff;
  color: #fff;
  font-weight: bold;
  font-size: 1.8rem;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(108,99,255,0.18);
    filter: brightness(0.95);
  }
`;

const CopiedMsg = styled.div`
  color: #6c63ff;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const KAKAO_IMG = process.env.PUBLIC_URL + '/kakao.webp';

export default function LandingPage({ onStart }) {
  const [copied, setCopied] = useState(false);
  const [randomReviews, setRandomReviews] = useState([]);

  // 사용자 후기 배열
  const allReviews = [
    "추천받은 라켓으로 경기력이 눈에 띄게 좋아졌어요. 다음에도 꼭 이용할 거예요!",
    "라켓이 가벼워서 스윙이 훨씬 부드러워졌어요. 손목 부담이 확 줄었네요.",
    "수비형 라켓 덕분에 랠리에서 실수가 확 줄었어요. 자신감도 생겼습니다.",
    "공격형 라켓이 생각보다 잘 맞아서 스매시 성공률이 높아졌어요!",
    "올라운드 라켓으로 바꾸고 친구들과의 게임이 더 재미있어졌어요.",
    "처음에는 반신반의했는데, 실제로 써보니 만족도가 높아요.",
    "초보자에게 맞는 라켓을 알려줘서 부담 없이 연습할 수 있었습니다.",
    "테스트 결과대로 라켓을 샀는데 그립감이 정말 좋네요.",
    "라켓 무게나 밸런스가 저랑 잘 맞아서 오랜 시간 쳐도 피곤하지 않아요.",
    "기존에 쓰던 라켓과 비교했을 때 훨씬 타구감이 부드럽습니다.",
    "여자 선수에게 추천된 제품이라고 해서 선택했는데 너무 만족스러워요.",
    "가성비 좋은 라켓을 추천받아 부담 없이 입문할 수 있었어요.",
    "내 스타일에 맞는 라켓을 찾아줘서 연습이 더 재미있어졌어요.",
    "라켓 바꾼 후 네트 플레이가 수월해져서 점점 실력이 느는 게 느껴집니다.",
    "딱 원하는 느낌의 라켓을 추천해줘서 감사합니다.",
    "게임할 때 힘이 덜 들어가고 정확도가 좋아진 느낌이에요.",
    "디자인도 예쁘고 기능도 좋아서 만족스러워요.",
    "서비스가 빨라서 금방 좋은 라켓을 찾을 수 있었습니다.",
    "라켓 고민만 하다가 테스트 한 번에 결정해서 편했어요!",
    "친구에게도 추천하고 싶은 서비스입니다. 덕분에 즐겁게 운동하고 있어요."
  ];

  // 랜덤 후기 선택 함수
  const getRandomReviews = () => {
    const shuffled = [...allReviews].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    // Kakao SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('b53d7f165df12a356594e4ffe8ba060f');
    }
    
    // 매번 새로운 랜덤 후기 설정
    setRandomReviews(getRandomReviews());
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시에만 실행

  const shareUrl = window.location.origin;
  const shareTitle = '배드민턴 라켓 추천 설문';
  const shareText = '설문을 통해 내게 맞는 배드민턴 라켓을 추천받아보세요!';

  // 공유 함수들
  const shareToKakao = () => {
    if (window.Kakao) {
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: shareTitle,
          description: shareText,
          imageUrl: `${shareUrl}/badminton-og-image.png`,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '테스트 시작하기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } else {
      // Kakao SDK가 없을 때 fallback
      window.open(`https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}&hashtags=배드민턴,라켓추천`, '_blank', 'width=600,height=400');
  };

  return (
    <>
      {/* 최상단 광고 섹션 */}
      <AdContainer>
        <MainCard>
          <Description>
            내 플레이 스타일에 딱 맞는 라켓,<br />
            <b>3분 만에 찾아드립니다!</b><br />
            지금 바로 시작해서 나만의 라켓을 찾아보세요.
          </Description>
          <StartButton onClick={onStart}>테스트 시작하기 🚀</StartButton>
          
          <ReviewSection>
            <span>실제 이용자 후기 ⭐⭐⭐⭐⭐</span><br />
            <span>"덕분에 딱 맞는 라켓 샀어요!"</span>
          </ReviewSection>
        </MainCard>
      </AdContainer>

      {/* 수평 배치 섹션 */}
      <HorizontalContainer>
        {/* 공격형 라켓 예시 카드 */}
        <ExampleCard $bg="#f6fafc">
          <RacketImage>🏸</RacketImage>
          <RacketType $color="#2186eb">공격형 라켓</RacketType>
          <RacketDescription>
            스매시 위주 플레이어에게<br />
            강력 추천!
          </RacketDescription>
          <RacketExample>
            추천 예시: <b>요넥스 아스트록스99</b>
          </RacketExample>
        </ExampleCard>

        {/* 수비형 라켓 예시 카드 */}
        <ExampleCard $bg="#f9f6fc">
          <RacketImage>🏸</RacketImage>
          <RacketType $color="#a340e2">수비형 라켓</RacketType>
          <RacketDescription>
            리턴 & 네트플레이에<br />
            최적화!
          </RacketDescription>
          <RacketExample>
            추천 예시: <b>비브라니엄 블레이드</b>
          </RacketExample>
        </ExampleCard>

        {/* 사용자 후기 카드 */}
        <ReviewsContainer>
          <ReviewsTitle>💬 실제 사용자들의 후기</ReviewsTitle>
          {randomReviews.map((review, index) => (
            <UserReviewItem key={index}>
              <UserName>익명{index + 1}님</UserName>
              <ReviewText $color="#2186eb">{review}</ReviewText>
            </UserReviewItem>
          ))}
        </ReviewsContainer>
      </HorizontalContainer>

      {/* 공유 카드 */}
      <MainContainer>
        <MainCard>
          <ShareTitle>친구와 함께 즐기기</ShareTitle>
          <ShareRow>
            {/* 카카오톡 */}
            <ShareCircle
              type="button"
              $bg="#ffe812"
              onClick={shareToKakao}
            >
              <img src={KAKAO_IMG} alt="카카오톡" style={{width:36, height:36, borderRadius:'50%'}} />
            </ShareCircle>
            {/* 페이스북 */}
            <ShareCircle
              type="button"
              $bg="#3b5998"
              onClick={shareToFacebook}
            >
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#3b5998"/>
                <text x="16" y="23" textAnchor="middle" fontWeight="bold" fontSize="20" fill="#fff" fontFamily="Arial">f</text>
              </svg>
            </ShareCircle>
            {/* 트위터 */}
            <ShareCircle
              type="button"
              $bg="#1da1f2"
              onClick={shareToTwitter}
            >
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#1da1f2"/>
                <path d="M29 10.5c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.5-1.7-.7.4-1.4.7-2.2.9-.7-.7-1.7-1.2-2.7-1.2-2.1 0-3.7 2-3.2 4-3-.1-5.7-1.6-7.5-3.8-.3.5-.5 1-.5 1.6 0 1.1.6 2.1 1.5 2.7-.6 0-1.1-.2-1.6-.4v.1c0 1.5 1.1 2.7 2.5 3-.3.1-.6.2-.9.2-.2 0-.4 0-.6-.1.4 1.2 1.6 2.1 3 2.1-1.1.9-2.5 1.4-4 1.4-.3 0-.6 0-.9-.1 1.4.9 3.1 1.5 4.9 1.5 5.9 0 9.1-4.9 9.1-9.1v-.4c.6-.4 1.1-1 1.5-1.6z" fill="#fff"/>
              </svg>
            </ShareCircle>
            {/* URL 복사 */}
            <URLButton onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}>URL</URLButton>
          </ShareRow>
          {copied && <CopiedMsg>URL이 복사되었습니다!</CopiedMsg>}
        </MainCard>
      </MainContainer>
    </>
  );
} 