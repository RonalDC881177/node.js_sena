/**
 * rutas de las estadisticas
 * define el endpoint para obtener las estadisticas generales del sistema
 */

const express = require('express');
const router = express.Router();
const { getStatistcs } = require('../controllers/sraristicsController');

//Get / api/statistics obtiene las estadisyticas del sistema
router.get('/', getStatistics);

module.exports = router;