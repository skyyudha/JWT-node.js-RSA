require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json()) //pasang JWT ke Apps

const {generateKeyPair, SignJWT,exportJWK, importJWK, generateSecret,CompactEncrypt } = require('jose') //ambil module2 dari lib jose

var Rasha = require('rasha');//library untuk pem2jwk & jwk2pem
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

app.post('/login',async (req,res) => { //diganti jadi post karena mau ngirim token
//bagian authorization
    const username = req.body.username //gk tau jelasinnya gimana
    // console.log("typeof = " + typeof username)
    // console.log("secret = " + username)
    const user = {name: username}
    
    let { accessToken, publicJwk }  = await  generateAccessToken(user) // generate token JWT
    // console.log("batas B")
    // console.log(accessToken)
    // console.log(publicJwk)
    // console.log("batas B")

    res.json({ accessToken: accessToken, secret: publicJwk }) //return value
})



async function generateAccessToken(user){
    // const { publicKey, privateKey } = await generateKeyPair('RS256') //generate Key format objectKey
    // console.log(publicKey)
    // console.log(privateKey)
      const {
        privateKey,
        publicKey
    } = await generateKeyPair('PS256');

    const secret = await generateSecret('A256GCM')
    const payload = {
      "data": "xyz"
  }
    const privateKeyRaw = await exportJWK(privateKey)
    const publicKeyRaw = await exportJWK(publicKey) //export key to JWK

    await Rasha.export({ jwk: privateKeyRaw }).then(function (pem) { //convert jwk2 pem & export to file
      // PEM in PKCS1 (traditional) format
      // console.log("batas B")
      // console.log(pem);
      // console.log("batas B")
      fs.writeFileSync("public11.pem", pem); //export file pem
      // return pem
    });    

    // var uint8array = new TextEncoder("utf-8").encode(secret); //convert secret to uint8array
    const uint8array = new TextEncoder("utf-8").encode(JSON.stringify(payload));
    const jwe = await new CompactEncrypt(uint8array)
        .setProtectedHeader({
            alg: 'RSA-OAEP-256',
            enc: 'A256GCM'
        })
        .setContentEncryptionKey(secret)
        .encrypt(privateKey)

  //   const jwt = await new SignJWT({ 'urn:example:claim': true }) // generate token JWT // SignJWT dari library
  // .setProtectedHeader({ alg: 'RS256' })
  // .setIssuedAt()
  // .setIssuer('urn:example:issuer')
  // .setAudience('urn:example:audience')
  // .setExpirationTime('2h')
  // .sign(privateKey) //untuk key yg digunakan adalah key yg formatnya objectKey

  let accessToken = jwe, publicJwk = privateKeyRaw; return { accessToken, publicJwk};  //set variable & return value
}
  
app.listen(4000)