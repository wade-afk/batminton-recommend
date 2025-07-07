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
  gap: 2.5rem;
  margin-bottom: 2rem;
`;

const ShareCircle = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
  font-size: 2.1rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  background: ${({bg}) => bg};
  border: none;
  cursor: pointer;
  &:hover {
    box-shadow: 0 4px 16px rgba(66,133,244,0.12);
    filter: brightness(0.95);
  }
`;

const URLButton = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #6c63ff;
  color: #fff;
  font-weight: bold;
  font-size: 2.1rem;
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

export default function LandingPage({ onStart }) {
  const [visitorCount, setVisitorCount] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // countapi.xyz로 방문자 수 카운트
    fetch('https://api.countapi.xyz/hit/badminton-recommend/visits')
      .then(res => res.json())
      .then(data => {
        setVisitorCount(data.value);
      });
    // 카카오 SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('여기에_본인_카카오_JavaScript_키_입력');
    }
  }, []);

  const shareUrl = window.location.origin;
  const shareText = encodeURIComponent('배드민턴 라켓 추천 테스트!');

  const handleKakaoShare = () => {
    if (!window.Kakao) return;
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '배드민턴 라켓 추천 테스트!',
        description: '나에게 맞는 라켓을 찾아보세요!',
        imageUrl: window.location.origin + '/images/thumbnail.png', // 썸네일 없으면 임시로 도메인
        link: {
          mobileWebUrl: window.location.origin,
          webUrl: window.location.origin,
        },
      },
      buttons: [
        {
          title: '테스트 하러 가기',
          link: {
            mobileWebUrl: window.location.origin,
            webUrl: window.location.origin,
          },
        },
      ],
    });
  };

  return (
    <Container>
      <VisitorCount>
        지금까지 <span>{visitorCount !== null ? visitorCount.toLocaleString() : '...'}</span>명이 참여하였습니다.
      </VisitorCount>
      <StartButton onClick={onStart}>시작하기</StartButton>
      <ShareTitle>친구와 함께 즐기기</ShareTitle>
      <ShareRow>
        {/* 카카오톡 */}
        <ShareCircle
          type="button"
          bg="#ffe812"
          onClick={handleKakaoShare}
        >
          <span style={{fontWeight:'bold', color:'#3C1E1E', fontSize:'1.1rem'}}>TALK</span>
        </ShareCircle>
        {/* 페이스북 */}
        <ShareCircle
          as="a"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          bg="#3b5998"
        >
          <span style={{fontWeight:'bold', fontSize:'1.5rem'}}>f</span>
        </ShareCircle>
        {/* 트위터 */}
        <ShareCircle
          as="a"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          bg="#1da1f2"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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