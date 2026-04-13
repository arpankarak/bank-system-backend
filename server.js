require('dotenv').config();
const server = require('./src/app');
const connectToDB = require('./src/config/db')

connectToDB();
server.listen(3000,()=>{
    console.log("server is running at port 3000..")
})