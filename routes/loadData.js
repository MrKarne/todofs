const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadController');

router.get('/', loadController.handleLoad);

module.exports = router;