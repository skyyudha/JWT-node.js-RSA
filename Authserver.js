require('dotenv').config()


const express = require('express')
const app = express()
// var Rasha = require('rasha');//library untuk pem2jwk & jwk2pem KHUSUS RSA
// var Eckles = require('eckles'); //library untuk pem2jwk & jwk2pem KHUSUS EC

const fs = require('fs')
var publicKeyRaw = fs.readFileSync('./public11.pem', 'utf8'); //ambil key dari filem pem
var privateKeyRaw = fs.readFileSync('./private11.pem', 'utf8'); //ambil key dari filem pem

//test print 
// console.log("batas B"); console.log(publicKey); console.log("type= "+typeof(publicKey)); console.log("batas B/");

// var publicKey = fs.readFileSync('./secret.key.pub', 'utf8');

const { jwtVerify, importJWK, compactDecrypt,importPKCS8,
    generateKeyPair,   exportPKCS8, exportSPKI, importSPKI, exportJWK  } = require('jose')
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

app.post('/getKey', async (req,res) => { //generate key pair + export public, private
    const algoritmaKey = 'ECDH-ES'

    const {
        privateKey,
        publicKey
    } = await generateKeyPair(algoritmaKey); 

    //export Object key jadi PEM (PKCS8 format)
    const privateKeyRaw = await exportPKCS8(privateKey);
    console.log(await exportJWK(privateKey));
    console.log(privateKeyRaw);
    fs.writeFileSync("private11.pem", privateKeyRaw); //export file pem

    //export Object key jadi PEM (SPKI format)
    const publicKeyRaw = await exportSPKI(publicKey);
    console.log(await exportJWK(publicKey));
    console.log(publicKeyRaw);
    fs.writeFileSync("public11.pem", publicKeyRaw); //export file pem

    // res.sendStatus(200)
    res.json({ status: "Generate Key Pair Sukses"})
})

async function authenticateToken(req,res,next){
    const algoritmaKey = 'ECDH-ES'
    const secretKey = await importPKCS8(privateKeyRaw, algoritmaKey) //import jwk to objectKey    
 
    const authHeader = req.headers['authorization'] //ambil html header authorization
    const token = authHeader && authHeader.split(' ')[1] //ambil hanya tokennya saja
    //Bearer TOKEN sebagai jenis token
    
    //verifikasi token
    if (token == null) return res.sendStatus(401) //jika user tidak memiliki token maka akan return user dan status 401 untuk tidak memilki akses
    
    const decoder = new TextDecoder()
    const {
        plaintext,
        protectedHeader
        // , iv, ciphertext, tag //tidak dikeluarkan default di lib-nya. //alasan keamanan
    } = await compactDecrypt(token, secretKey)
    // const content = 

    console.log(protectedHeader)
    // console.log(decoder.decode(iv))
    // console.log(decoder.decode(ciphertext))
    // console.log(plaintext)
    console.log(decoder.decode(plaintext))
}

app.listen(5000)