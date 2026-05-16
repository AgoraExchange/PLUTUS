const CACHE_NAME = 'plutus-casino-v32';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './logo.png',
  './Instapfp.jpg',
  './cantina.mp3',
  './GameIcons/Blackjack.png',
  './GameIcons/Chicken.png',
  './GameIcons/CoinFlip.png',
  './GameIcons/Crash.png',
  './GameIcons/Cups.png',
  './GameIcons/Dice.png',
  './GameIcons/Mines.png',
  './GameIcons/Plinko.png',
  './GameIcons/Pump.png',
  './GameIcons/Roulette.png',
  './GameIcons/RussianRoulette.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(ASSETS.map(asset => cache.add(asset))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || !response.ok) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
