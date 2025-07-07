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
    # 파일명에서 사용할 수 없는 문자 제거
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # 공백을 언더스코어로 변경
    filename = filename.replace(' ', '_')
    # 한글 파일명 지원
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

def get_product_name(img_element, product_container):
    """제품명 추출"""
    # 방법 1: 이미지의 alt 속성에서 추출
    alt_text = img_element.get('alt', '')
    if alt_text and alt_text.strip():
        return alt_text.strip()
    
    # 방법 2: 부모 컨테이너에서 제품명 찾기
    name_selectors = [
        'h3', 'h4', 'h5', '.name', '.title', '.product-name', 
        'a[class*="name"]', 'span[class*="name"]', '.goods_name',
        'div[class*="name"]', 'p[class*="name"]'
    ]
    
    for selector in name_selectors:
        name_element = product_container.select_one(selector)
        if name_element:
            name_text = name_element.get_text(strip=True)
            if name_text:
                return name_text
    
    # 방법 3: 이미지 주변 텍스트에서 추출
    parent = img_element.find_parent(['div', 'li', 'a'])
    if parent:
        # 이미지 제외한 텍스트 추출
        for element in parent.find_all(['h3', 'h4', 'h5', 'p', 'span', 'a']):
            if element != img_element:
                text = element.get_text(strip=True)
                if text and len(text) > 2:
                    return text
    
    return None

def crawl_yonex_rackets():
    """요넥스 배드민턴 라켓 이미지 크롤링"""
    base_url = "https://www.yonexmall.com/m2/goods/list.php"
    params = {"category": "001001"}
    
    # 저장 디렉토리 설정
    save_dir = "yonex_rackets"
    create_directory(save_dir)
    
    # 헤더 설정
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
        
        # 실제 라켓 이미지 찾기 (제공된 셀렉터 기반)
        racket_images = soup.find_all('img', src=re.compile(r'/shop/data/goods/.*\.png'))
        
        print(f"발견된 라켓 이미지 수: {len(racket_images)}")
        
        if not racket_images:
            print("라켓 이미지를 찾을 수 없습니다.")
            return
        
        downloaded_count = 0
        
        for i, img in enumerate(racket_images, 1):
            try:
                img_src = img.get('src')
                if not img_src:
                    continue
                
                # 상대 URL을 절대 URL로 변환
                img_url = urljoin(base_url, img_src)
                
                # 제품명 추출
                product_name = get_product_name(img, img.find_parent())
                
                if not product_name:
                    # 이미지 파일명에서 추출 시도
                    img_filename = os.path.basename(urlparse(img_src).path)
                    product_name = f"racket_{img_filename.split('.')[0]}"
                
                # 파일명 생성
                clean_name = clean_filename(product_name)
                file_extension = os.path.splitext(urlparse(img_url).path)[1] or '.png'
                filename = f"{clean_name}{file_extension}"
                
                print(f"이미지 {i}: {product_name} -> {img_url}")
                
                # 이미지 다운로드
                if download_image(img_url, filename, save_dir):
                    downloaded_count += 1
                
                # 서버 부하 방지를 위한 딜레이
                time.sleep(0.5)
                    
            except Exception as e:
                print(f"이미지 {i} 처리 중 오류: {e}")
                continue
        
        print(f"\n크롤링 완료!")
        print(f"총 {len(racket_images)}개 이미지 중 {downloaded_count}개 다운로드 완료")
        print(f"저장 위치: {os.path.abspath(save_dir)}")
        
    except requests.exceptions.RequestException as e:
        print(f"네트워크 오류: {e}")
    except Exception as e:
        print(f"크롤링 중 오류 발생: {e}")

def crawl_all_categories():
    """모든 카테고리에서 라켓 이미지 찾기"""
    categories = [
        "001001",  # 원래 카테고리
        "024002",  # Tennis Collection
        "024003",  # Badminton
        "024004",  # Tennis
        "024005",  # Golf
        "024006",  # Wears
        "024007",  # Bag/Acc
        "024008",  # Online Exclusive
        "024009",  # Featured
    ]
    
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
    
    total_downloaded = 0
    
    for category in categories:
        try:
            print(f"\n=== 카테고리 {category} 검색 중 ===")
            
            base_url = "https://www.yonexmall.com/m2/goods/list.php"
            params = {"category": category}
            
            response = requests.get(base_url, params=params, headers=headers, timeout=10)
            response.raise_for_status()
            response.encoding = 'utf-8'
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 라켓 이미지 찾기
            racket_images = soup.find_all('img', src=re.compile(r'/shop/data/goods/.*\.png'))
            
            print(f"카테고리 {category}에서 발견된 이미지: {len(racket_images)}개")
            
            category_downloaded = 0
            
            for i, img in enumerate(racket_images, 1):
                try:
                    img_src = img.get('src')
                    if not img_src:
                        continue
                    
                    img_url = urljoin(base_url, img_src)
                    
                    # 제품명 추출
                    product_name = get_product_name(img, img.find_parent())
                    
                    if not product_name:
                        img_filename = os.path.basename(urlparse(img_src).path)
                        product_name = f"racket_{category}_{img_filename.split('.')[0]}"
                    
                    # 파일명 생성
                    clean_name = clean_filename(product_name)
                    file_extension = os.path.splitext(urlparse(img_url).path)[1] or '.png'
                    filename = f"{clean_name}{file_extension}"
                    
                    print(f"  이미지 {i}: {product_name}")
                    
                    # 이미지 다운로드
                    if download_image(img_url, filename, save_dir):
                        category_downloaded += 1
                        total_downloaded += 1
                    
                    time.sleep(0.3)
                        
                except Exception as e:
                    print(f"  이미지 {i} 처리 중 오류: {e}")
                    continue
            
            print(f"카테고리 {category}: {category_downloaded}개 다운로드 완료")
            
        except Exception as e:
            print(f"카테고리 {category} 처리 중 오류: {e}")
            continue
    
    print(f"\n전체 크롤링 완료!")
    print(f"총 {total_downloaded}개 이미지 다운로드 완료")
    print(f"저장 위치: {os.path.abspath(save_dir)}")

if __name__ == "__main__":
    print("요넥스 라켓 이미지 다운로더 시작...")
    
    # 기본 카테고리만 시도
    print("1. 기본 카테고리에서 라켓 이미지 다운로드")
    crawl_yonex_rackets()
    
    # 모든 카테고리에서 시도
    print("\n2. 모든 카테고리에서 라켓 이미지 검색")
    crawl_all_categories() 