const express =  require('express')
const app = express()
const port = 5000
const { User } = require('./models/User');
const bodyParser = require('body-parser')

const config = require('./config/key');

//application/x-www
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connect'))
    .catch(err => console.log(err))



app.get('/', (req,res) => res.send('Hello World!'))

//회원가입을 위한 라우트
app.post('/register', (req, res) => {
    //회원가입 할때 필요한 정보들을 Client에서 가져오면
    //그것들을 DB에 넣어줌.
    const user = new User(req.body);
    
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))