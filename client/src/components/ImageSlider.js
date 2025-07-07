import React, { useState } from 'react';
import styled from 'styled-components';

const SliderContainer = styled.div`
  width: 100%;
  max-width: 320px;
  margin: 1rem auto 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SlideImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 10px;
  background: #f8f9ff;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.8);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  &:hover { background: #e0e0e0; }
`;

const PrevButton = styled(NavButton)`
  left: 0.5rem;
`;
const NextButton = styled(NavButton)`
  right: 0.5rem;
`;

const SlideIndicator = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`;

function ImageSlider({ images, alt }) {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;

  const goPrev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <SliderContainer>
      {images.length > 1 && <PrevButton onClick={goPrev} aria-label="이전 이미지">&#8592;</PrevButton>}
      <SlideImage src={images[current]} alt={alt || `라켓 이미지 ${current+1}`} />
      {images.length > 1 && <NextButton onClick={goNext} aria-label="다음 이미지">&#8594;</NextButton>}
      {images.length > 1 && <SlideIndicator>{current+1} / {images.length}</SlideIndicator>}
    </SliderContainer>
  );
}

export default ImageSlider; 