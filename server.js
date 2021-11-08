require('dotenv').config()


const express = require('express')
const app = express()
// var Rasha = require('rasha');//library untuk pem2jwk & jwk2pem KHUSUS RSA
// var Eckles = require('eckles'); //library untuk pem2jwk & jwk2pem KHUSUS EC

const fs = require('fs')
var publicKey = fs.readFileSync('./public11.pem', 'utf8'); //ambil key dari filem pem
//test print 
// console.log("batas B"); console.log(publicKey); console.log("type= "+typeof(publicKey)); console.log("batas B/");

// var publicKey = fs.readFileSync('./secret.key.pub', 'utf8');

const { jwtVerify, importJWK, compactDecrypt,importPKCS8  } = require('jose')
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
//sekarang coba bikin middleware untuk /posts
app.get('/posts', authenticateToken, (req,res) => {
    res.json(posts.filter(post => post.username === req.user.name))

})

async function authenticateToken(req,res,next){
    // var uint8array = new TextEncoder("utf-8").encode(secret); //convert secret to uint8array    
    const algoritmaKey = 'ECDH-ES'
    var pem2jwk = Eckles
    if (algoritmaKey == 'PS256' || algoritmaKey == 'RS256' ) jwk2pem = Rasha;

    // const publicKeyRaw = await pem2jwk.import({ pem: publicKey }).then(function (jwk) { //convert pem2jwk
    //     console.log(jwk);
    //     return jwk;
    // });     
    // console.log("batas A"); console.log(publicKeyRaw);  console.log("type= "+typeof(publicKeyRaw));  console.log("batas A/"); //test print 

    
    const RSAPublicKey = await importPKCS8(publicKey, algoritmaKey) //import jwk to objectKey    
    // console.log("batas C"); console.log(RSAPublicKey); console.log("type= "+typeof(publicRSAPublicKeyKeyRaw)); console.log("batas C/"); //test print 
 
    const authHeader = req.headers['authorization'] //ambil html header authorization
    const token = authHeader && authHeader.split(' ')[1]

   //Bearer TOKEN sebagai nama token

    if (token == null) return res.sendStatus(401) //jika user tidak memiliki token maka akan return user dan status 401 untuk tidak memilki akses
    //verifikasi token
    const decoder = new TextDecoder()
    const {
        plaintext,
        protectedHeader
    } = await compactDecrypt(token, RSAPublicKey)

      console.log(protectedHeader)
      console.log(plaintext)
}

app.listen(3000)