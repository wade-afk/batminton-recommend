export async function onRequest(context) {
  try {
    // 간단한 파일 기반 카운터 (실제로는 KV나 D1 데이터베이스 권장)
    const timestamp = Date.now();
    const randomIncrement = Math.floor(Math.random() * 5) + 1; // 1-5 랜덤 증가
    
    // 실제로는 여기서 데이터베이스나 KV에 저장
    const mockCount = 1234 + randomIncrement;
    
    return new Response(JSON.stringify({ 
      count: mockCount,
      timestamp: timestamp 
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      count: 1234, 
      error: 'Using fallback count' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 