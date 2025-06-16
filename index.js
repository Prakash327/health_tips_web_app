require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//--> import connection from mongoose
const {connection} = require('./database/connect.database.js')

const register = require("./routes/register.js")
const profile = require('./routes/profile.routes.js')
const picture = require('./routes/picture.routes.js')
//the picture route was just to test the image upload is working properly or not
const healthTips= require('./routes/health.tips.routes.js')
app.use('/user',register);
app.use('/profile',profile)
app.use('/picture',picture)
app.use('/healthtips',healthTips)

// app.use('/',register);



const port = 7000;

async function start() {[]
    await connection
    app.listen(port,()=>{
        
        console.log(`your server is running at port ${port}`)
    })
    
}

start();