const express = require('express');

const router = express.Router();

module.exports = (params) => {
    // Destructuring assignment
    const { speakers } = params;
  
    // Now let's define the index route and mount it on slash.
  
    router.get('/health', (req, res) => res.send(200, { status: 'OK' }));
    return router;
  };
