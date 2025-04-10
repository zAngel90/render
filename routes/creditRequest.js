const express = require('express');
const router = express.Router();
const { generateCreditUrl } = require('../services/generateUrl');

// Ruta para mostrar el formulario
router.get('/', (req, res) => {
    res.render('creditForm');
});

// Ruta para generar URL
router.post('/generate-url', async (req, res) => {
    try {
        const params = {
            monto: req.body.monto,
            referencia1: req.body.referencia1,
            referencia2: req.body.referencia2,
            referencia3: req.body.referencia3
        };

        console.log('Parámetros recibidos:', params);

        const result = await generateCreditUrl(params);

        if (result.success) {
            res.json({
                success: true,
                url: result.url
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error en la ruta de generación de URL:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router; 