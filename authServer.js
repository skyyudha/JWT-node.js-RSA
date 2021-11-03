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
const {generateKeyPair, SignJWT,importSPKI,exportJWK,importPKCS8, importJWK, generateSecret  } = require('jose')

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

  // const algorithm = 'ES256'
  // const pkcs8 = fs.readFileSync('./jwtRS256.key.pub');
  // const pkcs8 = `-----BEGIN RSA PUBLIC KEY-----
  // MIIBCgKCAQEA24HWTGus/j/xaCnMBkABdozWw3Kph/g7yg2QcSHuHXQXUaDmNhYG
  // hFgF1EOT6WOZrCqwTxUGbTRPibJ68VRWxGPnPxuWtfRqopzrAaPf41RqwzqIMN8Z
  // lI6BY/ipxNESJRcM5PB2VF7PW0jHHd557+h10AUhiYj0UTjb+Mf37N7hxO0lD37n
  // J588bVQk92ziDhf7AHBMc2n7O29E0YxoG9b3AUO/y9C7gagLCrIv0FPNf88Gcd4v
  // BVEd8sryh/a+OwkaXlXQbEP/aL95EDbGG1ucDDK8ZDV3guEgbAd7RF6Tq9V3nDZ2
  // e8mGBnp5ak8BejTr1VRkYqZA6gLO2vxhMQIDAQAB
  // -----END RSA PUBLIC KEY-----`
  // const pkcs8 = `-----BEGIN PRIVATE KEY-----
  // MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
  // nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
  // l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
  // -----END PRIVATE KEY-----`
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

// let refreshTokens = [] //not recomended in real production only for demonstrate
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


// fs.writeFileSync("secret.key.pub", privateJwk);

// const secret = async function() { await generateSecret('HS256') }
// const privateJwk = async function() {  await exportJWK(secret) }
//       console.log("batas A") 
// console.log(secret)
// console.log("typeof = " + typeof secret)    
// console.log(privateJwk)
// console.log("typeof = " + typeof privateJwk)
//       console.log("batas A") 

app.post('/login',async (req,res) => { //diganti jadi post karena mau ngirim token
//bagian authorization
    const username = req.body.username //gk tau jelasinnya gimana
    const user = {name: username}
    
    // let { accessToken, publicJwk }  =  generateAccessToken(user) //panggil sync fungsi
    let { accessToken, publicJwk }  = await  generateAccessToken(user) //panggil sync fungsi
    console.log("batas B")
    console.log(accessToken)
    console.log(publicJwk)
    console.log("batas B")
  //   let hasil = await accessToken.then(function(result) {
  //     // console.log("batas A")      
  //     // console.log(result) // "Some User token"
  //     // console.log("typeof = " + typeof result)
  //     // console.log("batas A")
  //     // accessToken = result; // fail
  //     return result; // fail
  //  })
    // console.log("batas B")
    // console.log(hasil)
    // console.log("typeof = " + typeof hasil)
    // console.log("batas B")
    // const secret = await generateSecret('ES256')
    // const { publicKey, privateKey } = await generateKeyPair('RS256')
    // console.log(publicKey)
    // console.log(privateKey)
    // const privateJwk = await exportJWK(privateKey)
    // const publicJwk = await exportJWK(publicKey)
    //const refreshToken =  jwt.sign(user,refreshPrivateKey,{ algorithm: 'RS256', expiresIn: '5m'})
    //refreshTokens.push(refreshToken) //send refreshToken to refreshTokens Array
    res.json({ accessToken: accessToken, secret: publicJwk }) //return value
})

async function generateAccessToken(user){
  const { publicKey, privateKey } = await generateKeyPair('RS256')
// console.log(publicKey)
// console.log(privateKey)
    const privateKeyRaw = await exportJWK(privateKey)
    const publicKeyRaw = await exportJWK(publicKey)
    // var uint8array = new TextEncoder("utf-8").encode(secret); //convert secret to uint8array
    const jwt = await new SignJWT({ 'urn:example:claim': true }) // generate token JWT // SignJWT dari library
  .setProtectedHeader({ alg: 'RS256' })
  .setIssuedAt()
  .setIssuer('urn:example:issuer')
  .setAudience('urn:example:audience')
  .setExpirationTime('2h')
  .sign(privateKey)

  let accessToken = jwt, publicJwk = publicKeyRaw;
  // let accessToken = 'John',
  // publicJwk = 'Doe';

// return values
return {
  accessToken,
  publicJwk
};  
}

// Call start

  
app.listen(4000)