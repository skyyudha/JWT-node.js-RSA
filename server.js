//console.log("kamu")
require('dotenv').config()
var Rasha = require('rasha');

const express = require('express')
const app = express()

const fs = require('fs')
var publicKey = fs.readFileSync('./public11.pem', 'utf8');
// var publicKey = fs.readFileSync('./secret.key.pub', 'utf8');

// const jwt = require("jsonwebtoken") //get library JWT
const { jwtVerify, importJWK  } = require('jose')
app.use(express.json()) //pasang JWT ke Apps
// const algorithm = 'RS256'
// const pkcs8 = fs.readFileSync('./jwtRS256.key');
// const rsaPrivateKey = await importPKCS8(pkcs8, algorithm)
// const rsaPrivateKey = async function() {
//     await importPKCS8(pkcs8, algorithm)
//     //console.log(testkey)
//   }
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

async function authenticateToken(req,res,next){
    // const secret = `MIIBPAIBAAJBALJaeVlgMfxZUWglk0PZZBkbmnkZkFAbqtaTJqeCIXa8xscPVvxJ
    // h2JjhwC4OwsVBgHvrhIwVLodgrQbYRpuVF0CAwEAAQJABIwoAe5g9+UzHSuwGI/H
    // bJh2lNXhBxndfkEcQDMiNUvJ22rVf+v+YsrxMLWkwoss3jERZ7JKNFepbNuir9SG
    // IQIhAP1406f4FoWMDwfjMjf1rkCEfyOzAZ320us8mZBPMFPFAiEAtCHaG14NlC1z
    // mV29jWVh9YoDECcoS2zAvunJRv6IT7kCIQD7Cgw2s9M6eTj5yt8V5VGrvI5fQQ88
    // 8BR9vwsojgWDMQIhAKdAo1Yz3yHNjf9CBcVq9CjbS3rNEOHviYv6YNQVdBWpAiEA
    // mlJ9E20+boNRHie/PGmjZyOM9mkjOyLLMqIbGhRe4vM=`
    // const refreshToken = req.body.secret
    // var uint8array = new TextEncoder("utf-8").encode(secret); //convert secret to uint8array    
   //token header
   console.log("batas B");
   console.log(publicKey);
   console.log("type= "+typeof(publicKey));
   console.log("batas B/");

    const publicKeyRaw = await Rasha.import({ pem: publicKey }).then(function (jwk) {
        console.log(jwk);
        return jwk;
    });
    console.log("batas A");
    console.log(publicKeyRaw);
    console.log("type= "+typeof(publicKeyRaw));
    console.log("batas A/");

    const RSAPublicKey = await importJWK(publicKeyRaw, 'RS256')
    console.log("batas C");
    console.log(RSAPublicKey);
    console.log("type= "+typeof(publicRSAPublicKeyKeyRaw));
    console.log("batas C/");
 
   const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // const secret = req.body.secret
    // console.log("typeof = " + typeof secret)
    // console.log("secret = " + secret)
    // const rsaPublicKey = await importJWK(secret)
    // console.log("key= " + rsaPublicKey)
   //Bearer TOKEN sebagai nama token
    if (token == null) return res.sendStatus(401) //jika user tidak memiliki token maka akan return user dan status 401 untuk tidak memilki akses
    const { payload, protectedHeader } = await jwtVerify(token, RSAPublicKey, {
        issuer: 'urn:example:issuer',
        audience: 'urn:example:audience'
      })
      console.log(protectedHeader)
      console.log(payload)
    //verifikasi token
    // jwt.verify(token, publicKey, (err,user) => {
    //     if(err) return res.sendStatus(403) //invalid token
    //     req.user = user
    //     next()
    // // })
    // const { payload, protectedHeader } = await jwtVerify(token, rsaPrivateKey, {
    //     issuer: 'urn:example:issuer',
    //     audience: 'urn:example:audience'
    //   })
      
    //   console.log(protectedHeader)
    //   console.log(payload)
}

app.listen(3000)