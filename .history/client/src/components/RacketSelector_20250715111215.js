import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SelectorContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 100vw;
  margin: 0 auto;
  width: 100%;
  overflow-x: auto;

  @media (max-width: 900px) {
    padding: 1rem;
  }
  @media (max-width: 600px) {
    padding: 0.5rem;
    border-radius: 0;
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

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
    // CSV 데이터를 직접 하드코딩 (43개 라켓)
    const racketData = [
      { '종류': 'ARCSABER X7', ' 가격 ': '₩229,000', '밸런스 포인트': '올라운더형(Even balance)', '무게': '4U', '샤프트 유연성': 'Flexible', '특징': '올라운드형, 유연한 샤프트로 수비와 공격의 균형에 탁월함. 중상급자에게 적합.' },
      { '종류': 'ARCSABER 1', ' 가격 ': '₩159,000', '밸런스 포인트': '올라운더형(Even balance)', '무게': '4U', '샤프트 유연성': 'Stiff', '특징': '올라운드형, 정밀한 샷과 안정적인 수비에 유리. 단단한 샤프트.' },
      { '종류': 'ARCSABER 7 PLAY', ' 가격 ': '₩57,000', '밸런스 포인트': '올라운더형(Even balance)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '입문자용 올라운드 라켓. 편안한 조작성과 부드러운 타구감.' },
      { '종류': 'ARCSABER 7 PRO', ' 가격 ': '₩270,000', '밸런스 포인트': '올라운더형(Even balance)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '중급자용 올라운드 라켓. 정밀한 타구와 안정적인 샷 컨트롤.' },
      { '종류': 'ARCSABER 7 TOUR', ' 가격 ': '₩149,000', '밸런스 포인트': '올라운더형(Even balance)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '올라운드 플레이어용 중상급자 모델. 안정성, 반발력 우수.' },
      { '종류': 'ARCSABER 11 PLAY', ' 가격 ': '₩80,750', '밸런스 포인트': '올라운더형(Even balance)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '올라운드형. 부드러운 샤프트로 입문자에게 적합.' },
      { '종류': 'ARCSABER 11 PRO', ' 가격 ': '₩299,000', '밸런스 포인트': '올라운더형(Even balance)', '무게': '4U', '샤프트 유연성': 'Stiff', '특징': '정밀 타격 중심의 상급자용 올라운드 라켓. 단단한 샤프트.' },
      { '종류': 'ARCSABER 11 TOUR', ' 가격 ': '₩189,000', '밸런스 포인트': '올라운더형(Even balance)', '무게': '4U', '샤프트 유연성': 'Stiff', '특징': '정확한 샷 구사에 적합한 올라운드 중상급용 라켓.' },
      { '종류': 'NANOFLARE E13', ' 가격 ': '₩46,550', '밸런스 포인트': '레저용 라켓', '무게': '', '샤프트 유연성': '', '특징': '레저용 경량 라켓. 초보자 및 가벼운 사용감 선호자에게 적합.' },
      { '종류': 'ASTROX E13', ' 가격 ': '₩49,000', '밸런스 포인트': '레저용 라켓', '무게': '3U', '샤프트 유연성': '', '특징': '헤드헤비형 입문자용 라켓. 가벼우면서 스매시 성능 우수.' },
      { '종류': 'ASTROX 77 PLAY', ' 가격 ': '₩65,550', '밸런스 포인트': '공격형(Head heavy)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '공격형 헤드헤비 라켓. 입문~중급 복식 사용자에 적합.' },
      { '종류': 'NANOFLARE 001 ABILITY (2025 MODEL)', ' 가격 ': '₩69,350', '밸런스 포인트': '레저용 라켓', '무게': '5U', '샤프트 유연성': 'HI-FLEX', '특징': '헤드라이트형, 빠른 반응과 컨트롤 중심 입문용 라켓.' },
      { '종류': 'NANOFLARE 001 CLEAR (2025 MODEL)', ' 가격 ': '₩69,350', '밸런스 포인트': '레저용 라켓', '무게': '5U', '샤프트 유연성': 'HI-FLEX', '특징': '가볍고 부드러운 샷을 원하는 입문자에게 적합.' },
      { '종류': 'NANOFLARE 001 FEEL (2025 MODEL)', ' 가격 ': '₩69,350', '밸런스 포인트': '레저용 라켓', '무게': '5U', '샤프트 유연성': 'HI-FLEX', '특징': '부드러운 타구감 강조한 헤드라이트 라켓.' },
      { '종류': 'NANOFLARE 800 PLAY (2023)', ' 가격 ': '₩75,050', '밸런스 포인트': '기술형(Head light)', '무게': '4U', '샤프트 유연성': 'Stiff', '특징': '스피드 중심 기술형 라켓. 빠른 드라이브와 반응속도 우수.' },
      { '종류': 'NANOFLARE 700 PLAY (2024)', ' 가격 ': '₩75,050', '밸런스 포인트': '기술형(Head light)', '무게': '4U', '샤프트 유연성': 'Flexible', '특징': '헤드라이트형, 부드러운 샤프트. 리시브와 반응속도에 강점.' },
      { '종류': 'NANOFLARE 1000 PLAY', ' 가격 ': '₩94,050', '밸런스 포인트': '기술형(Head light)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '빠른 스윙과 스피드 공격에 적합한 헤드라이트형 라켓.' },
      { '종류': 'NANOFLARE 270 (2022 MODEL)', ' 가격 ': '₩130,000', '밸런스 포인트': '기술형(Head light)', '무게': '4U, 5U', '샤프트 유연성': 'Medium', '특징': '가볍고 유연한 라켓으로 초보자 및 여성 유저에게 적합.' },
      { '종류': 'ASTROX 88D GAME (2024)', ' 가격 ': '₩135,000', '밸런스 포인트': '공격형(Head heavy)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '공격형 헤드헤비. 후위 중심의 스매시 플레이어용.' },
      { '종류': 'ASTROX 88S GAME (2024)', ' 가격 ': '₩135,000', '밸런스 포인트': '공격형(Head heavy)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '네트 플레이와 중간 거리 대응이 좋은 올라운드 라켓.' },
      { '종류': 'ASTROX 22LT (2023)', ' 가격 ': '₩139,000', '밸런스 포인트': '공격형(Head heavy)', '무게': '3F', '샤프트 유연성': 'STIFF', '특징': '경량 스매시 라켓. 빠른 손목 사용과 공격 전환에 용이.' },
      { '종류': 'NANOFLARE 370 (2022 MODEL)', ' 가격 ': '₩139,000', '밸런스 포인트': '기술형(Head light)', '무게': '4U, 5U', '샤프트 유연성': 'Stiff', '특징': '기술형 헤드라이트. 빠른 리턴과 컨트롤 중시 플레이에 적합.' },
      { '종류': 'NANOFLARE 700 GAME (2024)', ' 가격 ': '₩145,000', '밸런스 포인트': '기술형(Head light)', '무게': '4U', '샤프트 유연성': 'Flexible', '특징': '헤드라이트, 중간 강도의 샤프트. 반응 빠른 복식용 라켓.' },
      { '종류': 'NANOFLARE 160FX', ' 가격 ': '₩153,154', '밸런스 포인트': '기술형(Head light)', '무게': '4U, 5U', '샤프트 유연성': 'Flexible', '특징': '가벼운 무게와 부드러운 타구감으로 초보자에게 적합.' },
      { '종류': 'ASTROX 11', ' 가격 ': '₩159,000', '밸런스 포인트': '공격형(Head heavy)', '무게': '4U', '샤프트 유연성': '', '특징': '공격형 헤드헤비. 단단한 샤프트와 빠른 스매시 전환에 특화.' },
      { '종류': 'ASTROX 77 TOUR', ' 가격 ': '₩159,000', '밸런스 포인트': '공격형(Head heavy)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '중상급용 헤드헤비 라켓. 파워와 회복력의 균형 강조.' },
      { '종류': 'NANOFLARE 111', ' 가격 ': '₩159,000', '밸런스 포인트': '기술형(Head light)', '무게': '4U', '샤프트 유연성': 'Flexible', '특징': '기술형 스피드 라켓. 고탄성 샤프트로 빠른 반응.' },
      { '종류': 'NANOFLARE 1000 GAME', ' 가격 ': '₩179,000', '밸런스 포인트': '기술형(Head light)', '무게': '3U, 4U', '샤프트 유연성': 'Medium', '특징': '강한 반발력과 가벼운 조작감이 특징인 기술형 라켓.' },
      { '종류': 'NANOFLARE 800 TOUR (2023)', ' 가격 ': '₩185,000', '밸런스 포인트': '기술형(Head light)', '무게': '4U', '샤프트 유연성': 'Stiff', '특징': '상급용 기술형 라켓. 빠른 드라이브와 반응 속도 탁월.' },
      { '종류': 'NANOFLARE 700 TOUR (2024)', ' 가격 ': '₩189,000', '밸런스 포인트': '기술형(Head light)', '무게': '4U,5U', '샤프트 유연성': 'Medium', '특징': '중상급자용 빠른 리턴용 라켓. 탄력 있는 타구감.' },
      { '종류': 'NANOFLARE 555 MATW 4U5', ' 가격 ': '₩189,000', '밸런스 포인트': '기술형(Head light)', '무게': '4U', '샤프트 유연성': 'Stiff', '특징': '기술형 라켓. 부드러운 스윙감과 균형 잡힌 반발력.' },
      { '종류': 'ASTROX NEXTAGE (2025)', ' 가격 ': '₩199,000', '밸런스 포인트': '공격형(Head heavy)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '중상급자용 헤드헤비. 스매시 파워와 안정성 조화.' },
      { '종류': 'ASTROX NEXTAGE (2023)', ' 가격 ': '₩199,000', '밸런스 포인트': '공격형(Head heavy)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '공격형 플레이어용. 강한 타구력과 빠른 회복력.' },
      { '종류': 'ASTROX 22RX', ' 가격 ': '₩199,000', '밸런스 포인트': '공격형(Head heavy)', '무게': '2F', '샤프트 유연성': 'STIFF', '특징': '고반발 단단한 샤프트. 상급자용 파워 공격 라켓.' },
      { '종류': 'NANOFLARE NEXTAGE (2025)', ' 가격 ': '₩199,000', '밸런스 포인트': '기술형(Head light)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '기술형 고탄성 라켓. 빠른 드라이브와 컨트롤에 적합.' },
      { '종류': 'NANOFLARE NEXTAGE (2024)', ' 가격 ': '₩199,000', '밸런스 포인트': '기술형(Head light)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '헤드라이트 고반발 라켓. 리시브와 스피드 플레이 특화.' },
      { '종류': 'ASTROX 77 PRO', ' 가격 ': '₩265,050', '밸런스 포인트': '공격형(Head heavy)', '무게': '4U', '샤프트 유연성': 'Medium', '특징': '공격형 상급자 라켓. 타구의 집중력과 스매시 파워 우수.' },
      { '종류': 'NANOFLARE 700 PRO (2024)', ' 가격 ': '₩305,000', '밸런스 포인트': '기술형(Head light)', '무게': '4U,5U', '샤프트 유연성': 'Medium', '특징': '고급 기술형 라켓. 빠르고 정밀한 스윙 중심.' },
      { '종류': 'ASTROX 88S PRO (2024)', ' 가격 ': '₩309,000', '밸런스 포인트': '공격형(Head heavy)', '무게': '3U, 4U', '샤프트 유연성': 'Stiff', '특징': '전위 플레이 특화. 빠른 반응과 정밀 샷 중심.' },
      { '종류': 'ASTROX 88D PRO (2024)', ' 가격 ': '₩309,000', '밸런스 포인트': '공격형(Head heavy)', '무게': '3U, 4U', '샤프트 유연성': 'Stiff', '특징': '후위 공격수용. 강력한 스매시 타구 중심 설계.' },
      { '종류': 'NANOFLARE 800 PRO (2023)', ' 가격 ': '₩310,000', '밸런스 포인트': '기술형(Head light)', '무게': '4U', '샤프트 유연성': 'Stiff', '특징': '초경량 기술형 라켓. 스피드와 반발력 극대화.' },
      { '종류': 'ASTROX 99 PRO', ' 가격 ': '₩319,000', '밸런스 포인트': '공격형(Head heavy)', '무게': '4U', '샤프트 유연성': 'STIFF', '특징': '헤드헤비 스매시 특화 라켓. 공격 지향 최상급 모델.' },
      { '종류': 'NANOFLARE 1000Z', ' 가격 ': '₩339,000', '밸런스 포인트': '기술형(Head light)', '무게': '3U, 4U', '샤프트 유연성': 'Extra stiff', '특징': '기술형 최고급 모델. 스피드 드라이브 특화.' }
    ];
    setRackets(racketData);
  }, []);

  const handleRacketSelect = (racket) => {
    const isSelected = selectedRackets.some(r => r['종류'] === racket['종류']);
    
    if (isSelected) {
      setSelectedRackets(selectedRackets.filter(r => r['종류'] !== racket['종류']));
    } else {
      if (selectedRackets.length < 3) {
        setSelectedRackets([...selectedRackets, racket]);
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
        <Title>🏸 라켓 선택</Title>
        <Subtitle>비교하고 싶은 라켓을 선택해주세요 (최대 3개)</Subtitle>
      </Header>

      <SelectionInfo>
        <SelectionCount>
          {selectedRackets.length}/3 라켓 선택됨
        </SelectionCount>
        <SelectionText>
          {selectedRackets.length >= 2 ? '비교할 준비가 되었습니다!' : '최소 2개를 선택해주세요.'}
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
              <RacketPrice>{racket[' 가격 ']}</RacketPrice>
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