const { User } = require('./models/User')

let auth = (req, res, next) => {
    //인증 처리 코드
    
    //client cookie에서 token 획득
    let token = req.cookies.x_auth;

    // token 복호화 후 User 탐색
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true})

        req.token = token;
        req.user = user;
        next()
    })
    // User가 있으면 인증 O, 없으면 X

}

module.exports = { auth };