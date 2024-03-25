const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 4000;

app.get('/',(req,res)=>{
    res.sendFile('../html/login.html',{ root: __dirname });
})


app.listen(PORT,()=>console.log('server connect successfully!!'));
