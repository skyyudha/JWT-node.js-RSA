//console.log("kamu")
require('dotenv').config()

const express = require('express')
const app = express()

const fs = require('fs')
var accessPrivateKey = fs.readFileSync('./jwtRS256.key');
var accessPublicKey = fs.readFileSync('./jwtRS256.key.pub');

var refreshPrivateKey = fs.readFileSync('./refreshJwtRS256.key');
var refreshPublicKey = fs.readFileSync('./refreshJwtRS256.key.pub');

//const { SignJWT } = require('jose/jwt/sign') //get library JWT
//const jose = require('jose');

app.use(express.json()) //pasang JWT ke Apps
//const { importPKCS8 } = require('jose')
const { SignJWT,importSPKI,exportJWK,importPKCS8 } = require('jose')

//const { importJWK } = require('jose')
// (async() => {
//     console.log('before start');
  
//     const rsaPublicKey =  await importJWK({
//         kty: 'RSA',
//         e: 'AQAB',
//         n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ'
//       }, 'PS256')
    
//     console.log('after start');
//   })();

//   const algorithm = 'ES256'
//   const spki = `-----BEGIN PUBLIC KEY-----
//   MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFlHHWfLk0gLBbsLTcuCrbCqoHqmM
//   YJepMC+Q+Dd6RBmBiA41evUsNMwLeN+PNFqib+xwi9JkJ8qhZkq8Y/IzGg==
//   -----END PUBLIC KEY-----`
//   const ecPublicKey = await importSPKI(spki, algorithm)

  const algorithm = 'ES256'
const pkcs8 = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
-----END PRIVATE KEY-----`
// const ecPrivateKey = await importPKCS8(pkcs8, algorithm)
const ecPublicKey = async function() {
    const testkey = await importPKCS8(pkcs8, algorithm)
    console.log(testkey)
  }

const privateJwk = await exportJWK(privateKey)
const publicJwk = await exportJWK(publicKey)
  
console.log(privateJwk)
console.log(publicJwk)

let refreshTokens = [] //not recomended in real production only for demonstrate
//it will make refreshTokens empting out

//###masih ada masalah dalam verify refresh token.
//###refreshTokens array dianggap tidak berisi refreshToken. 
// app.post('/token', (req,res) => {
//     const refreshToken = req.body.token
//     if (refreshToken == null) return res.sendStatus(401)
//     //console.log(refreshTokens)
//     // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
//     SignJWT.verify(jwt, refreshToken, refreshPublicKey,(err,user) =>{ //verifikasi apakah refresh token valid
//         //jika refresh token valid maka akan langsung generate access token baru.
//         //kenapa access token yang lama tidak divalidasi ?
//         // if(err) return res.sendStatus(403) //###masih kena error. tapi yang ini gk tau alasannya
//         const accessToken = generateAccessToken({name: user.name}) //generate access token baru
//         res.json({accessToken: accessToken})
//     })
// })

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
    //const refreshToken =  jwt.sign(user,refreshPrivateKey,{ algorithm: 'RS256', expiresIn: '5m'})
    //refreshTokens.push(refreshToken) //send refreshToken to refreshTokens Array
    res.json({ accessToken: accessToken}) //return value
})

async function generateAccessToken(user){
    //const jwt = await new SignJWT({ 'urn:example:claim': true })
    const jwt = await new SignJWT({ 'urn:example:claim': true })
  .setProtectedHeader({ alg: 'RS256' })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .sign(ecPublicKey)

  console.log("kamu")
  console.log(jwt)
  console.log("kamu")
    // jwt.sign( user, process.env.ACCESS_TOKEN_SECRET) //ambil payload dari jwt header
    return jwt
    //return jwt.sign(user, accessPrivateKey, { algorithm: 'RS256', expiresIn: '5m' }) //ambil payload dari jwt header
    
}

// Call start

  
app.listen(4000)