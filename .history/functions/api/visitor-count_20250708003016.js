export async function onRequest(context) {
  const { env, request } = context;
  
  // CORS preflight 요청 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  
  try {
    // KV에서 현재 카운트 가져오기
    let currentCount = await env.VISITOR_COUNT.get('visitor_count');
    currentCount = currentCount ? parseInt(currentCount) : 0;
    
    // 카운트 증가
    const newCount = currentCount + 1;
    
    // KV에 저장 (TTL 1년 설정)
    await env.VISITOR_COUNT.put('visitor_count', newCount.toString(), {
      expirationTtl: 31536000 // 1년
    });
    
    return new Response(JSON.stringify({ 
      count: newCount,
      success: true,
      timestamp: Date.now()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('KV Error:', error);
    
    // KV 에러 시 fallback 값 반환
    return new Response(JSON.stringify({ 
      count: 1234, 
      error: 'Using fallback count',
      success: false
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
} 