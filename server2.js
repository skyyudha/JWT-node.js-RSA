require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json()) //pasang JWT ke Apps

const {calculateJwkThumbprint, generateKeyPair, SignJWT,exportJWK, 
  importJWK, generateSecret,CompactEncrypt, exportPKCS8, importPKCS8,
  importSPKI  
} = require('jose') //ambil module2 dari lib jose

const fs = require('fs')

var publicKeyRaw = fs.readFileSync('./public11.pem', 'utf8'); //ambil key dari filem pem




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

//coba thumprint
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
  // res.sendStatus(200)
  res.json({ thumbprint: thumbprint})
})

app.post('/login',async (req,res) => { //post karena mau ngirim token
//bagian authentication
    /**
     * untuk saat ini dikosongkan untuk mempercepat implementasi
    **/
//bagian authorization
    const username = req.body.username //ambil body username dari content json

    const user = {name: username}
    
    // let { accessToken, Jwk }  = await  generateAccessToken(user) // generate token JWT
    const accessToken = await  generateAccessToken(user) // generate token JWT
    // console.log("batas B")
    // console.log(accessToken)
    // console.log(Jwk)
    // console.log("batas B")

    // res.json({ accessToken: accessToken, secret: Jwk }) //return value
    res.json({ accessToken: accessToken}) //return value
})



async function generateAccessToken(user){
    const algoritmaKey = 'ECDH-ES'

    // const {
    //     privateKey,
    //     publicKey
    // } = await generateKeyPair(algoritmaKey); 

    // // const thumbprint = await calculateJwkThumbprint({
    // //   kty: 'RSA',
    // //   e: 'AQAB',
    // //   n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ'
    // // })    
    // // console.log(thumbprint)
    
    const secretKey = await importSPKI (publicKeyRaw, algoritmaKey) //import jwk dan langsung convert ke Object Key

    // var uint8array = new TextEncoder("utf-8").encode(secret); //convert secret to uint8array
    // const uint8array = new TextEncoder("utf-8").encode(JSON.stringify(payload));
    const payload = { //data yang ingin dikirim
      "data": "xyz"
  }

    const encoder = new TextEncoder("utf-8")
    // const jwe =  await new CompactEncrypt(encoder.encode(JSON.stringify(payload)))
    return await new CompactEncrypt(encoder.encode(JSON.stringify(payload)))
        .setProtectedHeader({
            alg: 'ECDH-ES+A128KW',
            // alg: 'RSA-OAEP-256',
            enc: 'A256GCM'
        })//deklarasi algorima2 yang digunakan
        .encrypt(secretKey) //encrypt full termasuk payload dengan enc

  // let accessToken = jwe, Jwk = privateKeyRaw; return { accessToken, Jwk};  //set variable & return value

}
  
app.listen(4000)