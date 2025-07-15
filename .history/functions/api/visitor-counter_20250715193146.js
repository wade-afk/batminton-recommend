// Cloudflare Workers 방문자 카운터 API
export async function onRequest(context) {
  const { request, env } = context;
  
  // CORS 헤더 설정
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (request.method === 'GET') {
      // 방문자 수 조회
      const visitorCount = await env.VISITOR_COUNTER.get('count') || '76267';
      const lastUpdated = await env.VISITOR_COUNTER.get('lastUpdated') || new Date().toISOString();
      
      return new Response(JSON.stringify({
        success: true,
        visitorCount: parseInt(visitorCount),
        lastUpdated: lastUpdated
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } else if (request.method === 'POST') {
      // 방문자 수 증가
      const currentCount = await env.VISITOR_COUNTER.get('count') || '76267';
      const newCount = parseInt(currentCount) + 1;
      
      await env.VISITOR_COUNTER.put('count', newCount.toString());
      await env.VISITOR_COUNTER.put('lastUpdated', new Date().toISOString());
      
      return new Response(JSON.stringify({
        success: true,
        visitorCount: newCount,
        message: '방문자 수가 증가했습니다.'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: '지원하지 않는 HTTP 메서드입니다.'
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  } catch (error) {
    console.error('방문자 카운터 오류:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '서버 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
} 