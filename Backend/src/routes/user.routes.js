const express = require('express');
const authUser = require('../middleware/auth.middleware');
const { getUserProfile } = require('../controllers/user.controller');

const router = express.Router();

router.get("/:userId", authUser, getUserProfile);

module.exports = router;
