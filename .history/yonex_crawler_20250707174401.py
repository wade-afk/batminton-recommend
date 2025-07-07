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

def crawl_yonex_rackets():
    """요넥스 배드민턴 라켓 이미지 크롤링"""
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
    }
    
    try:
        print("요넥스 배드민턴 라켓 페이지에 접속 중...")
        response = requests.get(base_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        
        # 한글 인코딩 설정
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 상품 목록 찾기 (실제 셀렉터는 사이트 구조에 따라 조정 필요)
        products = soup.find_all('div', class_='item') or soup.find_all('li', class_='item') or soup.find_all('div', class_='product')
        
        if not products:
            print("상품을 찾을 수 없습니다. 페이지 구조를 확인해주세요.")
            print("페이지 내용 일부:")
            print(response.text[:1000])
            return
        
        print(f"발견된 상품 수: {len(products)}")
        
        downloaded_count = 0
        
        for i, product in enumerate(products, 1):
            try:
                # 상품명 추출
                name_element = product.find('h3') or product.find('h4') or product.find('a', class_='name') or product.find('span', class_='name')
                if name_element:
                    product_name = name_element.get_text(strip=True)
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
    print("요넥스 배드민턴 라켓 이미지 크롤러 시작...")
    crawl_yonex_rackets() 