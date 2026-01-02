// Cloudflare Pages 函数 - API 反向代理
export async function onRequest(context) {
  const { request } = context;
  const TARGET = 'http://api1.123h.top:5000';
  
  // 记录请求信息（调试用）
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  
  // 构建目标 URL
  const url = new URL(request.url);
  const targetUrl = TARGET + url.pathname + url.search;
  
  try {
    // 准备请求头
    const headers = new Headers(request.headers);
    headers.delete('host'); // 删除原始 host 头
    
    // 转发请求
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'manual'
    });
    
    // 准备响应头
    const responseHeaders = new Headers(response.headers);
    
    // 添加 CORS 头（允许所有域名访问）
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');
    responseHeaders.set('Access-Control-Max-Age', '86400');
    
    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: responseHeaders
      });
    }
    
    // 返回代理响应
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
    
  } catch (error) {
    console.error('代理错误:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: '代理服务错误',
      message: error.message,
      timestamp: new Date().toISOString(),
      target: TARGET
    }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    });
  }
}
