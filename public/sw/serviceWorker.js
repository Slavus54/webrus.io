const CACHE_KEY = 'webrus-static-data'

const FILES = [
    '/favicon.ico',
    '/loading.gif',
    '/manifest.json',
    '/profile/account.png',
    '/profile/geo.png',
    '/profile/security.png',
    '/profile/achievements.png',
    '/profile/careers.png',
    '/profile/collections.png',
    '/channels/soer.jpg',
    '/channels/beard.jpg',
    '/channels/winderton.jpg', 
    '/channels/egor.jpg',
    '/channels/webdevsimplified.jpg'
]

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_KEY).then(cache => cache.addAll(FILES))
    )
})

self.addEventListener('activate', async (e) => {
    console.log('Service Worker is activated...')

    let keys = await caches.keys()

    Promise.all(keys.map(async (name) => {
        if (name !== CACHE_KEY) {
            await caches.delete(name)
        }
    }))
})

self.addEventListener('fetch', async (e) => {
    try {
        return await fetch(e.request)
    } catch (err) {
        return await caches.match(e.request)
    }
})