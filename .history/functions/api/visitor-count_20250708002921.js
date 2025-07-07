export async function onRequest(context) {
  const { env } = context;
  
  try {
    // KV에서 현재 카운트 가져오기
    let currentCount = await env.VISITOR_COUNT.get('count');
    currentCount = currentCount ? parseInt(currentCount) : 0;
    
    // 카운트 증가
    const newCount = currentCount + 1;
    
    // KV에 저장
    await env.VISITOR_COUNT.put('count', newCount.toString());
    
    return new Response(JSON.stringify({ count: newCount }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ count: 0, error: 'Failed to update count' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 