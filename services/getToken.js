const axios = require('axios');

async function getBancoomevToken() {
    try {
        const credentials = {
            username: "natu3626",
            password: "A3+ZVBw6"
        };

        const response = await axios({
            method: 'post',
            url: 'https://s5s6nqk77i.execute-api.us-east-1.amazonaws.com/get_tokens_convenio_empresa',
            headers: {
                'Content-Type': 'application/json'
            },
            data: credentials
        });

        if (response.data && response.data.statusCode === 200) {
            console.log('Token obtenido exitosamente');
            console.log('AccessToken:', response.data.data.AccessToken);
            return response.data.data.AccessToken;
        } else {
            console.error('Error al obtener el token:', response.data.message);
            return null;
        }
    } catch (error) {
        console.error('Error en la petición:', error.message);
        return null;
    }
}

module.exports = { getBancoomevToken };

// Para usar la función:
// getBancoomevToken().then(token => {
//     if (token) {
//         console.log('Token obtenido correctamente');
//     }
// }); 