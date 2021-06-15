const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10; // salt의 길이

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,         // 공백 제거
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ){
    var user = this;

    if(user.isModified('password')){
    //비밀번호를 암호화 시킴.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            });
        });
    }   
})

const User = mongoose.model('User', userSchema)
module.exports = { User } // 다른 곳에서도 쓸 수 있도록.