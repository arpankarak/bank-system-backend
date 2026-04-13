const mongoose = require('mongoose');
const { match } = require('node:assert');
const bcrypt = require('bcrypt');
const { type } = require('node:os');
const { StringDecoder } = require('node:string_decoder');


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique:[true,"email already exists"]
  },
  name:{
    type:String,
    required:[true,"name is requierd for creating a account"],

  },
  password:{
    type:String,
    required:[true,"passwprd is requier  for creating an account"],
    minlength:[6,"password should contain more than 6 character"],
    select: false,
  },
  systemUser:{
    type:Boolean,
    default:false,
    immutable:true,
    select:false
  }
},{
    timestamps:true
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return 
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

     ;
    
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}
const userModel = mongoose.model("user",userSchema);

module.exports = userModel;
