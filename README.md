# JWT-node.js-RSA
# JWT-node.js-RSA

### Desc
Hanya digunakan untuk simulasi pertukaran token (JWT) pada rest API

### Requirement:
1. Rest client Extensions vscode
2. npm
3. nodemon
4. jsonwebtoken || npm install jsonwebtoken || https://github.com/auth0/node-jsonwebtoken

### Ada 2 server:
1. authServer.js (Generate access token dan refresh token)
2. server.js (client)

### Alur
Gunakan request.rest untuk testing

login -> copy access token ke Auth /posts -> copy refresh token ke "token" /logout dan ke "token" /token -> request get /posts -> jika username sama = sukses

### pair key yang digunakan:
1. jwtRS512.key
2. jwtRS512.key.pub
3. refreshJwtRS512.key
4. refreshJwtRS512.key.pub

### NOTE:
## Semua petunjuk tambahan ada di file: guide newbie nodeJS.txt
## file yang memiliki nama file part adalah bentuk dokumentasi langkah-langkah menuju final //lupa bikin branchnya hehehe
  
# JWT-node.js-RSA
