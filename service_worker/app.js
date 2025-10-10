const logTableBody = document.querySelector('#logTable tbody');

function logPhase(phase) {
    const row = document.createElement('tr');
    const timestamp = new Date().toLocaleTimeString();
    row.innerHTML = `<td>${phase}</td><td>${timestamp}</td>`;
    logTableBody.appendChild(row);
}

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then((registration) => {
            console.log('Service Worker registrado:', registration);

            if (registration.installing) {
                logPhase('Instalación');
                registration.installing.addEventListener('statechange', (e) => {
                    logPhase(`Instalado: ${e.target.state}`);
                });
            }

            if (registration.waiting) {
                logPhase('Instalado / Waiting');
            }

            if (registration.active) {
                logPhase('Activo');
            }

            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    logPhase(`Nuevo estado: ${newWorker.state}`);
                });
            });
        })
        .catch((error) => {
            console.error('Error registrando Service Worker:', error);
        });

    // Escuchar mensajes del SW (para el estado "Ocioso")
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'idle') {
            logPhase(`Ocioso: ${event.data.value}`);
        }
    });

}
