const express = require('express');
const router = express.Router();
const authController = require('../controller/auth-controller');

/*POST/api/auth/register */
router.post("/register",authController.userRegisterController);
router.post("/login",authController.userLoginController);

module.exports = router;