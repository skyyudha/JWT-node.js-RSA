//console.log("kamu")
require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require("jsonwebtoken") //get library JWT

app.use(express.json()) //pasang JWT ke Apps

const posts = [
    {
        username: 'lala',
        title: 'Post 1'
    },
    {
        username: 'lili',
        title: 'Post 2'
    }
]
//sekarang coba bikin middleware untuk /posts
app.get('/posts', authenticateToken, (req,res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login',(req,res) => { //diganti jadi post karena mau ngirim token
//bagian untuk Autthenticate user 
    //tapi diskip dulu karena mau fokus ke Authorization

//bagian authorization
    const username = req.body.username //gk tau jelasinnya gimana
    const user = {name: username}

    // jwt.sign( user, process.env.ACCESS_TOKEN_SECRET) //ambil payload dari jwt header
    const accessToken =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m'}) //ambil payload dari jwt header
    res.json({ accessToken: accessToken}) //return value
})

function authenticateToken(req,res,next){
   //token header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
   //Bearer TOKEN sebagai nama token
    if (token == null) return res.sendStatus(401) //jika user tidak memiliki token maka akan return user dan status 401 untuk tidak memilki akses

    //verifikasi token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err) return res.sendStatus(403) //invalid token
        req.user = user
        next()
    })
}

app.listen(3000)