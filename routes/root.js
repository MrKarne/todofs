const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/regauth(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'regauth.html'));
});


module.exports = router;