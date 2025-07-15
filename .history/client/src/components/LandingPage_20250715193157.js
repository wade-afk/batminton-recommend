import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh; /* 높이를 절반으로 줄임 */
  background: #fff;
  max-width: 56.67%; /* 2/3 크기로 제한 */
  margin: 0 auto; /* 가운데 정렬 */
  padding: 2rem;
  border-radius: 20px; /* 모서리를 둥글게 */
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); /* 그림자 효과 추가 */

  @media (max-width: 768px) {
    max-width: 90%; /* 모바일에서는 90%로 조정 */
    padding: 1rem;
    min-height: 60vh; /* 모바일에서는 조금 더 높게 */
  }
`;

const VisitorCount = styled.div`
  color: #7b7b7b;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  span {
    color: #3578e5;
    font-weight: bold;
    font-size: 1.3rem;
  }
`;

const StartButton = styled.button`
  background: #4285f4;
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  border-radius: 2.5rem;
  padding: 1.2rem 4rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 16px rgba(66,133,244,0.08);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: #3578e5;
    transform: translateY(-2px);
  }
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
  const [visitorCount, setVisitorCount] = useState(76267); // 기본값으로 설정
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Kakao SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('b53d7f165df12a356594e4ffe8ba060f');
    }

    // 방문자 수 가져오기
    fetchVisitorCount();
  }, []);

  // 방문자 수 가져오기 함수
  const fetchVisitorCount = async () => {
    try {
      // 방문자 수 조회
      const response = await fetch('http://localhost:3001/api/visitor/count');
      const data = await response.json();
      
      if (data.success) {
        setVisitorCount(data.visitorCount);
        console.log('방문자 수 업데이트:', data.visitorCount);
      } else {
        console.warn('방문자 수 조회 실패:', data.message);
        setVisitorCount(76267);
      }
    } catch (error) {
      console.warn('방문자 수를 가져오는데 실패했습니다:', error);
      setVisitorCount(76267);
    }
  };

  // 방문자 수 증가 함수
  const incrementVisitorCount = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/visitor/increment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setVisitorCount(data.visitorCount);
        console.log('방문자 수 증가:', data.visitorCount);
      }
    } catch (error) {
      console.warn('방문자 수 증가 실패:', error);
    }
  };

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
    <Container>
      <VisitorCount>
        지금까지 <span>{visitorCount !== null ? visitorCount.toLocaleString() : '...'}</span>명이 참여하였습니다.
      </VisitorCount>
      <StartButton onClick={() => {
        incrementVisitorCount();
        onStart();
      }}>시작하기</StartButton>
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
    </Container>
  );
} 