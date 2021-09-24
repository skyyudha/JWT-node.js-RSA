//console.log("kamu")
require('dotenv').config()

const express = require('express')
const app = express()

const fs = require('fs')
var publicKey = fs.readFileSync('./jwtRS512.key.pub');

const jwt = require("jsonwebtoken") //get library JWT

app.use(express.json()) //pasang JWT ke Apps

const posts = [
    {
        username: 'lili',
        title: 'Post 2'
    }
]
//sekarang coba bikin middleware untuk /posts
app.get('/posts', authenticateToken, (req,res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req,res,next){
   //token header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
   //Bearer TOKEN sebagai nama token
    if (token == null) return res.sendStatus(401) //jika user tidak memiliki token maka akan return user dan status 401 untuk tidak memilki akses

    //verifikasi token
    jwt.verify(token, publicKey, (err,user) => {
        if(err) return res.sendStatus(403) //invalid token
        req.user = user
        next()
    })
}

app.listen(5000)