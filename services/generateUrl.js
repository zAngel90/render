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
            return response.data.data.IdToken;
        } else {
            throw new Error(response.data.message || 'Error al obtener el token');
        }
    } catch (error) {
        console.error('Error al obtener el token:', error.message);
        throw error;
    }
}

async function generateCreditUrl(params) {
    try {
        // Primero obtenemos el token
        const token = await getBancoomevToken();
        
        if (!token) {
            throw new Error('No se pudo obtener el token de autenticación');
        }

        // Validamos el monto
        const monto = parseInt(params.monto);
        if (monto < 200000 || monto > 5000000) {
            throw new Error('El monto debe estar entre $200,000 y $5,000,000');
        }

        // Validamos que las referencias requeridas estén presentes
        if (!params.referencia1 || !params.referencia2) {
            throw new Error('Las referencias 1 y 2 son obligatorias');
        }

        // Solo enviamos los campos requeridos según la documentación
        const requestData = {
            monto: monto,
            referencia1: params.referencia1,
            referencia2: params.referencia2,
            referencia3: 'CONV001'  // Valor por defecto para referencia3
        };

        console.log('Datos a enviar:', requestData);

        const response = await axios({
            method: 'post',
            url: 'https://s5s6nqk77i.execute-api.us-east-1.amazonaws.com/generate_url',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: requestData
        });

        console.log('Respuesta de generación de URL:', response.data);

        if (response.data && response.data.statusCode === 200) {
            return {
                success: true,
                url: response.data.data.url
            };
        } else {
            return {
                success: false,
                error: response.data.message || 'Error al generar la URL'
            };
        }

    } catch (error) {
        console.error('Error al generar URL:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
}

module.exports = { generateCreditUrl }; 