const  express = require('express');
const transactionRouter = express();
const authMiddleware = require('../middlewares/auth.middleware');
const transactionController = require('../controller/transactions.controller')



/**
 * -  POST/api/transactions/
 */

transactionRouter.post("/",authMiddleware.isLoggedin,transactionController.createTransaction);

/**
 * -POST/api/transactions/system/initia;-funds
 */

transactionRouter.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController);






module.exports = transactionRouter;