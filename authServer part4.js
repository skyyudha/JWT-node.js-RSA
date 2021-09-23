//console.log("kamu")
require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require("jsonwebtoken") //get library JWT

app.use(express.json()) //pasang JWT ke Apps

let refreshTokens = [] //not recomended in real production only for demonstrate
//it will make refreshTokens empting out

//###masih ada masalah dalam verify refresh token.
//###refreshTokens array dianggap tidak berisi refreshToken. 
app.post('/token', (req,res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    //console.log(refreshTokens)
    // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err,user) =>{ //verifikasi apakah refresh token valid
        // if(err) return res.sendStatus(403) //###masih kena error. tapi yang ini gk tau alasannya
        const accessToken = generateAccessToken({name: user.name}) //generate access token baru
        res.json({accessToken: accessToken})
    })
})

app.delete('/logout',(req,res)=>{
    refreshTokens = refreshTokens.filter(token =>token !== req.body.token)
    res.sendStatus(204)
})

app.post('/login',(req,res) => { //diganti jadi post karena mau ngirim token
//bagian untuk Autthenticate user 
    //tapi diskip dulu karena mau fokus ke Authorization

//bagian authorization
    const username = req.body.username //gk tau jelasinnya gimana
    const user = {name: username}
    
    const accessToken =  generateAccessToken(user)
    const refreshToken =  jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '10m'})
    refreshTokens.push(refreshToken) //send refreshToken to refreshTokens Array
    res.json({ accessToken: accessToken, refreshToken: refreshToken}) //return value
})

function generateAccessToken(user){
    // jwt.sign( user, process.env.ACCESS_TOKEN_SECRET) //ambil payload dari jwt header
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m'}) //ambil payload dari jwt header
    
}

app.listen(4000)