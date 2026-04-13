const mongoose = require('mongoose');
function connectToDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connnected to database");
    })
    .catch((err)=>{
        console.log(err.message);
        process.exit(1);
    })
}

module.exports = connectToDB