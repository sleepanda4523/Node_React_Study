const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword : 12345678      cipherPassword : $2b$10$TzwIeVj.hvAkajjKqU9oj.pvKUGg79c/ZKKSFjBwIOpaoucXEcb.a
    //암호화된 비번을 복호화 할 순 없으므로 평문 비번을 암호화 해 비교한다.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    // jwt를 이용해 토큰 생성
    var token = jwt.sign(user._id.toHexString(),'secretToken')
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.methods.findByToken = function(token, cb) {
    var user = this;
    //Token decode
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 통해 유저 탐색 후 
        // 클라이언트 토큰과 DB 토큰 비교

        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)
module.exports = { User } // 다른 곳에서도 쓸 수 있도록.