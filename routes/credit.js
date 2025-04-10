const express = require('express');
const router = express.Router();
const { generateCreditUrl } = require('../services/generateUrl');

// Ruta para generar URL
router.post('/generate-url', async (req, res) => {
    try {
        const result = await generateCreditUrl(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router; 