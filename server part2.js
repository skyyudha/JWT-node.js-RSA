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

app.get('/posts',(req,res) => {
    res.json(posts)
})

app.post('/login',(req,res) => { //diganti jadi post karena mau ngirim token
//bagian untuk Autthenticate user 
    //tapi diskip dulu karena mau fokus ke Authorization

//bagian authorization
    const username = req.body.username //gk tau jelasinnya gimana
    const user = { name: username}

    // jwt.sign( user, process.env.ACCESS_TOKEN_SECRET) //ambil payload dari jwt header
    const accessToken =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) //ambil payload dari jwt header
    res.json({accesstoken: accessToken}) //return value

})

app.listen(3000)