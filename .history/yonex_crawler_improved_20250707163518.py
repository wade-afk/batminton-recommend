import requests
from bs4 import BeautifulSoup
import os
import time
from urllib.parse import urljoin, urlparse
import re
import json

def create_directory(directory):
    """디렉토리가 없으면 생성"""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"디렉토리 생성: {directory}")

def clean_filename(filename):
    """파일명에서 사용할 수 없는 문자 제거"""
    # 파일명에서 사용할 수 없는 문자 제거
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # 공백을 언더스코어로 변경
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

def analyze_page_structure(soup):
    """페이지 구조 분석"""
    print("=== 페이지 구조 분석 ===")
    
    # 모든 img 태그 찾기
    all_images = soup.find_all('img')
    print(f"전체 이미지 수: {len(all_images)}")
    
    for i, img in enumerate(all_images[:5]):  # 처음 5개만 출력
        print(f"이미지 {i+1}:")
        print(f"  src: {img.get('src')}")
        print(f"  data-src: {img.get('data-src')}")
        print(f"  alt: {img.get('alt')}")
        print(f"  class: {img.get('class')}")
        print()
    
    # 상품 관련 요소들 찾기
    product_containers = soup.find_all(['div', 'li'], class_=re.compile(r'(item|product|goods)'))
    print(f"상품 컨테이너 수: {len(product_containers)}")
    
    if product_containers:
        sample_container = product_containers[0]
        print("첫 번째 상품 컨테이너 구조:")
        print(sample_container.prettify()[:500])
        print()

def crawl_yonex_rackets():
    """요넥스 배드민턴 라켓 이미지 크롤링 (개선된 버전)"""
    base_url = "https://www.yonexmall.com/m2/goods/list.php"
    params = {"category": "001001"}
    
    # 저장 디렉토리 설정
    save_dir = "yonex_rackets"
    create_directory(save_dir)
    
    # 헤더 설정 (브라우저처럼 보이게)
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
        print("요넥스 배드민턴 라켓 페이지에 접속 중...")
        response = requests.get(base_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        
        # 한글 인코딩 설정
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 페이지 구조 분석
        analyze_page_structure(soup)
        
        # 다양한 셀렉터로 상품 찾기
        products = []
        
        # 방법 1: 일반적인 상품 컨테이너
        selectors = [
            'div.item', 'li.item', 'div.product', 'li.product',
            'div.goods', 'li.goods', 'div[class*="item"]', 'li[class*="item"]',
            'div[class*="product"]', 'li[class*="product"]', 'div[class*="goods"]',
            'li[class*="goods"]', '.item', '.product', '.goods'
        ]
        
        for selector in selectors:
            found = soup.select(selector)
            if found:
                products = found
                print(f"셀렉터 '{selector}'로 {len(found)}개 상품 발견")
                break
        
        # 방법 2: 이미지가 있는 모든 컨테이너
        if not products:
            print("일반적인 셀렉터로 상품을 찾지 못했습니다. 이미지가 있는 컨테이너를 찾습니다...")
            img_containers = []
            for img in soup.find_all('img'):
                if img.get('src') or img.get('data-src'):
                    parent = img.find_parent(['div', 'li'])
                    if parent and parent not in img_containers:
                        img_containers.append(parent)
            products = img_containers
            print(f"이미지가 있는 컨테이너 {len(products)}개 발견")
        
        if not products:
            print("상품을 찾을 수 없습니다.")
            return
        
        print(f"처리할 상품 수: {len(products)}")
        
        downloaded_count = 0
        
        for i, product in enumerate(products, 1):
            try:
                # 상품명 추출 (다양한 방법 시도)
                product_name = None
                name_selectors = ['h3', 'h4', 'h5', '.name', '.title', '.product-name', 'a[class*="name"]', 'span[class*="name"]']
                
                for selector in name_selectors:
                    name_element = product.select_one(selector)
                    if name_element:
                        product_name = name_element.get_text(strip=True)
                        break
                
                if not product_name:
                    # alt 텍스트에서 이름 추출
                    img_element = product.find('img')
                    if img_element and img_element.get('alt'):
                        product_name = img_element.get('alt')
                    else:
                        product_name = f"racket_{i}"
                
                # 이미지 URL 추출
                img_element = product.find('img')
                if img_element:
                    img_src = img_element.get('src') or img_element.get('data-src')
                    if img_src:
                        # 상대 URL을 절대 URL로 변환
                        img_url = urljoin(base_url, img_src)
                        
                        # 파일명 생성
                        clean_name = clean_filename(product_name)
                        file_extension = os.path.splitext(urlparse(img_url).path)[1] or '.jpg'
                        filename = f"{clean_name}{file_extension}"
                        
                        print(f"상품 {i}: {product_name} -> {img_url}")
                        
                        # 이미지 다운로드
                        if download_image(img_url, filename, save_dir):
                            downloaded_count += 1
                        
                        # 서버 부하 방지를 위한 딜레이
                        time.sleep(0.5)
                    else:
                        print(f"상품 {i}: 이미지 URL을 찾을 수 없습니다")
                else:
                    print(f"상품 {i}: 이미지 요소를 찾을 수 없습니다")
                    
            except Exception as e:
                print(f"상품 {i} 처리 중 오류: {e}")
                continue
        
        print(f"\n크롤링 완료!")
        print(f"총 {len(products)}개 상품 중 {downloaded_count}개 이미지 다운로드 완료")
        print(f"저장 위치: {os.path.abspath(save_dir)}")
        
    except requests.exceptions.RequestException as e:
        print(f"네트워크 오류: {e}")
    except Exception as e:
        print(f"크롤링 중 오류 발생: {e}")

if __name__ == "__main__":
    print("요넥스 배드민턴 라켓 이미지 크롤러 (개선된 버전) 시작...")
    crawl_yonex_rackets() 