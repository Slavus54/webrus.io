const CACHE_KEY = 'webrus-static-data'

const FILES = [
    '/favicon.ico',
    '/loading.gif',
    '/manifest.json'
]

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_KEY).then(cache => cache.addAll(FILES))
    )
})

self.addEventListener('activate', e => {
    console.log('Service Worker is activated...')
})