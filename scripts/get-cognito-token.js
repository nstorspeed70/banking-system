const open = require('open');

const config = {
    domain: 'sistema-bancario-dev.auth.us-east-1.amazoncognito.com',
    clientId: '2qg67m083md62on495ptt3okqs',
    redirectUri: 'http://localhost:3000/auth/callback',
    region: 'us-east-1'
};

const authUrl = `https://${config.domain}/oauth2/authorize?` +
    `client_id=${config.clientId}&` +
    `response_type=token&` +
    `scope=openid+email+profile&` +
    `redirect_uri=${encodeURIComponent(config.redirectUri)}`;

console.log('\nAbriendo el navegador para autenticación...');
console.log('\nDespués de iniciar sesión, serás redirigido a una URL que contiene el token.');
console.log('Copia el token (access_token) de la URL y úsalo en tus llamadas API.');
console.log('\nURL de autenticación:');
console.log(authUrl);

open(authUrl);
