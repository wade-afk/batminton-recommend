import requests
from bs4 import BeautifulSoup
import re

def find_racket_pages():
    """요넥스 사이트에서 라켓 상품 페이지 찾기"""
    
    # 여러 가능한 URL들 시도
    urls_to_try = [
        "https://www.yonexmall.com/m2/goods/list.php?category=001001",
        "https://www.yonexmall.com/m2/goods/list.php?category=024002",  # Tennis Collection
        "https://www.yonexmall.com/m2/goods/list.php?category=024003",  # Badminton
        "https://www.yonexmall.com/m2/goods/list.php?category=024004",  # Tennis
        "https://www.yonexmall.com/m2/goods/list.php?category=024005",  # Golf
        "https://www.yonexmall.com/m2/goods/list.php?category=024006",  # Wears
        "https://www.yonexmall.com/m2/goods/list.php?category=024007",  # Bag/Acc
        "https://www.yonexmall.com/m2/goods/list.php?category=024008",  # Online Exclusive
        "https://www.yonexmall.com/m2/goods/list.php?category=024009",  # Featured
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    for url in urls_to_try:
        try:
            print(f"\n=== {url} 시도 중 ===")
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            response.encoding = 'utf-8'
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 이미지 개수 확인
            images = soup.find_all('img')
            print(f"이미지 개수: {len(images)}")
            
            # 상품 관련 링크 찾기
            product_links = soup.find_all('a', href=re.compile(r'goods|product|item'))
            print(f"상품 링크 개수: {len(product_links)}")
            
            # 배드민턴 관련 텍스트 찾기
            badminton_text = soup.find_all(text=re.compile(r'배드민턴|badminton|라켓|racket', re.IGNORECASE))
            print(f"배드민턴 관련 텍스트: {len(badminton_text)}개")
            
            if badminton_text:
                print("배드민턴 관련 텍스트 샘플:")
                for text in badminton_text[:3]:
                    print(f"  - {text.strip()}")
            
            # 실제 상품 이미지가 있는지 확인
            product_images = []
            for img in images:
                src = img.get('src', '')
                alt = img.get('alt', '')
                if any(keyword in src.lower() or keyword in alt.lower() 
                       for keyword in ['racket', '라켓', 'badminton', '배드민턴', 'goods', 'product']):
                    product_images.append(img)
            
            print(f"상품 관련 이미지: {len(product_images)}개")
            
            if product_images:
                print("상품 이미지 샘플:")
                for img in product_images[:3]:
                    print(f"  - src: {img.get('src')}")
                    print(f"    alt: {img.get('alt')}")
            
            # 페이지 제목 확인
            title = soup.find('title')
            if title:
                print(f"페이지 제목: {title.get_text()}")
            
            # 메뉴 구조 확인
            menu_items = soup.find_all(['a', 'div'], class_=re.compile(r'menu|nav|category'))
            print(f"메뉴 항목: {len(menu_items)}개")
            
            if len(images) > 10:  # 이미지가 많은 페이지
                print("*** 이 페이지에 많은 이미지가 있습니다! ***")
                
        except Exception as e:
            print(f"오류: {e}")
            continue

def find_badminton_specific():
    """배드민턴 전용 페이지 찾기"""
    print("\n=== 배드민턴 전용 페이지 찾기 ===")
    
    # 배드민턴 카테고리 URL들
    badminton_urls = [
        "https://www.yonexmall.com/m2/goods/list.php?category=024003",
        "https://www.yonexmall.com/m2/goods/list.php?category=024002&sub=badminton",
        "https://www.yonexmall.com/m2/goods/list.php?category=badminton",
        "https://www.yonexmall.com/m2/goods/list.php?category=001001&type=badminton",
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
    
    for url in badminton_urls:
        try:
            print(f"\n시도: {url}")
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 배드민턴 관련 텍스트 확인
            badminton_count = len(soup.find_all(text=re.compile(r'배드민턴|badminton', re.IGNORECASE)))
            racket_count = len(soup.find_all(text=re.compile(r'라켓|racket', re.IGNORECASE)))
            
            print(f"배드민턴 관련 텍스트: {badminton_count}개")
            print(f"라켓 관련 텍스트: {racket_count}개")
            
            if badminton_count > 0 or racket_count > 0:
                print("*** 배드민턴 관련 콘텐츠 발견! ***")
                
                # 상품 링크 찾기
                links = soup.find_all('a', href=True)
                product_links = [link for link in links if any(keyword in link['href'].lower() 
                                                             for keyword in ['goods', 'product', 'item'])]
                
                print(f"상품 링크: {len(product_links)}개")
                for link in product_links[:5]:
                    print(f"  - {link['href']}")
                    
        except Exception as e:
            print(f"오류: {e}")

if __name__ == "__main__":
    print("요넥스 사이트 라켓 페이지 찾기 시작...")
    find_racket_pages()
    find_badminton_specific() 