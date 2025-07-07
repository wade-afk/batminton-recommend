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

def get_product_name(soup, url):
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
    
    # 방법 3: URL에서 추출
    url_parts = url.split('/')
    if len(url_parts) > 1:
        return url_parts[-1].split('?')[0]
    
    return "unknown_product"

def crawl_product_pages():
    """상품 페이지들을 크롤링하여 이미지 다운로드"""
    
    base_url = "https://www.yonexmall.com/m2/goods/list.php?category=001001"
    
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
        print("메인 페이지에서 상품 링크 수집 중...")
        response = requests.get(base_url, headers=headers, timeout=10)
        response.raise_for_status()
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 상품 링크 찾기
        product_links = soup.find_all('a', href=re.compile(r'goods|product|item'))
        
        print(f"발견된 상품 링크 수: {len(product_links)}")
        
        if not product_links:
            print("상품 링크를 찾을 수 없습니다.")
            return
        
        downloaded_count = 0
        processed_count = 0
        
        for i, link in enumerate(product_links[:20], 1):  # 처음 20개만 시도
            try:
                href = link.get('href')
                if not href:
                    continue
                
                # 상대 URL을 절대 URL로 변환
                product_url = urljoin(base_url, href)
                
                print(f"\n상품 페이지 {i} 접속 중: {product_url}")
                
                # 상품 페이지 접속
                product_response = requests.get(product_url, headers=headers, timeout=10)
                product_response.raise_for_status()
                product_response.encoding = 'utf-8'
                
                product_soup = BeautifulSoup(product_response.text, 'html.parser')
                
                # 제품명 추출
                product_name = get_product_name(product_soup, product_url)
                print(f"제품명: {product_name}")
                
                # 라켓 이미지 찾기
                racket_images = product_soup.find_all('img', src=re.compile(r'/shop/data/goods/.*\.(png|jpg|jpeg)'))
                
                print(f"발견된 이미지 수: {len(racket_images)}")
                
                for j, img in enumerate(racket_images, 1):
                    try:
                        img_src = img.get('src')
                        if not img_src:
                            continue
                        
                        img_url = urljoin(product_url, img_src)
                        
                        # 파일명 생성
                        clean_name = clean_filename(product_name)
                        file_extension = os.path.splitext(urlparse(img_url).path)[1] or '.png'
                        filename = f"{clean_name}_{j}{file_extension}"
                        
                        print(f"  이미지 {j}: {img_url}")
                        
                        # 이미지 다운로드
                        if download_image(img_url, filename, save_dir):
                            downloaded_count += 1
                        
                        time.sleep(0.3)
                        
                    except Exception as e:
                        print(f"  이미지 {j} 처리 중 오류: {e}")
                        continue
                
                processed_count += 1
                time.sleep(1)  # 페이지 간 딜레이
                
            except Exception as e:
                print(f"상품 페이지 {i} 처리 중 오류: {e}")
                continue
        
        print(f"\n크롤링 완료!")
        print(f"처리된 상품 페이지: {processed_count}개")
        print(f"다운로드된 이미지: {downloaded_count}개")
        print(f"저장 위치: {os.path.abspath(save_dir)}")
        
    except Exception as e:
        print(f"크롤링 중 오류 발생: {e}")

def crawl_badminton_category():
    """배드민턴 카테고리에서 상품 찾기"""
    
    badminton_urls = [
        "https://www.yonexmall.com/m2/goods/list.php?category=001",
        "https://www.yonexmall.com/m2/goods/list.php?category=024003",
        "https://www.yonexmall.com/m2/goods/list.php?category=024002",
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
    
    for category_url in badminton_urls:
        try:
            print(f"\n=== 카테고리 페이지 접속: {category_url} ===")
            
            response = requests.get(category_url, headers=headers, timeout=10)
            response.raise_for_status()
            response.encoding = 'utf-8'
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 상품 링크 찾기
            product_links = soup.find_all('a', href=re.compile(r'goods|product|item'))
            
            print(f"발견된 상품 링크: {len(product_links)}개")
            
            category_downloaded = 0
            
            for i, link in enumerate(product_links[:10], 1):  # 각 카테고리에서 10개만 시도
                try:
                    href = link.get('href')
                    if not href:
                        continue
                    
                    product_url = urljoin(category_url, href)
                    
                    print(f"  상품 페이지 {i}: {product_url}")
                    
                    # 상품 페이지 접속
                    product_response = requests.get(product_url, headers=headers, timeout=10)
                    product_response.raise_for_status()
                    product_response.encoding = 'utf-8'
                    
                    product_soup = BeautifulSoup(product_response.text, 'html.parser')
                    
                    # 제품명 추출
                    product_name = get_product_name(product_soup, product_url)
                    
                    # 라켓 이미지 찾기
                    racket_images = product_soup.find_all('img', src=re.compile(r'/shop/data/goods/.*\.(png|jpg|jpeg)'))
                    
                    for j, img in enumerate(racket_images, 1):
                        try:
                            img_src = img.get('src')
                            if not img_src:
                                continue
                            
                            img_url = urljoin(product_url, img_src)
                            
                            # 파일명 생성
                            clean_name = clean_filename(product_name)
                            file_extension = os.path.splitext(urlparse(img_url).path)[1] or '.png'
                            filename = f"{clean_name}_{j}{file_extension}"
                            
                            print(f"    이미지 {j}: {product_name}")
                            
                            # 이미지 다운로드
                            if download_image(img_url, filename, save_dir):
                                category_downloaded += 1
                                total_downloaded += 1
                            
                            time.sleep(0.3)
                            
                        except Exception as e:
                            print(f"    이미지 {j} 처리 중 오류: {e}")
                            continue
                    
                    time.sleep(0.5)
                    
                except Exception as e:
                    print(f"  상품 페이지 {i} 처리 중 오류: {e}")
                    continue
            
            print(f"카테고리 완료: {category_downloaded}개 다운로드")
            
        except Exception as e:
            print(f"카테고리 처리 중 오류: {e}")
            continue
    
    print(f"\n전체 크롤링 완료!")
    print(f"총 {total_downloaded}개 이미지 다운로드 완료")
    print(f"저장 위치: {os.path.abspath(save_dir)}")

if __name__ == "__main__":
    print("요넥스 상품 페이지 크롤러 시작...")
    
    print("1. 메인 페이지에서 상품 링크 따라가기")
    crawl_product_pages()
    
    print("\n2. 배드민턴 카테고리에서 상품 찾기")
    crawl_badminton_category() 