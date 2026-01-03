// 独立 Cloudflare Worker - 加速代理
export default {
  async fetch(request) {
    // 目标：加速 Vercel 部署
    const TARGET = 'https://zf-eosin.vercel.app';
    
    // 构建目标 URL
    const url = new URL(request.url);
    const targetUrl = TARGET + url.pathname + url.search;
    
    console.log(`加速代理: ${request.url} -> ${targetUrl}`);
    
    try {
      // 转发请求
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      // 返回响应
      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });
      
    } catch (error) {
      // 错误处理
      return new Response(`加速代理错误: ${error.message}`, {
        status: 502,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
}
