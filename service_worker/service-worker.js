const CACHE_NAME = "mi-cache-v1";
const urlsToCache = [
    "./",            // la raíz
    "./index.html",
    "./app.js",
    "./style.css"
];

// Instalación y cacheo
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Cacheando archivos...');
            return cache.addAll(urlsToCache);
        }).then(() => {
            self.skipWaiting(); // Activar inmediatamente
        })
    );
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', (event) => {
    console.log('[SW] Activado');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW] Borrando cache antigua:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    clients.claim(); // Tomar control de las páginas

    startIdleCycle();
});

// Interceptar solicitudes y servir desde cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

function startIdleCycle() {
    let estado = false;
    setInterval(() => {
        estado = !estado;

        console.log("[SW] Ocioso:", estado);

        self.clients.matchAll().then(clientList => {
            clientList.forEach(client => {
                client.postMessage({ type: 'idle', value: estado });
            });
        });

    }, 3000); // cada 3 segundos
}
