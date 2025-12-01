// dev  ⇒  http://127.0.0.1:5000/api
// prod ⇒  /api   (pasa por el proxy HTTPS de OpenLiteSpeed)
const API_BASE =
process.env.NODE_ENV === 'production'
    ? 'http://193.203.182.77:5000/api'   // para el build de prueba
    : 'http://127.0.0.1:5000/api';

    
export default API_BASE;
