require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json()) //pasang JWT ke Apps

const {calculateJwkThumbprint, generateKeyPair, SignJWT,exportJWK, importJWK, generateSecret,CompactEncrypt, exportPKCS8  } = require('jose') //ambil module2 dari lib jose

//https://www.npmjs.com/search?q=jwk%20to%20pem
// var Rasha = require('rasha');//library untuk pem2jwk & jwk2pem KHUSUS RSA
// var Eckles = require('eckles'); //library untuk pem2jwk & jwk2pem KHUSUS EC
//npm install -g eckles | npm install --save eckles
//npm i rasha

const fs = require('fs')
// var accessPrivateKey = fs.readFileSync('./jwtRS256.key');
// var accessPublicKey = fs.readFileSync('./jwtRS256.key.pub');

// var refreshPrivateKey = fs.readFileSync('./refreshJwtRS256.key');
// var refreshPublicKey = fs.readFileSync('./refreshJwtRS256.key.pub');


//##//verifikasi dan generate refreshToken baru dari refreshToken lama

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

app.post('/test',async (req,res)=>{
  const thumbprint = await calculateJwkThumbprint({
    "kty": "EC",
    "crv": "P-256",
    "x": "iORhbZH_0dxs_tmdWZAUk2SBwpd6K06OW6FlQMAqe5g",
    "y": "jJ_lZnyzZsiQ9WgRhRhMFjy0_7jcAgglcNqX1ILeXNU",
    "d": "msKmLbK_iLofdVkbs7TQPDcWCYwo9bji0CIyUQrno7o"
  })
  console.log("batas B")
  console.log(thumbprint)
  console.log("batas B")
  res.sendStatus(200)
  res.json({ thumbprint: thumbprint})
})

app.post('/login',async (req,res) => { //diganti jadi post karena mau ngirim token
//bagian authorization
    const username = req.body.username //gk tau jelasinnya gimana
    // console.log("typeof = " + typeof username)
    // console.log("secret = " + username)
    const user = {name: username}
    
    let { accessToken, Jwk }  = await  generateAccessToken(user) // generate token JWT
    // let { accessToken}  = await  generateAccessToken(user) // generate token JWT
    // console.log("batas B")
    // console.log(accessToken)
    // console.log(Jwk)
    // console.log("batas B")

    res.json({ accessToken: accessToken, secret: Jwk }) //return value
    // res.json({ accessToken: accessToken}) //return value
})



async function generateAccessToken(user){
    // const { publicKey, privateKey } = await generateKeyPair('RS256') //generate Key format objectKey
    // console.log(publicKey)
    // console.log(privateKey)
    const algoritmaKey = 'ECDH-ES'

      const {
        privateKey,
        publicKey
    } = await generateKeyPair(algoritmaKey);

    // const thumbprint = await calculateJwkThumbprint({
    //   kty: 'RSA',
    //   e: 'AQAB',
    //   n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ'
    // })
    
    // console.log(thumbprint)
    // const secret = await generateSecret('A256GCM')

    const privateKeyRaw = await exportPKCS8(privateKey)
    console.log(privateKeyRaw)
    fs.writeFileSync("public11.pem", privateKeyRaw); //export file pem

    const publicKeyRaw = await exportJWK(publicKey) //export key to JWK
    

    // var jwk2pem = Eckles
    // if (algoritmaKey == 'PS256' || algoritmaKey == 'RS256' ) jwk2pem = Rasha;

    // await jwk2pem.export({ jwk: privateKeyRaw }).then(function (pem) { //convert jwk2 pem & export to file
    //   // PEM in PKCS1 (traditional) format
    //   console.log(pem)
    //   fs.writeFileSync("public11.pem", pem); //export file pem
    // });    


    // var uint8array = new TextEncoder("utf-8").encode(secret); //convert secret to uint8array
    // const uint8array = new TextEncoder("utf-8").encode(JSON.stringify(payload));
    const payload = {
      "data": "xyz"
  }
    const encoder = new TextEncoder("utf-8")
    const jwe = await new CompactEncrypt(encoder.encode(JSON.stringify(payload)))
        .setProtectedHeader({
            alg: 'ECDH-ES+A128KW',
            // alg: 'RSA-OAEP-256',
            enc: 'A256GCM'
        })
        /*
        .setProtectedHeader({
            alg: 'ECDH-ES+A128KW',
            enc: 'A128GCM'
        })
        */
        .encrypt(publicKey)

  //   const jwt = await new SignJWT({ 'urn:example:claim': true }) // generate token JWT // SignJWT dari library
  // .setProtectedHeader({ alg: 'RS256' })
  // .setIssuedAt()
  // .setIssuer('urn:example:issuer')
  // .setAudience('urn:example:audience')
  // .setExpirationTime('2h')
  // .sign(privateKey) //untuk key yg digunakan adalah key yg formatnya objectKey

  let accessToken = jwe, Jwk = privateKeyRaw; return { accessToken, Jwk};  //set variable & return value
  // return { jwe};  //return value
}
  
app.listen(4000)