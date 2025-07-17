import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// 메인 컨테이너
const MainContainer = styled.div`
  max-width: 480px;
  margin: 40px auto;
  text-align: center;
`;

// 메인 카드 컨테이너
const MainCard = styled.div`
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
  width: 350px;
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
  width: 350px;
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

  useEffect(() => {
    // Kakao SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('b53d7f165df12a356594e4ffe8ba060f');
    }
  }, []);

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
    <MainContainer>
      {/* 메인 카드 */}
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
          <UserReviewItem>
            <UserName>김**님</UserName>
            <ReviewText $color="#2186eb">공격형 라켓 추천받음! 🏸</ReviewText>
          </UserReviewItem>
          <UserReviewItem>
            <UserName>이**님</UserName>
            <ReviewText $color="#a340e2">수비형 라켓 추천받음! 🏸</ReviewText>
          </UserReviewItem>
          <UserReviewItem>
            <UserName>박**님</UserName>
            <ReviewText $color="#25C3B0">올라운드 라켓 추천받음! 🏸</ReviewText>
          </UserReviewItem>
        </ReviewsContainer>
      </HorizontalContainer>

      {/* 공유 카드 */}
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
  );
} 