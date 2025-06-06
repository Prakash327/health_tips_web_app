const mongoose = require('mongoose')

const connection = mongoose.connect(process.env.mongouri)
.then(()=>console.log("connected to the database"))
.catch(err=>console.log(err))


module.exports= {connection};