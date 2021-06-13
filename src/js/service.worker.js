import { newsUrl } from './tools';

const cacheName = 'newsCache';

self.addEventListener('install', (evt) => {
  evt.waitUntil((async () => {
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil((async () => {
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.url !== newsUrl) {
    return;
  }

  evt.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const clients = await self.clients.matchAll();
    const client = clients.find((item) => item.id === evt.clientId);
    let response;

    try {
      response = await fetch(evt.request.url);
      if (response.ok) {
        await cache.put(newsUrl, response.clone());
        client.postMessage('ready');
      } else {
        response = await cache.match(evt.request);
        client.postMessage('error');
      }
    } catch (e) {
      response = await cache.match(evt.request);
      client.postMessage('error');
    }

    return response;
  })());
});
