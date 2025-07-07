import requests
from bs4 import BeautifulSoup
import re

def debug_yonex_page():
    """요넥스 페이지 구조 디버깅"""
    
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
        print("요넥스 페이지 접속 중...")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        print("=== 페이지 분석 결과 ===")
        
        # 모든 이미지 찾기
        all_images = soup.find_all('img')
        print(f"전체 이미지 수: {len(all_images)}")
        
        print("\n=== 모든 이미지 목록 ===")
        for i, img in enumerate(all_images, 1):
            src = img.get('src', '')
            alt = img.get('alt', '')
            classes = img.get('class', [])
            print(f"{i}. src: {src}")
            print(f"   alt: {alt}")
            print(f"   class: {classes}")
            print()
        
        # 상품 관련 이미지 찾기
        print("=== 상품 관련 이미지 ===")
        product_images = []
        for img in all_images:
            src = img.get('src', '')
            alt = img.get('alt', '')
            
            # 상품 관련 키워드 확인
            keywords = ['goods', 'product', 'racket', '라켓', 'badminton', '배드민턴']
            if any(keyword in src.lower() or keyword in alt.lower() for keyword in keywords):
                product_images.append(img)
                print(f"상품 이미지 발견: {src}")
                print(f"  alt: {alt}")
        
        print(f"\n상품 관련 이미지 수: {len(product_images)}")
        
        # 페이지 제목과 메타 정보
        title = soup.find('title')
        if title:
            print(f"\n페이지 제목: {title.get_text()}")
        
        # 메타 태그 확인
        meta_tags = soup.find_all('meta')
        print(f"\n메타 태그 수: {len(meta_tags)}")
        
        # JavaScript 코드 확인
        scripts = soup.find_all('script')
        print(f"\nJavaScript 코드 블록 수: {len(scripts)}")
        
        # 상품 링크 찾기
        product_links = soup.find_all('a', href=re.compile(r'goods|product|item'))
        print(f"\n상품 링크 수: {len(product_links)}")
        
        if product_links:
            print("상품 링크 샘플:")
            for link in product_links[:5]:
                print(f"  - {link.get('href')} -> {link.get_text(strip=True)}")
        
        # 페이지 내용 일부 출력
        print(f"\n=== 페이지 내용 일부 (처음 2000자) ===")
        print(response.text[:2000])
        
    except Exception as e:
        print(f"오류 발생: {e}")

def test_direct_image_access():
    """직접 이미지 URL 접근 테스트"""
    print("\n=== 직접 이미지 URL 접근 테스트 ===")
    
    # 제공된 이미지 URL 테스트
    test_url = "https://www.yonexmall.com/shop/data/goods/1732063225856i0.png"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.yonexmall.com/',
    }
    
    try:
        response = requests.get(test_url, headers=headers, timeout=10)
        print(f"이미지 접근 결과: {response.status_code}")
        
        if response.status_code == 200:
            print("이미지 접근 성공!")
            print(f"이미지 크기: {len(response.content)} bytes")
            
            # 이미지 저장 테스트
            with open("test_image.png", "wb") as f:
                f.write(response.content)
            print("테스트 이미지 저장 완료: test_image.png")
        else:
            print(f"이미지 접근 실패: {response.status_code}")
            
    except Exception as e:
        print(f"이미지 접근 오류: {e}")

if __name__ == "__main__":
    debug_yonex_page()
    test_direct_image_access() 