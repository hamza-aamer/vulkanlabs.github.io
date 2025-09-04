// Service Worker for Vulkan Labs Website - Mobile Optimized
// File: sw.js

const CACHE_NAME = 'vulkan-labs-v1.2.0';
const DYNAMIC_CACHE_NAME = 'vulkan-labs-dynamic-v1.2.0';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/404.html'
];

// External resources to cache
const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// All assets to cache
const urlsToCache = [...STATIC_ASSETS, ...EXTERNAL_ASSETS];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('[SW] Install event');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Opened cache');
                
                // Cache static assets first
                return cache.addAll(STATIC_ASSETS)
                    .then(() => {
                        // Try to cache external assets, but don't fail if they're not available
                        return Promise.allSettled(
                            EXTERNAL_ASSETS.map(url => 
                                cache.add(url).catch(err => 
                                    console.warn(`[SW] Failed to cache ${url}:`, err)
                                )
                            )
                        );
                    });
            })
            .then(() => {
                console.log('[SW] All assets cached successfully');
                // Skip waiting to activate new service worker immediately
                self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activate event');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            self.clients.claim()
        ])
    );
});

// Fetch event - serve cached content with network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests
    if (url.origin === location.origin) {
        // Same-origin requests - use cache first strategy
        event.respondWith(handleSameOriginRequest(request));
    } else {
        // Cross-origin requests - use network first for critical resources
        event.respondWith(handleCrossOriginRequest(request));
    }
});

// Handle same-origin requests (cache first strategy)
async function handleSameOriginRequest(request) {
    try {
        // Check cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[SW] Serving from cache:', request.url);
            
            // Update cache in background for HTML files
            if (request.destination === 'document') {
                updateCacheInBackground(request);
            }
            
            return cachedResponse;
        }
        
        // Not in cache, fetch from network
        console.log('[SW] Fetching from network:', request.url);
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('[SW] Fetch failed:', error);
        
        // Return offline page for navigation requests
        if (request.destination === 'document') {
            const offlinePage = await caches.match('/404.html');
            return offlinePage || new Response('Offline', { status: 503 });
        }
        
        // Return generic offline response for other requests
        return new Response('Offline', { 
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Handle cross-origin requests (network first for critical resources)
async function handleCrossOriginRequest(request) {
    try {
        // For fonts and critical CSS, try network first with quick timeout
        const isFont = request.destination === 'font' || request.url.includes('fonts.');
        const isCSS = request.destination === 'style' || request.url.includes('.css');
        
        if (isFont || isCSS) {
            // Try network first with timeout
            const networkPromise = fetch(request);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Network timeout')), 3000)
            );
            
            try {
                const networkResponse = await Promise.race([networkPromise, timeoutPromise]);
                
                // Cache successful response
                if (networkResponse.status === 200) {
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(request, networkResponse.clone());
                }
                
                return networkResponse;
            } catch (networkError) {
                // Fallback to cache
                const cachedResponse = await caches.match(request);
                if (cachedResponse) {
                    console.log('[SW] Network failed, serving from cache:', request.url);
                    return cachedResponse;
                }
                throw networkError;
            }
        } else {
            // For other cross-origin requests, try cache first
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                return cachedResponse;
            }
            
            const networkResponse = await fetch(request);
            
            // Cache if successful
            if (networkResponse.status === 200) {
                const cache = await caches.open(DYNAMIC_CACHE_NAME);
                cache.put(request, networkResponse.clone());
            }
            
            return networkResponse;
        }
    } catch (error) {
        console.error('[SW] Cross-origin fetch failed:', error);
        
        // Try to serve from cache as last resort
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return a placeholder response for failed resources
        if (request.destination === 'image') {
            return new Response('', { status: 204 });
        }
        
        return new Response('Resource unavailable', { 
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Update cache in background
async function updateCacheInBackground(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse);
            console.log('[SW] Cache updated in background for:', request.url);
        }
    } catch (error) {
        console.warn('[SW] Background cache update failed:', error);
    }
}

// Background sync for form submissions (mobile-friendly)
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync event:', event.tag);
    
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    } else if (event.tag === 'analytics-sync') {
        event.waitUntil(syncAnalytics());
    }
});

// Sync contact form data when back online
async function syncContactForm() {
    try {
        // Get pending form submissions from IndexedDB or localStorage
        const pendingForms = JSON.parse(localStorage.getItem('pendingContactForms') || '[]');
        
        for (const formData of pendingForms) {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    console.log('[SW] Contact form synced successfully');
                    // Remove from pending list
                    const updatedPending = pendingForms.filter(f => f.id !== formData.id);
                    localStorage.setItem('pendingContactForms', JSON.stringify(updatedPending));
                }
            } catch (error) {
                console.error('[SW] Failed to sync contact form:', error);
            }
        }
    } catch (error) {
        console.error('[SW] Contact form sync failed:', error);
    }
}

// Sync analytics data
async function syncAnalytics() {
    try {
        // Implement analytics sync if needed
        console.log('[SW] Analytics sync completed');
    } catch (error) {
        console.error('[SW] Analytics sync failed:', error);
    }
}

// Push notification handling (for future use)
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body || 'New update from Vulkan Labs',
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            data: data,
            actions: [
                {
                    action: 'view',
                    title: 'View',
                    icon: '/icon-192x192.png'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss'
                }
            ],
            tag: 'vulkan-labs-notification',
            renotify: true,
            requireInteraction: false,
            silent: false
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'Vulkan Labs', options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data?.url || '/')
        );
    }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('[SW] Notification closed');
    // Track notification close if needed
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);
    
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
                
            case 'GET_VERSION':
                event.ports[0].postMessage({ version: CACHE_NAME });
                break;
                
            case 'CACHE_URLS':
                event.waitUntil(
                    caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                        return cache.addAll(event.data.urls);
                    })
                );
                break;
                
            case 'CLEAR_CACHE':
                event.waitUntil(
                    caches.delete(DYNAMIC_CACHE_NAME)
                );
                break;
                
            default:
                console.log('[SW] Unknown message type:', event.data.type);
        }
    }
});

// Periodic background sync (for PWA features)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'cache-update') {
        event.waitUntil(updateCaches());
    }
});

// Update caches periodically
async function updateCaches() {
    try {
        console.log('[SW] Updating caches periodically');
        
        // Update critical resources
        const cache = await caches.open(CACHE_NAME);
        const criticalResources = ['/', '/style.css', '/script.js'];
        
        await Promise.allSettled(
            criticalResources.map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (response.status === 200) {
                        await cache.put(url, response);
                    }
                } catch (error) {
                    console.warn(`[SW] Failed to update ${url}:`, error);
                }
            })
        );
        
        console.log('[SW] Cache update completed');
    } catch (error) {
        console.error('[SW] Periodic cache update failed:', error);
    }
}

// Error handling
self.addEventListener('error', (event) => {
    console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('[SW] Unhandled promise rejection:', event.reason);
});

// Cache management utilities
const CacheManager = {
    // Get cache size
    async getCacheSize() {
        const cacheNames = await caches.keys();
        let totalSize = 0;
        
        for (const name of cacheNames) {
            const cache = await caches.open(name);
            const keys = await cache.keys();
            
            for (const request of keys) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }
        }
        
        return totalSize;
    },
    
    // Clean old entries if cache is too large
    async cleanupIfNeeded() {
        const maxSize = 50 * 1024 * 1024; // 50MB limit
        const currentSize = await this.getCacheSize();
        
        if (currentSize > maxSize) {
            console.log('[SW] Cache size exceeded, cleaning up...');
            
            // Remove oldest entries from dynamic cache
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            const keys = await cache.keys();
            
            // Remove first 25% of entries (simple LRU-like strategy)
            const toRemove = keys.slice(0, Math.floor(keys.length * 0.25));
            await Promise.all(toRemove.map(key => cache.delete(key)));
            
            console.log(`[SW] Removed ${toRemove.length} cache entries`);
        }
    }
};

// Run cleanup periodically
setInterval(() => {
    CacheManager.cleanupIfNeeded().catch(console.error);
}, 60000); // Check every minute

console.log('[SW] Service Worker script loaded successfully');