export async function onRequest(context) {
  const TARGET = 'http://api1.123h.top:5000';
  const url = new URL(context.request.url);
  const response = await fetch(TARGET + url.pathname + url.search, context.request);
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  return new Response(response.body, { status: response.status, headers: headers });
}
