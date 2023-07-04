const express = require('express');
const router =require('./api')
require("dotenv").config();
const mongoose = require("mongoose");




//init app & middleware
const app = express();
app.use(express.json());

app.use("/", router);

app.get("/",(request,response)=>{
    response.json({message: "this is working fine"})
    console.log("GET request");
})

app.listen(process.env.APP_PORT, () => {
  console.log("listening on http://localhost/3000");
});

mongoose.connect(process.env.MONGO_URL)
mongoose.Promise = global.Promise

app.use(express.static('public'))





//routes
app.get('/books',(req,res)=>{
    res.json({message: "welcome to api"})

})