export default {
  async fetch(request, env) {
    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (request.method === 'GET') {
        // 방문자 수 조회
        const { results } = await env.DB.prepare(
          'SELECT count FROM visitors WHERE id = 1'
        ).run();
        
        const count = results[0]?.count || 0;
        
        return new Response(JSON.stringify({ 
          count,
          timestamp: new Date().toISOString()
        }), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      } else if (request.method === 'POST') {
        // 방문자 수 증가
        const { results } = await env.DB.prepare(
          'UPDATE visitors SET count = count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = 1 RETURNING count'
        ).run();
        
        const count = results[0]?.count || 0;
        
        return new Response(JSON.stringify({ 
          count,
          timestamp: new Date().toISOString()
        }), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    } catch (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ 
        error: 'Database error',
        count: 82267 // fallback
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    return new Response('Method not allowed', { status: 405 });
  }
}; 