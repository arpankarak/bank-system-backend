const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
/**
 * - Routes getting
 */


const authRouter = require('./routes/auth-routes');
const AccountRouter = require('./routes/accounts.routes');
const transactionRouter = require('./routes/transactions.routes');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

/**
 * - Use Routes
 */

app.use("/api/auth",authRouter);
app.use("/api/accounts",AccountRouter);
app.use("api/transaction",transactionRouter);


module.exports = app;