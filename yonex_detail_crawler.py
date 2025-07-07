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

def get_product_name(soup):
    """제품명 추출"""
    # 방법 1: 페이지 제목에서 추출
    title = soup.find('title')
    if title:
        title_text = title.get_text(strip=True)
        if title_text and '요넥스' in title_text:
            return title_text.split('::')[0].strip()
    
    # 방법 2: 상품명 관련 요소에서 추출
    name_selectors = [
        'h1', 'h2', 'h3', '.product-name', '.goods-name', '.item-name',
        '[class*="name"]', '[class*="title"]'
    ]
    
    for selector in name_selectors:
        element = soup.select_one(selector)
        if element:
            name_text = element.get_text(strip=True)
            if name_text and len(name_text) > 2:
                return name_text
    
    # 방법 3: 상품 코드에서 추출
    product_code = soup.find(text=re.compile(r'상품코드'))
    if product_code:
        code_element = product_code.find_next()
        if code_element:
            return code_element.get_text(strip=True)
    
    return "unknown_product"

def crawl_product_detail(goodsno, category="001001"):
    """특정 상품 상세 페이지 크롤링"""
    
    base_url = f"https://www.yonexmall.com/m2/goods/view.php?category={category}&goodsno={goodsno}"
    
    # 저장 디렉토리 설정
    save_dir = "yonex_rackets"
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
    
    try:
        print(f"상품 상세 페이지 접속 중: {base_url}")
        response = requests.get(base_url, headers=headers, timeout=10)
        response.raise_for_status()
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 제품명 추출
        product_name = get_product_name(soup)
        print(f"제품명: {product_name}")
        
        # 라켓 이미지 찾기 (제공된 셀렉터 기반)
        racket_images = soup.find_all('img', src=re.compile(r'/shop/data/goods/.*\.(png|jpg|jpeg)'))
        
        print(f"발견된 이미지 수: {len(racket_images)}")
        
        downloaded_count = 0
        
        for i, img in enumerate(racket_images, 1):
            try:
                img_src = img.get('src')
                if not img_src:
                    continue
                
                # 상대 URL을 절대 URL로 변환
                img_url = urljoin(base_url, img_src)
                
                # 파일명 생성
                clean_name = clean_filename(product_name)
                file_extension = os.path.splitext(urlparse(img_url).path)[1] or '.png'
                filename = f"{clean_name}_{i}{file_extension}"
                
                print(f"  이미지 {i}: {img_url}")
                
                # 이미지 다운로드
                if download_image(img_url, filename, save_dir):
                    downloaded_count += 1
                
                time.sleep(0.3)
                    
            except Exception as e:
                print(f"  이미지 {i} 처리 중 오류: {e}")
                continue
        
        print(f"상품 {goodsno} 크롤링 완료: {downloaded_count}개 다운로드")
        return downloaded_count
        
    except Exception as e:
        print(f"상품 {goodsno} 처리 중 오류: {e}")
        return 0

def crawl_multiple_products():
    """여러 상품 번호로 크롤링"""
    
    # 테스트용 상품 번호들 (실제로는 더 많은 번호를 시도할 수 있음)
    test_goodsno_list = [
        7342,  # 제공된 상품
        7343, 7344, 7345, 7346, 7347, 7348, 7349, 7350,  # 연속된 번호들
        7000, 7001, 7002, 7003, 7004, 7005, 7006, 7007, 7008, 7009,  # 다른 범위
        8000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009,  # 또 다른 범위
    ]
    
    categories = ["001001", "001", "024002", "024003"]
    
    total_downloaded = 0
    
    for category in categories:
        print(f"\n=== 카테고리 {category} 검색 중 ===")
        
        category_downloaded = 0
        
        for goodsno in test_goodsno_list:
            try:
                downloaded = crawl_product_detail(goodsno, category)
                category_downloaded += downloaded
                total_downloaded += downloaded
                
                time.sleep(1)  # 상품 간 딜레이
                
            except Exception as e:
                print(f"상품 {goodsno} 처리 중 오류: {e}")
                continue
        
        print(f"카테고리 {category} 완료: {category_downloaded}개 다운로드")
    
    print(f"\n전체 크롤링 완료!")
    print(f"총 {total_downloaded}개 이미지 다운로드 완료")
    print(f"저장 위치: {os.path.abspath(save_dir)}")

def crawl_specific_product():
    """특정 상품 크롤링 (제공된 상품)"""
    print("=== 특정 상품 크롤링 ===")
    goodsno = 7342
    category = "001001"
    
    downloaded = crawl_product_detail(goodsno, category)
    
    if downloaded > 0:
        print(f"성공! {downloaded}개 이미지 다운로드 완료")
    else:
        print("이미지를 찾을 수 없습니다.")

if __name__ == "__main__":
    print("요넥스 상품 상세 페이지 크롤러 시작...")
    
    # 1. 제공된 특정 상품 먼저 시도
    print("1. 특정 상품 크롤링")
    crawl_specific_product()
    
    # 2. 여러 상품 번호로 시도
    print("\n2. 여러 상품 번호로 크롤링")
    crawl_multiple_products() 