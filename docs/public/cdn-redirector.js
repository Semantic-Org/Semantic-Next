const CDN_MAPPING = {
  'unpkg.com': 'cdn.jsdelivr.net/npm'
};

self.addEventListener('fetch', (event) => {
  const requestURL = event.request.url;
  const url = new URL(requestURL);
  
  const newHost = CDN_MAPPING[url.hostname];
  // Check if this request is for a CDN we want to redirect
  if (newHost) {
    // Create a new URL using jsdelivr instead of unpkg
    const newUrl = requestURL.replace(url.hostname, newHost);
    console.log(`CDN redirector: ${url} → ${newUrl}`);
    
    event.respondWith(
      fetch(newUrl.toString(), {
        method: event.request.method,
        headers: event.request.headers,
        body: event.request.body,
        mode: 'cors',
        credentials: 'same-origin'
      })
    );
  }
});

// fetch requests from the playground's service worker
// will be made using this service worker, we need to let those through.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Immediately activate this service worker
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
