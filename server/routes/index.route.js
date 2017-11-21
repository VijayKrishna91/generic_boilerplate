'use strict';

const express = require("express");
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/api/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/api/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// export default router;
module.exports = router;
