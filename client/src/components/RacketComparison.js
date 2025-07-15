import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ImageSlider from './ImageSlider';

const ComparisonContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  overflow-x: auto;
  box-sizing: border-box;

  /* 사이드바 광고가 나타날 때 본문이 겹치지 않도록 조정 */
  @media (min-width: 1400px) {
    max-width: calc(100% - 180px); /* 사이드바 공간을 줄여서 광고와 정확히 맞춤 */
    margin-right: 20px; /* 사이드바와의 간격 */
    margin-left: 55px; /* 왼쪽으로 50px 조정 */
  }

  @media (max-width: 900px) {
    padding: 1rem;
    margin: 0 0.5rem;
    width: calc(100% - 1rem);
  }
  @media (max-width: 600px) {
    padding: 0.5rem;
    border-radius: 12px;
    margin: 0 0.5rem;
    width: calc(100% - 1rem);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3개 라켓을 고정으로 배치 */
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr); /* 중간 크기에서는 2개씩 */
    gap: 1.5rem;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const RacketCard = styled.div`
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  word-break: keep-all;
  overflow-wrap: break-word;

  @media (max-width: 900px) {
    padding: 1rem;
  }
  @media (max-width: 600px) {
    padding: 0.7rem;
    border-radius: 8px;
    margin: 0 0.5rem;
    width: calc(100% - 1rem);
  }

  &:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
  }
`;

const RacketName = styled.h3`
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const Price = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 1rem;
  text-align: center;
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
  background: #f8f9ff;
  padding: 0.8rem;
  border-radius: 8px;
`;

const SpecLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.2rem;
  font-weight: 500;
`;

const SpecValue = styled.span`
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
`;

const Features = styled.div`
  background: #f8f9ff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const FeaturesTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

const FeaturesText = styled.div`
  font-size: 0.8rem;
  color: #666;
  line-height: 1.4;
`;

const ComparisonTable = styled.div`
  background: #f8f9ff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const TableTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Th = styled.th`
  background: #667eea;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.9rem;
  
  &:first-child {
    font-weight: 600;
    background: #f8f9ff;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
`;

const BackButton = styled(Button)`
  background: #f0f0f0;
  color: #666;
  
  &:hover {
    background: #e0e0e0;
    transform: translateY(-2px);
  }
`;

const SelectMoreButton = styled(Button)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

const NoRacketsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
`;

function RacketComparison({ selectedRackets, onBack, onSelectMore }) {
  const [imagesIndex, setImagesIndex] = useState(null);

  useEffect(() => {
    fetch('/images/index.json')
      .then(res => res.json())
      .then(setImagesIndex)
      .catch(() => setImagesIndex(null));
  }, []);

  const normalize = (str) => {
    return str
      .replace(/[^\w\d가-힣]/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  };

  const findBestFolder = (racketName, indexData) => {
    const norm = normalize(racketName);
    const keys = Object.keys(indexData);
    
    for (const k of keys) {
      if (norm === k) {
        return k;
      }
    }
    
    for (const k of keys) {
      if (indexData[k] && indexData[k].length > 0) {
        const folderName = indexData[k][0].split('/')[0];
        const normalizedFolderName = normalize(folderName);
        if (norm === normalizedFolderName) {
          return k;
        }
      }
    }
    
    for (const k of keys) {
      if (norm.includes(k) || k.includes(norm)) {
        return k;
      }
    }
    
    return null;
  };

  const formatPrice = (priceStr) => {
    if (!priceStr) return '가격 정보 없음';
    return priceStr.trim();
  };

  const formatFeatures = (features) => {
    if (!features) return '특징 정보 없음';
    return features.length > 150 ? features.substring(0, 150) + '...' : features;
  };

  if (!selectedRackets || selectedRackets.length === 0) {
    return (
      <ComparisonContainer>
        <NoRacketsMessage>
          <h3>비교할 라켓이 선택되지 않았습니다</h3>
          <p>라켓을 선택한 후 비교해보세요.</p>
          <ActionButtons>
            <SelectMoreButton onClick={onSelectMore}>
              라켓 선택하기
            </SelectMoreButton>
          </ActionButtons>
        </NoRacketsMessage>
      </ComparisonContainer>
    );
  }

  // 비교 테이블용 데이터 준비
  const comparisonData = [
    { label: '가격', key: '가격' },
    { label: '무게', key: '무게' },
    { label: '밸런스', key: '밸런스 포인트' },
    { label: '샤프트 유연성', key: '샤프트 유연성' },
    { label: '그립 사이즈', key: '그립 사이즈' },
    { label: '색상', key: '색상' },
    { label: '적정 장력', key: '적정 장력' },
    { label: '출시날짜', key: '출시날짜' },
    { label: '원산지', key: '원산지' }
  ];

  return (
    <ComparisonContainer>
      <Header>
        <Title>🏸 라켓 비교 🏸</Title>
        <Subtitle>선택한 라켓들의 상세 비교</Subtitle>
      </Header>

      {/* 라켓 카드들 */}
      <ComparisonGrid>
        {selectedRackets.map((racket, index) => {
          let images = [];
          if (imagesIndex) {
            const folderKey = findBestFolder(racket['종류'], imagesIndex);
            if (folderKey) {
              images = imagesIndex[folderKey].map(f => `/images/${f}`);
            }
          }
          
          return (
            <RacketCard key={index}>
              <RacketName>{racket['종류']}</RacketName>
              <Price>{formatPrice(racket['가격'])}</Price>
              
              <SpecsGrid>
                <SpecItem>
                  <SpecLabel>무게</SpecLabel>
                  <SpecValue>{racket['무게'] || '정보 없음'}</SpecValue>
                </SpecItem>
                <SpecItem>
                  <SpecLabel>밸런스</SpecLabel>
                  <SpecValue>{racket['밸런스 포인트'] || '정보 없음'}</SpecValue>
                </SpecItem>
                <SpecItem>
                  <SpecLabel>샤프트</SpecLabel>
                  <SpecValue>{racket['샤프트 유연성'] || '정보 없음'}</SpecValue>
                </SpecItem>
                <SpecItem>
                  <SpecLabel>그립</SpecLabel>
                  <SpecValue>{racket['그립 사이즈'] || '정보 없음'}</SpecValue>
                </SpecItem>
              </SpecsGrid>

              <Features>
                <FeaturesTitle>주요 특징</FeaturesTitle>
                <FeaturesText>{formatFeatures(racket['특징'])}</FeaturesText>
              </Features>

              {/* 이미지 슬라이더 */}
              {images.length > 0 && (
                <ImageSlider images={images} alt={racket['종류']} />
              )}
            </RacketCard>
          );
        })}
      </ComparisonGrid>

      {/* 비교 테이블 */}
      <ComparisonTable>
        <TableTitle>📊 상세 스펙 비교</TableTitle>
        <Table>
          <thead>
            <tr>
              <Th>스펙</Th>
              {selectedRackets.map((racket, index) => (
                <Th key={index}>{racket['종류']}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, rowIndex) => (
              <tr key={rowIndex}>
                <Td>{item.label}</Td>
                {selectedRackets.map((racket, colIndex) => (
                  <Td key={colIndex}>
                    {racket[item.key] || '정보 없음'}
                  </Td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </ComparisonTable>

      <ActionButtons>
        <BackButton onClick={onBack}>
          ← 이전으로
        </BackButton>
        <SelectMoreButton onClick={onSelectMore}>
          다른 라켓 선택하기
        </SelectMoreButton>
      </ActionButtons>
    </ComparisonContainer>
  );
}

export default RacketComparison; 