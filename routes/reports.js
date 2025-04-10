const express = require('express');
const router = express.Router();
const { getReporteBancoomeva } = require('../services/getReports');

// Ruta para mostrar el formulario
router.get('/', (req, res) => {
    res.render('reportForm');
});

// Ruta para procesar la consulta
router.post('/', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token no proporcionado'
            });
        }

        console.log('Token recibido:', token);
        console.log('Datos recibidos:', req.body);

        const params = {
            requestId: req.body.requestId,
            aliadoId: req.body.aliadoId,
            fechaPeticion: req.body.fechaPeticion,
            terminal: req.body.terminal,
            canal: req.body.canal || 'WEB',
            usuario: req.body.usuario,
            t: req.body.t,
            fechaInicio: req.body.fechaInicio,
            fechaFin: req.body.fechaFin,
            numeroDocumento: req.body.numeroDocumento,
            token: token,
            referencia1: req.body.referencia1,
            referencia2: req.body.referencia2,
            referencia3: req.body.referencia3
        };

        console.log('Parámetros a enviar:', params);

        const result = await getReporteBancoomeva(params);
        console.log('Resultado de la consulta:', result);

        if (result.success) {
            res.json({
                success: true,
                data: result.data
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error en la ruta de consulta:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router; 