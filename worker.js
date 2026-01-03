// 简化的代理 Worker - 无域名检测
export default {
  async fetch(request) {
    const TARGET = 'http://api1.123h.top:5000';
    
    // 构建目标 URL
    const url = new URL(request.url);
    const targetUrl = TARGET + url.pathname + url.search;
    
    try {
      // 转发请求
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      // 添加 CORS 头
      const headers = new Headers(response.headers);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      
      return new Response(response.body, {
        status: response.status,
        headers: headers
      });
      
    } catch (error) {
      return new Response(`代理错误: ${error.message}`, {
        status: 502,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
}
