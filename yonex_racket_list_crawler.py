import requests
from bs4 import BeautifulSoup
import os
import time
from urllib.parse import urljoin, urlparse
import re

def create_directory(directory):
    """디렉토리가 없으면 생성"""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"디렉토리 생성: {directory}")

def clean_filename(filename):
    """파일명에서 사용할 수 없는 문자 제거"""
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    filename = filename.replace(' ', '_')
    return filename

def download_image(url, filename, save_dir):
    """이미지 다운로드"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        filepath = os.path.join(save_dir, filename)
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"다운로드 완료: {filename}")
        return True
    except Exception as e:
        print(f"다운로드 실패 {filename}: {e}")
        return False

def get_product_name_from_text(text):
    """텍스트에서 상품명 추출"""
    # 가격 정보 제거
    text = re.sub(r'권장소비자가 대비 \d+,?\d* \d+,?\d*', '', text)
    text = re.sub(r'~~\d+,?\d*~~ \d+,?\d*', '', text)
    text = re.sub(r'\d+,?\d*', '', text)
    
    # 불필요한 문자 제거
    text = text.strip()
    text = re.sub(r'[^\w\s\-\(\)]', '', text)
    
    return text.strip()

def extract_racket_names_from_page():
    """요넥스 배드민턴 페이지에서 라켓 이름 추출"""
    
    url = "https://www.yonexmall.com/m2/goods/list.php?category=001001"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.yonexmall.com/',
    }
    
    try:
        print("요넥스 배드민턴 페이지에서 라켓 이름 추출 중...")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 라켓 이름이 포함된 텍스트 찾기
        racket_names = []
        
        # 모든 텍스트에서 라켓 이름 패턴 찾기
        text_content = soup.get_text()
        
        # 라켓 이름 패턴들
        patterns = [
            r'([A-Z]+\s+\d+[A-Z]*\s*\([^)]*\))',
            r'([A-Z]+\s+\d+[A-Z]*\s+[A-Z]+)',
            r'([A-Z]+\s+\d+[A-Z]*)',
            r'([A-Z]+\s+[A-Z]+\s+\d+)',
            r'([A-Z]+\s+\d+)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text_content)
            for match in matches:
                if match not in racket_names and len(match) > 3:
                    racket_names.append(match)
        
        print(f"발견된 라켓 이름: {len(racket_names)}개")
        for name in racket_names:
            print(f"  - {name}")
        
        return racket_names
        
    except Exception as e:
        print(f"라켓 이름 추출 중 오류: {e}")
        return []

def crawl_racket_images():
    """라켓 이미지 크롤링"""
    
    # 제공된 라켓 이름 목록
    racket_names = [
        "B4000 세트 (2025)",
        "ARCSABER X7",
        "ASTROX NEXTAGE (2025)",
        "NANOFLARE 001 ABILITY (2025 MODEL)",
        "NANOFLARE 001 CLEAR (2025 MODEL)",
        "NANOFLARE 001 FEEL (2025 MODEL)",
        "NANOFLARE 700 GAME (2024)",
        "NANOFLARE 700 PLAY (2024)",
        "NANOFLARE 700 TOUR (2024)",
        "ARCSABER 1",
        "ASTROX 11",
        "NANOFLARE 111",
        "ASTROX 88D GAME (2024)",
        "NANOFLARE NEXTAGE (2024)",
        "NANOFLARE 1000 GAME",
        "NANOFLARE 800 PLAY (2023)",
        "NANOFLARE 800 TOUR (2023)",
        "B7000MDM (온라인 전용)",
        "MP5LT (온라인 전용)",
        "MP8LT (온라인 전용)",
        "NANOFLARE E13",
        "ASTROX NEXTAGE (2023)",
        "ASTROX 22RX",
        "ASTROX 77 PLAY (온라인 전용)",
        "ASTROX 77 PRO",
        "ASTROX 77 TOUR (온라인 전용)",
        "ARCSABER 7 PLAY (온라인 전용) GR/Y 4U5",
        "ARCSABER 7 PRO GR/Y 4U5",
        "ARCSABER 7 TOUR (온라인 전용) GR/Y 4U5",
        "MUSCLE POWER 1 (온라인 전용) BL, OR 0U4",
        "ARCSABER 11 PLAY (온라인 전용) GRPR 4U5",
        "ARCSABER 11 TOUR (온라인 전용) GRPR 4U5",
        "NANOFLARE 555 MATW 4U5",
        "NANOFLARE 270 (2022 MODEL)(온라인 전용) PU",
        "NANOFLARE 370 (2022 MODEL)(온라인 전용) BL 4U5",
        "ASTROX 99 PRO 3U, 4U 2021년 신상품",
        "NANOFLARE 160FX"
    ]
    
    # 저장 디렉토리 설정
    save_dir = "images"
    create_directory(save_dir)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.yonexmall.com/',
    }
    
    # 상품 번호 범위 (실제로는 더 넓은 범위를 시도할 수 있음)
    goodsno_range = range(7000, 8000)  # 7000-7999
    categories = ["001001", "001"]
    
    total_downloaded = 0
    
    for racket_name in racket_names:
        print(f"\n=== {racket_name} 검색 중 ===")
        
        # 상품명에서 키워드 추출
        keywords = racket_name.split()
        main_keyword = keywords[0]  # 첫 번째 단어 (예: NANOFLARE, ASTROX)
        
        found = False
        
        for category in categories:
            if found:
                break
                
            for goodsno in goodsno_range:
                try:
                    detail_url = f"https://www.yonexmall.com/m2/goods/view.php?category={category}&goodsno={goodsno}"
                    
                    print(f"  시도: {detail_url}")
                    
                    response = requests.get(detail_url, headers=headers, timeout=10)
                    response.raise_for_status()
                    response.encoding = 'utf-8'
                    
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # 페이지 제목에서 라켓 이름 확인
                    title = soup.find('title')
                    if title:
                        title_text = title.get_text()
                        if any(keyword in title_text for keyword in keywords):
                            print(f"  매칭 발견: {title_text}")
                            
                            # 라켓 이미지 찾기
                            racket_images = soup.find_all('img', src=re.compile(r'/shop/data/goods/.*\.(png|jpg|jpeg)'))
                            
                            if racket_images:
                                # 첫 번째 이미지만 다운로드 (대표 이미지)
                                img = racket_images[0]
                                img_src = img.get('src')
                                
                                if img_src:
                                    img_url = urljoin(detail_url, img_src)
                                    
                                    # 파일명 생성
                                    clean_name = clean_filename(racket_name)
                                    file_extension = os.path.splitext(urlparse(img_url).path)[1] or '.png'
                                    filename = f"{clean_name}{file_extension}"
                                    
                                    print(f"  이미지 다운로드: {img_url}")
                                    
                                    # 이미지 다운로드
                                    if download_image(img_url, filename, save_dir):
                                        total_downloaded += 1
                                        found = True
                                        break
                            
                            time.sleep(0.5)
                    
                    time.sleep(0.3)  # 요청 간 딜레이
                    
                except Exception as e:
                    print(f"  상품 {goodsno} 처리 중 오류: {e}")
                    continue
            
            if found:
                break
        
        if not found:
            print(f"  {racket_name}을 찾을 수 없습니다.")
    
    print(f"\n크롤링 완료!")
    print(f"총 {total_downloaded}개 이미지 다운로드 완료")
    print(f"저장 위치: {os.path.abspath(save_dir)}")

def crawl_specific_products():
    """특정 상품 번호들로 직접 시도"""
    
    # 실제 상품 번호들 (제공된 정보 기반)
    known_products = [
        {"goodsno": 7342, "name": "NANOFLARE 001 ABILITY (2025 MODEL)"},
        {"goodsno": 7713, "name": "NANOFLARE 800 PRO (2023)"},
        # 추가 상품 번호들...
    ]
    
    save_dir = "images"
    create_directory(save_dir)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.yonexmall.com/',
    }
    
    total_downloaded = 0
    
    for product in known_products:
        try:
            goodsno = product["goodsno"]
            racket_name = product["name"]
            
            detail_url = f"https://www.yonexmall.com/m2/goods/view.php?category=001001&goodsno={goodsno}"
            
            print(f"\n=== {racket_name} (상품번호: {goodsno}) ===")
            
            response = requests.get(detail_url, headers=headers, timeout=10)
            response.raise_for_status()
            response.encoding = 'utf-8'
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 라켓 이미지 찾기
            racket_images = soup.find_all('img', src=re.compile(r'/shop/data/goods/.*\.(png|jpg|jpeg)'))
            
            if racket_images:
                # 첫 번째 이미지만 다운로드
                img = racket_images[0]
                img_src = img.get('src')
                
                if img_src:
                    img_url = urljoin(detail_url, img_src)
                    
                    # 파일명 생성
                    clean_name = clean_filename(racket_name)
                    file_extension = os.path.splitext(urlparse(img_url).path)[1] or '.png'
                    filename = f"{clean_name}{file_extension}"
                    
                    print(f"  이미지 다운로드: {img_url}")
                    
                    # 이미지 다운로드
                    if download_image(img_url, filename, save_dir):
                        total_downloaded += 1
            else:
                print(f"  이미지를 찾을 수 없습니다.")
            
            time.sleep(0.5)
            
        except Exception as e:
            print(f"  상품 {goodsno} 처리 중 오류: {e}")
            continue
    
    print(f"\n특정 상품 크롤링 완료!")
    print(f"총 {total_downloaded}개 이미지 다운로드 완료")
    print(f"저장 위치: {os.path.abspath(save_dir)}")

if __name__ == "__main__":
    print("요넥스 라켓 이미지 크롤러 시작...")
    
    # 1. 특정 상품 번호로 시도
    print("1. 알려진 상품 번호로 크롤링")
    crawl_specific_products()
    
    # 2. 라켓 이름 목록으로 검색
    print("\n2. 라켓 이름 목록으로 검색")
    crawl_racket_images() 