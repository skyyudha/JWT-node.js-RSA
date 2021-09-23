//console.log("kamu")
//testing koneksi rest client

const express = require('express')
const app = express()

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

app.get('/posts',(req,res) => {
    res.json(posts)
})

app.get('/login',(req,res) => {
    
})


app.listen(3000)