import requests
from bs4 import BeautifulSoup
import re
import json
import time
from urllib.parse import urljoin

def find_product_numbers():
    """요넥스 사이트에서 상품 번호와 상품명을 찾아서 매핑"""
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.yonexmall.com/',
    }
    
    products = []
    
    # 상품 번호 범위를 넓게 설정
    goodsno_range = range(7000, 8000)
    categories = ["001001", "001"]
    
    print("요넥스 상품 번호와 상품명 매핑 중...")
    
    for category in categories:
        print(f"카테고리 {category} 검색 중...")
        
        for goodsno in goodsno_range:
            try:
                detail_url = f"https://www.yonexmall.com/m2/goods/view.php?category={category}&goodsno={goodsno}"
                
                response = requests.get(detail_url, headers=headers, timeout=5)
                
                if response.status_code == 200:
                    response.encoding = 'utf-8'
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # 페이지 제목에서 상품명 추출
                    title = soup.find('title')
                    if title:
                        title_text = title.get_text().strip()
                        
                        # 배드민턴 라켓 관련 키워드 확인
                        racket_keywords = ['NANOFLARE', 'ASTROX', 'ARCSABER', 'MUSCLE POWER', 'B4000', 'B7000', 'MP5', 'MP8']
                        
                        if any(keyword in title_text for keyword in racket_keywords):
                            print(f"  발견: {goodsno} - {title_text}")
                            
                            products.append({
                                "goodsno": goodsno,
                                "category": category,
                                "name": title_text,
                                "url": detail_url
                            })
                
                time.sleep(0.2)  # 요청 간 딜레이
                
            except Exception as e:
                continue
    
    # 결과를 JSON 파일로 저장
    with open('yonex_products.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    print(f"\n총 {len(products)}개 상품 발견")
    print("결과가 yonex_products.json 파일에 저장되었습니다.")
    
    return products

def find_product_links_from_list():
    """상품 목록 페이지에서 상품 링크들 추출"""
    
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
        print("요넥스 배드민턴 상품 목록 페이지에서 링크 추출 중...")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 상품 링크 찾기
        product_links = []
        
        # 모든 링크에서 상품 상세 페이지 패턴 찾기
        links = soup.find_all('a', href=re.compile(r'goods/view\.php'))
        
        for link in links:
            href = link.get('href')
            if href:
                # goodsno 추출
                match = re.search(r'goodsno=(\d+)', href)
                if match:
                    goodsno = match.group(1)
                    
                    # 상품명 추출 (링크 텍스트 또는 부모 요소에서)
                    product_name = link.get_text().strip()
                    if not product_name:
                        # 부모 요소에서 상품명 찾기
                        parent = link.parent
                        if parent:
                            product_name = parent.get_text().strip()
                    
                    if product_name:
                        product_links.append({
                            "goodsno": goodsno,
                            "name": product_name,
                            "url": urljoin(url, href)
                        })
                        print(f"  발견: {goodsno} - {product_name}")
        
        # 결과를 JSON 파일로 저장
        with open('yonex_product_links.json', 'w', encoding='utf-8') as f:
            json.dump(product_links, f, ensure_ascii=False, indent=2)
        
        print(f"\n총 {len(product_links)}개 상품 링크 발견")
        print("결과가 yonex_product_links.json 파일에 저장되었습니다.")
        
        return product_links
        
    except Exception as e:
        print(f"상품 링크 추출 중 오류: {e}")
        return []

def test_specific_products():
    """특정 상품 번호들로 테스트"""
    
    test_products = [
        {"goodsno": 7713, "name": "NANOFLARE 800 PRO (2023)"},
        {"goodsno": 7342, "name": "NANOFLARE 001 ABILITY (2025 MODEL)"},
        {"goodsno": 7343, "name": "NANOFLARE 001 CLEAR (2025 MODEL)"},
        {"goodsno": 7344, "name": "NANOFLARE 001 FEEL (2025 MODEL)"},
        {"goodsno": 7345, "name": "NANOFLARE 700 GAME (2024)"},
        {"goodsno": 7346, "name": "NANOFLARE 700 PLAY (2024)"},
        {"goodsno": 7347, "name": "NANOFLARE 700 TOUR (2024)"},
        {"goodsno": 7348, "name": "ARCSABER 1"},
        {"goodsno": 7349, "name": "ASTROX 11"},
        {"goodsno": 7350, "name": "NANOFLARE 111"},
        {"goodsno": 7351, "name": "ASTROX 88D GAME (2024)"},
        {"goodsno": 7352, "name": "NANOFLARE NEXTAGE (2024)"},
        {"goodsno": 7353, "name": "NANOFLARE 1000 GAME"},
        {"goodsno": 7354, "name": "NANOFLARE 800 PLAY (2023)"},
        {"goodsno": 7355, "name": "NANOFLARE 800 TOUR (2023)"},
        {"goodsno": 7356, "name": "B7000MDM (온라인 전용)"},
        {"goodsno": 7357, "name": "MP5LT (온라인 전용)"},
        {"goodsno": 7358, "name": "MP8LT (온라인 전용)"},
        {"goodsno": 7359, "name": "NANOFLARE E13"},
        {"goodsno": 7360, "name": "ASTROX NEXTAGE (2023)"},
        {"goodsno": 7361, "name": "ASTROX 22RX"},
        {"goodsno": 7362, "name": "ASTROX 77 PLAY (온라인 전용)"},
        {"goodsno": 7363, "name": "ASTROX 77 PRO"},
        {"goodsno": 7364, "name": "ASTROX 77 TOUR (온라인 전용)"},
        {"goodsno": 7365, "name": "ARCSABER 7 PLAY (온라인 전용) GR/Y 4U5"},
        {"goodsno": 7366, "name": "ARCSABER 7 PRO GR/Y 4U5"},
        {"goodsno": 7367, "name": "ARCSABER 7 TOUR (온라인 전용) GR/Y 4U5"},
        {"goodsno": 7368, "name": "MUSCLE POWER 1 (온라인 전용) BL, OR 0U4"},
        {"goodsno": 7369, "name": "ARCSABER 11 PLAY (온라인 전용) GRPR 4U5"},
        {"goodsno": 7370, "name": "ARCSABER 11 TOUR (온라인 전용) GRPR 4U5"},
        {"goodsno": 7371, "name": "NANOFLARE 555 MATW 4U5"},
        {"goodsno": 7372, "name": "NANOFLARE 270 (2022 MODEL)(온라인 전용) PU"},
        {"goodsno": 7373, "name": "NANOFLARE 370 (2022 MODEL)(온라인 전용) BL 4U5"},
        {"goodsno": 7374, "name": "ASTROX 99 PRO 3U, 4U 2021년 신상품"},
        {"goodsno": 7375, "name": "NANOFLARE 160FX"},
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.yonexmall.com/',
    }
    
    valid_products = []
    
    for product in test_products:
        try:
            goodsno = product["goodsno"]
            expected_name = product["name"]
            
            detail_url = f"https://www.yonexmall.com/m2/goods/view.php?category=001001&goodsno={goodsno}"
            
            response = requests.get(detail_url, headers=headers, timeout=5)
            
            if response.status_code == 200:
                response.encoding = 'utf-8'
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # 페이지 제목 확인
                title = soup.find('title')
                if title:
                    title_text = title.get_text().strip()
                    print(f"  {goodsno}: {title_text}")
                    
                    # 실제 상품이면 추가
                    if "요넥스" in title_text or any(keyword in title_text for keyword in ['NANOFLARE', 'ASTROX', 'ARCSABER']):
                        valid_products.append({
                            "goodsno": goodsno,
                            "name": title_text,
                            "url": detail_url
                        })
            
            time.sleep(0.3)
            
        except Exception as e:
            print(f"  {goodsno} 테스트 중 오류: {e}")
            continue
    
    # 결과를 JSON 파일로 저장
    with open('valid_yonex_products.json', 'w', encoding='utf-8') as f:
        json.dump(valid_products, f, ensure_ascii=False, indent=2)
    
    print(f"\n총 {len(valid_products)}개 유효한 상품 발견")
    print("결과가 valid_yonex_products.json 파일에 저장되었습니다.")
    
    return valid_products

if __name__ == "__main__":
    print("요넥스 상품 번호 찾기 시작...")
    
    # 1. 상품 목록 페이지에서 링크 추출
    print("1. 상품 목록 페이지에서 링크 추출")
    find_product_links_from_list()
    
    # 2. 특정 상품 번호들로 테스트
    print("\n2. 특정 상품 번호들로 테스트")
    test_specific_products()
    
    # 3. 넓은 범위로 상품 번호 찾기
    print("\n3. 넓은 범위로 상품 번호 찾기")
    find_product_numbers() 