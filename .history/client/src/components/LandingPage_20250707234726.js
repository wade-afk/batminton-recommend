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

const ShareCircle = styled.a`
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

function KakaoIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="19" fill="#FFE812"/>
      <ellipse cx="19" cy="17" rx="12" ry="8" fill="#3C1E1E"/>
      <rect x="13" y="22" width="12" height="4" rx="2" fill="#3C1E1E"/>
      <text x="19" y="20.5" textAnchor="middle" fontWeight="bold" fontSize="11" fill="#FFE812" fontFamily="Arial">TALK</text>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="19" fill="#3b5998"/>
      <text x="19" y="26" textAnchor="middle" fontWeight="bold" fontSize="24" fill="#fff" fontFamily="Arial">f</text>
    </svg>
  );
}
function TwitterIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="19" fill="#1da1f2"/>
      <text x="19" y="25" textAnchor="middle" fontWeight="bold" fontSize="20" fill="#fff" fontFamily="Arial">&#xF099;</text>
      <g>
        <path d="M29 14.5c-.6.3-1.2.5-1.9.6.7-.4 1.2-1 1.5-1.7-.7.4-1.4.7-2.2.9-.7-.7-1.7-1.2-2.7-1.2-2.1 0-3.7 2-3.2 4-3-.1-5.7-1.6-7.5-3.8-.3.5-.5 1-.5 1.6 0 1.1.6 2.1 1.5 2.7-.6 0-1.1-.2-1.6-.4v.1c0 1.5 1.1 2.7 2.5 3-.3.1-.6.2-.9.2-.2 0-.4 0-.6-.1.4 1.2 1.6 2.1 3 2.1-1.1.9-2.5 1.4-4 1.4-.3 0-.6 0-.9-.1 1.4.9 3.1 1.5 4.9 1.5 5.9 0 9.1-4.9 9.1-9.1v-.4c.6-.4 1.1-1 1.5-1.6z" fill="#fff"/>
      </g>
    </svg>
  );
}

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
  }, []);

  const shareUrl = window.location.origin;
  const shareText = encodeURIComponent('배드민턴 라켓 추천 테스트!');

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
          href={`https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          bg="#ffe812"
        >
          <span style={{fontWeight:'bold', color:'#3C1E1E', fontSize:'1.1rem'}}>TALK</span>
        </ShareCircle>
        {/* 페이스북 */}
        <ShareCircle
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          bg="#3b5998"
        >
          <span style={{fontWeight:'bold', fontSize:'1.5rem'}}>f</span>
        </ShareCircle>
        {/* 트위터 */}
        <ShareCircle
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