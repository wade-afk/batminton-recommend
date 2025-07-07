import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #fff;
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

const ShareIcon = styled.a`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(66,133,244,0.12);
  }
  img {
    width: 32px;
    height: 32px;
  }
`;

const URLButton = styled.button`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #6c63ff;
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(108,99,255,0.18);
  }
`;

const CopiedMsg = styled.div`
  color: #6c63ff;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const KAKAO_ICON = 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/kakaotalk.svg';
const FB_ICON = 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg';
const TW_ICON = 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const BASE_COUNT = 822674;

export default function LandingPage({ onStart }) {
  const [visitorCount, setVisitorCount] = useState(BASE_COUNT);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 방문자 수를 localStorage에 저장/불러오기 + 임의 증가
    let stored = localStorage.getItem('visitorCount');
    let count = stored ? parseInt(stored, 10) : BASE_COUNT;
    // 새로고침마다 1~5 랜덤 증가
    count += getRandomInt(1, 5);
    setVisitorCount(count);
    localStorage.setItem('visitorCount', count);
  }, []);

  const shareUrl = window.location.origin;
  const shareText = encodeURIComponent('배드민턴 라켓 추천 테스트!');

  return (
    <Container>
      <VisitorCount>
        지금까지 <span>{visitorCount.toLocaleString()}</span>명이 참여하였습니다.
      </VisitorCount>
      <StartButton onClick={onStart}>시작하기</StartButton>
      <ShareTitle>친구와 함께 즐기기</ShareTitle>
      <ShareRow>
        {/* 카카오톡 */}
        <ShareIcon href={`https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
          <img src={KAKAO_ICON} alt="카카오톡" style={{background:'#ffe812', borderRadius:'50%'}} />
        </ShareIcon>
        {/* 페이스북 */}
        <ShareIcon href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
          <img src={FB_ICON} alt="페이스북" />
        </ShareIcon>
        {/* 트위터 */}
        <ShareIcon href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`} target="_blank" rel="noopener noreferrer">
          <img src={TW_ICON} alt="트위터" />
        </ShareIcon>
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