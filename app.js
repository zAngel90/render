const express = require('express');
const path = require('path');
const creditRoutes = require('./routes/credit');
const reportsRoutes = require('./routes/reports');

const app = express();

// Configuración de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas principales
app.get('/', (req, res) => {
    res.render('creditForm');
});

// Rutas de la API
app.use('/api', creditRoutes);
app.use('/reports', reportsRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

const port = 8080;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app; 