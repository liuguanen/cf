export default {
  async fetch(request) {
    const target = "https://zf-eosin.vercel.app";
    const url = new URL(request.url);
    const response = await fetch(target + url.pathname + url.search, request);
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    return new Response(response.body, { status: response.status, headers: headers });
  }
}
