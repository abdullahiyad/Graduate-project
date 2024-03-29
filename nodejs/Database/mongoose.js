const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/YKPOCafe').then(() => {
    //console.log('Connection Good');
}).catch((err) => {
    console.log(err);
});

// async()=>{
//     try{
//         await(mongoose.connect('mongodb://localhost:27017/YKPOCafe'));
//         console.log("connection Successfully");
//     }catch (err){
//         console.log(err);
//     }
// }