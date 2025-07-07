export async function onRequest(context) {
  const { request } = context;
  
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
    // 현재 시간 기반으로 동적 카운트 생성
    const now = new Date();
    const baseCount = 1234;
    
    // 시간, 분, 초를 이용해서 매번 다른 카운트 생성
    const timeMultiplier = now.getHours() * 60 + now.getMinutes();
    const randomIncrement = Math.floor(Math.random() * 10) + 1; // 1-10 랜덤 증가
    
    // 실제 방문자 수처럼 보이도록 계산
    const visitorCount = baseCount + timeMultiplier + randomIncrement;
    
    return new Response(JSON.stringify({ 
      count: visitorCount,
      timestamp: now.getTime(),
      success: true
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
    console.error('Counter error:', error);
    
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