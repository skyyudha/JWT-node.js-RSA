//console.log("kamu")
require('dotenv').config()

const express = require('express')
const app = express()

const fs = require('fs')
// var accessPrivateKey = fs.readFileSync('./jwtRS256.key');
// var accessPublicKey = fs.readFileSync('./jwtRS256.key.pub');

var refreshPrivateKey = fs.readFileSync('./refreshJwtRS256.key');
var refreshPublicKey = fs.readFileSync('./refreshJwtRS256.key.pub');

//const { SignJWT } = require('jose/jwt/sign') //get library JWT
//const jose = require('jose');

app.use(express.json()) //pasang JWT ke Apps
//const { importPKCS8 } = require('jose')
const { SignJWT,importSPKI,exportJWK,importPKCS8, importJWK } = require('jose')

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

  const algorithm = 'ES256'
  // const pkcs8 = fs.readFileSync('./jwtRS256.key.pub');
  // const pkcs8 = `-----BEGIN RSA PUBLIC KEY-----
  // MIIBCgKCAQEA24HWTGus/j/xaCnMBkABdozWw3Kph/g7yg2QcSHuHXQXUaDmNhYG
  // hFgF1EOT6WOZrCqwTxUGbTRPibJ68VRWxGPnPxuWtfRqopzrAaPf41RqwzqIMN8Z
  // lI6BY/ipxNESJRcM5PB2VF7PW0jHHd557+h10AUhiYj0UTjb+Mf37N7hxO0lD37n
  // J588bVQk92ziDhf7AHBMc2n7O29E0YxoG9b3AUO/y9C7gagLCrIv0FPNf88Gcd4v
  // BVEd8sryh/a+OwkaXlXQbEP/aL95EDbGG1ucDDK8ZDV3guEgbAd7RF6Tq9V3nDZ2
  // e8mGBnp5ak8BejTr1VRkYqZA6gLO2vxhMQIDAQAB
  // -----END RSA PUBLIC KEY-----`
  const pkcs8 = `-----BEGIN PRIVATE KEY-----
  MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
  nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
  l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
  -----END PRIVATE KEY-----`
  // const ecPublicKey = await importSPKI(spki, algorithm)

//   const algorithm = 'ES256'
// const pkcs8 = `-----BEGIN PRIVATE KEY-----
// MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
// nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
// l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
// -----END PRIVATE KEY-----`
// const ecPrivateKey = await importPKCS8(pkcs8, algorithm)
// const rsaPublicKey = async function() {
//     return await importPKCS8(pkcs8, algorithm)
    
//     //console.log(testkey)
//   }
//   console.log("hai")
//   console.log(typeof rsaPublicKey); //function
// const privateJwk = await exportJWK(privateKey)
// const publicJwk = await exportJWK(publicKey)
  
// console.log(privateJwk)
// console.log(publicJwk)

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

app.post('/login',async (req,res) => { //diganti jadi post karena mau ngirim token
//bagian authorization
    const username = req.body.username //gk tau jelasinnya gimana
    const user = {name: username}
    
    var accessToken =  generateAccessToken(user) //panggil sync fungsi

    let hasil = await accessToken.then(function(result) {
      console.log("batas A")      
      console.log(result) // "Some User token"
      console.log("typeof = " + typeof result)
      console.log("batas A")
      // accessToken = result; // fail
      return result; // fail
   })
    console.log("batas B")
    console.log(hasil)
    console.log("typeof = " + typeof hasil)
    console.log("batas B")

    //const refreshToken =  jwt.sign(user,refreshPrivateKey,{ algorithm: 'RS256', expiresIn: '5m'})
    //refreshTokens.push(refreshToken) //send refreshToken to refreshTokens Array
    res.json({ accessToken: hasil}) //return value
})

async function generateAccessToken(user){
    const secret = `MIIBPAIBAAJBALJaeVlgMfxZUWglk0PZZBkbmnkZkFAbqtaTJqeCIXa8xscPVvxJ
    h2JjhwC4OwsVBgHvrhIwVLodgrQbYRpuVF0CAwEAAQJABIwoAe5g9+UzHSuwGI/H
    bJh2lNXhBxndfkEcQDMiNUvJ22rVf+v+YsrxMLWkwoss3jERZ7JKNFepbNuir9SG
    IQIhAP1406f4FoWMDwfjMjf1rkCEfyOzAZ320us8mZBPMFPFAiEAtCHaG14NlC1z
    mV29jWVh9YoDECcoS2zAvunJRv6IT7kCIQD7Cgw2s9M6eTj5yt8V5VGrvI5fQQ88
    8BR9vwsojgWDMQIhAKdAo1Yz3yHNjf9CBcVq9CjbS3rNEOHviYv6YNQVdBWpAiEA
    mlJ9E20+boNRHie/PGmjZyOM9mkjOyLLMqIbGhRe4vM=`
    var uint8array = new TextEncoder("utf-8").encode(secret); //convert secret to uint8array    
    const jwt = await new SignJWT({ 'urn:example:claim': true }) // generate token JWT // SignJWT dari library
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .sign(uint8array)
    return jwt //return sukses //output object     
}

// Call start

  
app.listen(4000)