const axios = require('axios');
const moment = require('moment');

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

function formatearFecha(fecha) {
    return moment(fecha).format('DD/MM/YYYY HH:mm');
}

function isValidDateFormat(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    return regex.test(dateString);
}

async function getReporteBancoomeva(params) {
    try {
        // Obtener token
        const token = await getBancoomevToken();
        
        if (!token) {
            throw new Error('No se pudo obtener el token de autenticación');
        }

        // Validar formato de fechas
        if (!isValidDateFormat(params.fechaInicial) || !isValidDateFormat(params.fechaFinal)) {
            throw new Error('Formato de fecha inválido. Use el formato: yyyy-mm-ddTHH:mm:ssZ');
        }

        // Validar tipo y número de documento
        if (!params.tipoDocumento || !params.numeroDocumento) {
            throw new Error('El tipo y número de documento son obligatorios');
        }

        const requestData = {
            requestId: params.requestId || Date.now().toString(),
            fechaInicial: params.fechaInicial,
            fechaFinal: params.fechaFinal,
            tipoDocumento: params.tipoDocumento,
            numeroDocumento: params.numeroDocumento
        };

        console.log('Consultando reporte con datos:', requestData);

        const response = await axios({
            method: 'post',
            url: 'https://s5s6nqk77i.execute-api.us-east-1.amazonaws.com/consulta_desembolsos',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: requestData
        });

        console.log('Respuesta del servicio:', response.data);

        if (response.data && response.data.statusCode === 200) {
            const desembolsos = response.data.data.desembolsos || [];
            
            return {
                success: true,
                data: {
                    datosAliado: {
                        nombre: "COMEVA",
                        nit: "890.300.625-1",
                        fechaConsulta: formatearFecha(new Date())
                    },
                    datosConsultados: {
                        fechaInicial: formatearFecha(params.fechaInicial),
                        fechaFinal: formatearFecha(params.fechaFinal),
                        tipoDocumento: params.tipoDocumento,
                        numeroDocumento: params.numeroDocumento
                    },
                    desembolsos: desembolsos.map(d => ({
                        ...d,
                        fechaRegistro: formatearFecha(d.fechaRegistro),
                        fechaDesembolso: formatearFecha(d.fechaDesembolso),
                        monto: new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(d.monto)
                    }))
                }
            };
        } else {
            return {
                success: false,
                error: response.data.message || 'Error al consultar el reporte'
            };
        }

    } catch (error) {
        console.error('Error al consultar reporte:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
}

module.exports = { getReporteBancoomeva }; 