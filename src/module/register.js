require('dotenv').config()
const mongoose=require('mongoose');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userDetails = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    phone: {
        type:Number,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    confirm_password: {
        type:String,
        required:true
    },
    tokens:[{
        token_input:{
            type:String,
            required:true
        }
    }]
  });

//generating jwt tokens
  userDetails.methods.generateAuthToken= async function(){
    try {
        console.log(this._id)
        const token=await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token_input:token})
        await this.save()
        return token
    } catch (error) {
        res.send('the error part '+error)
        console.log('the error part '+error)
    }
  }

//converting password into hash
userDetails.pre("save",async function(next){
    if(this.isModified("password")){
        console.log(`the current passsword is ${this.password}`)
        this.password=await bcrypt.hash(this.password,10)
        console.log(`the current passsword is ${this.password}`)
        this.confirm_password=await bcrypt.hash(this.confirm_password,10)
    }
    next()
})

const registers = mongoose.model('registers', userDetails);

module.exports=registers;