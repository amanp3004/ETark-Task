const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name : { 
        type: String, 
        required : true, 
        trim:true, 
        lowercase: true},
    email : {
        type : String,
        unique : true,
        required : true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("This is not a valid Email address")
            }
        }
    },
    password : {
        type: String,
        required: true,
        trim:true,
        minlength:6,
        validate(value){
            if(value.toLowerCase() === "password")
            throw new Error("This is a very weak password, try again!!");
        }},
    tokens : [{
            token :{
                type : String,
                required : true
            }
    }]
    });


    userSchema.methods.toJSON = function(){
        const user = this;
        const userObject = user.toObject();
        delete userObject.password; 
        delete userObject.tokens;
        return userObject;
    }


    userSchema.statics.findByCredentials = async (email,password)=>{
        const user = await User.findOne({email: email});
        if(!user)
        {
            throw new Error("Unable to Login!!")
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            throw new Error("Unable to login!!")
        }
        return user;
    }

    userSchema.methods.generateAuthToken = async function(){
        const user = this;
        const token = jwt.sign({_id:user._id.toString()},thisismynewtask);
        user.tokens = user.tokens.concat({token});
        await user.save();
        return token;
    }

    userSchema.pre('save', async function(next){
        const user = this;

        if(user.isModified('password')){
            user.password = await bcrypt.hash(user.password, 8);
        }

        next();
    });

const User = mongoose.model('User',userSchema);
module.exports = User;