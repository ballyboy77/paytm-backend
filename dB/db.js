require("dotenv").config()
const mongoose = require("mongoose");


let uri = "mongodb+srv://sushanslondhe1357:plmqaz%40123@cluster0.scyh4zm.mongodb.net/"

mongoose.connect(uri)

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30

    },
    FirstName:{
       type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    LastName:{
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    Age:{
        type: Number,
        required:true
        


    },
    password:{
        type:String,
        required: true,
        minLength:6,
        maxLength:15
    }

})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance :{
        type: Number,
        required: true
    }

})

const User = mongoose.model('User',userSchema);
const Account = mongoose.model('Account',accountSchema);

module.exports={
    User,
    Account

}