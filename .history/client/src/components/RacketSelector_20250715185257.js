import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SelectorContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  overflow-x: auto;

  /* 사이드바 광고가 나타날 때 본문이 겹치지 않도록 조정 */
  @media (min-width: 1400px) {
    max-width: calc(100% - 180px); /* 사이드바 공간을 줄여서 광고와 정확히 맞춤 */
    margin-right: 20px; /* 사이드바와의 간격 */
    margin-left: 55px; /* 왼쪽으로 50px 조정 */
  }

  @media (max-width: 900px) {
    padding: 1rem;
  }
  @media (max-width: 600px) {
    padding: 0.5rem;
    border-radius: 12px;
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
  margin-bottom: 1rem;
`;

const SelectionInfo = styled.div`
  background: #f8f9ff;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const SelectionCount = styled.div`
  font-size: 1.1rem;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const SelectionText = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }

  &:hover {
    border-color: #667eea;
    color: #667eea;
  }

  &.active:hover {
    color: white;
  }
`;

const RacketsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const RacketCard = styled.div`
  background: white;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e0e0e0'};
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }

  ${props => props.selected && `
    background: #f8f9ff;
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  `}
`;

const SelectionBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
`;

const RacketName = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
  padding-right: 30px;
`;

const RacketPrice = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const RacketSpecs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const SpecItem = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const SpecLabel = styled.div`
  font-weight: 500;
  margin-bottom: 0.2rem;
`;

const SpecValue = styled.div`
  color: #333;
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

const CompareButton = styled(Button)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

function RacketSelector({ onCompare, onBack }) {
  const [rackets, setRackets] = useState([]);
  const [selectedRackets, setSelectedRackets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // CSV 파일에서 데이터 로드
    fetch('/data/rackets.json')
      .then(res => res.json())
      .then(data => {
        setRackets(data);
      })
      .catch(error => {
        console.error('라켓 데이터 로드 중 오류:', error);
        // 폴백 데이터 (기본적인 라켓들)
        const fallbackData = [
          { '종류': 'ARCSABER X7', ' 가격 ': '₩229,000', '밸런스 포인트': '올라운더형(Even balance)', '무게': '4U', '샤프트 유연성': 'Flexible', '특징': '올라운드형, 유연한 샤프트로 수비와 공격의 균형에 탁월함. 중상급자에게 적합.' },
          { '종류': 'ARCSABER 1', ' 가격 ': '₩159,000', '밸런스 포인트': '올라운더형(Even balance)', '무게': '4U', '샤프트 유연성': 'Stiff', '특징': '올라운드형, 정밀한 샷과 안정적인 수비에 유리. 단단한 샤프트.' },
          { '종류': 'ASTROX 99 PRO', ' 가격 ': '₩319,000', '밸런스 포인트': '공격형(Head heavy)', '무게': '4U', '샤프트 유연성': 'STIFF', '특징': '헤드헤비 스매시 특화 라켓. 공격 지향 최상급 모델.' },
          { '종류': 'NANOFLARE 1000Z', ' 가격 ': '₩339,000', '밸런스 포인트': '기술형(Head light)', '무게': '3U, 4U', '샤프트 유연성': 'Extra stiff', '특징': '기술형 최고급 모델. 스피드 드라이브 특화.' }
        ];
        setRackets(fallbackData);
      });
  }, []);

  const handleRacketSelect = (racket) => {
    const isSelected = selectedRackets.some(r => r['종류'] === racket['종류']);
    
    if (isSelected) {
      setSelectedRackets(selectedRackets.filter(r => r['종류'] !== racket['종류']));
    } else {
      if (selectedRackets.length < 3) {
        const newSelectedRackets = [...selectedRackets, racket];
        setSelectedRackets(newSelectedRackets);
        
        // 3개가 선택되면 자동으로 비교 화면으로 넘어감
        if (newSelectedRackets.length === 3) {
          setTimeout(() => {
            onCompare(newSelectedRackets);
          }, 500); // 0.5초 후 자동 이동 (선택 효과를 볼 수 있도록)
        }
      } else {
        alert('최대 3개까지만 선택할 수 있습니다.');
      }
    }
  };

  const handleCompare = () => {
    if (selectedRackets.length < 2) {
      alert('비교하려면 최소 2개의 라켓을 선택해주세요.');
      return;
    }
    onCompare(selectedRackets);
  };

  const filteredRackets = rackets.filter(racket => {
    const matchesSearch = racket['종류'].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'arcsaber' && racket['종류'].includes('ARCSABER')) ||
      (filterType === 'astrox' && racket['종류'].includes('ASTROX')) ||
      (filterType === 'nanoflare' && racket['종류'].includes('NANOFLARE'));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <SelectorContainer>
      <Header>
        <Title>🏸 라켓 선택 🏸</Title>
        <Subtitle>비교하고 싶은 라켓을 선택해주세요 (최대 3개)</Subtitle>
      </Header>

      <SelectionInfo>
        <SelectionCount>
          {selectedRackets.length}/3 라켓 선택됨
        </SelectionCount>
        <SelectionText>
          {selectedRackets.length === 3 
            ? '3개 선택 완료! 자동으로 비교 화면으로 이동합니다...' 
            : selectedRackets.length >= 2 
              ? '비교할 준비가 되었습니다!' 
              : '최소 2개를 선택해주세요.'}
        </SelectionText>
      </SelectionInfo>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="라켓 이름으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      <FilterContainer>
        <FilterButton
          className={filterType === 'all' ? 'active' : ''}
          onClick={() => setFilterType('all')}
        >
          전체
        </FilterButton>
        <FilterButton
          className={filterType === 'arcsaber' ? 'active' : ''}
          onClick={() => setFilterType('arcsaber')}
        >
          ARCSABER
        </FilterButton>
        <FilterButton
          className={filterType === 'astrox' ? 'active' : ''}
          onClick={() => setFilterType('astrox')}
        >
          ASTROX
        </FilterButton>
        <FilterButton
          className={filterType === 'nanoflare' ? 'active' : ''}
          onClick={() => setFilterType('nanoflare')}
        >
          NANOFLARE
        </FilterButton>
      </FilterContainer>

      <RacketsGrid>
        {filteredRackets.map((racket, index) => {
          const isSelected = selectedRackets.some(r => r['종류'] === racket['종류']);
          const selectionIndex = selectedRackets.findIndex(r => r['종류'] === racket['종류']);
          
          return (
            <RacketCard
              key={index}
              selected={isSelected}
              onClick={() => handleRacketSelect(racket)}
            >
              {isSelected && (
                <SelectionBadge>{selectionIndex + 1}</SelectionBadge>
              )}
              <RacketName>{racket['종류']}</RacketName>
                             <RacketPrice>{racket['가격']}</RacketPrice>
              <RacketSpecs>
                <SpecItem>
                  <SpecLabel>밸런스</SpecLabel>
                  <SpecValue>{racket['밸런스 포인트']}</SpecValue>
                </SpecItem>
                <SpecItem>
                  <SpecLabel>무게</SpecLabel>
                  <SpecValue>{racket['무게'] || '정보 없음'}</SpecValue>
                </SpecItem>
                <SpecItem>
                  <SpecLabel>샤프트</SpecLabel>
                  <SpecValue>{racket['샤프트 유연성'] || '정보 없음'}</SpecValue>
                </SpecItem>
                <SpecItem>
                  <SpecLabel>특징</SpecLabel>
                  <SpecValue>{racket['특징'].substring(0, 30)}...</SpecValue>
                </SpecItem>
              </RacketSpecs>
            </RacketCard>
          );
        })}
      </RacketsGrid>

      <ActionButtons>
        <BackButton onClick={onBack}>
          ← 이전으로
        </BackButton>
        <CompareButton 
          onClick={handleCompare}
          disabled={selectedRackets.length < 2}
        >
          ⚖️ 라켓 비교하기 ({selectedRackets.length}개)
        </CompareButton>
      </ActionButtons>
    </SelectorContainer>
  );
}

export default RacketSelector; 