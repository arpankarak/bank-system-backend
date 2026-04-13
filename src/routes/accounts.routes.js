const express = require('express');
const accountMiddleware = require('../middlewares/auth.middleware');
const accountController = require('../controller/account.controller');

const AccountRouter = express();


/**
 * - POST/api/account
 * - Create a new account
 * -Proteccted route
 */
AccountRouter.post("/",accountMiddleware.isLoggedin,accountController.createAccount)


module.exports = AccountRouter;