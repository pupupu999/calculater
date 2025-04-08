export const baseURL =
    window.location.hostname === 'localhost'
        ? 'http://localhost:3001'
        : `http://${window.location.hostname}:3001`;