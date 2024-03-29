require('./nodejs/Database/mongoose');
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = 3000;

//MiddleWare:
app.use(express.json()); 
app.use('/css',express.static('css'));
app.use('/images', express.static(path.join(__dirname, '/images')));
app.use('/js', express.static(path.join(__dirname, '/js')));
//This is view type:
app.set('view engine', 'ejs');

app.use(authRoutes);

 app.listen(PORT);//, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });  





































// require('./Database/mongoose');
// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const PORT = 3000;
// const path = require('path');
// const user = require('./Database/models/users');

// //User Variables
// let name, phone, email,pass;
// //View engine
// app.set('view engine', 'ejs');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static(path.join(__dirname, '../html')));
// app.use('/css',express.static(path.join(__dirname, '../css')));
// app.use('/js', express.static(path.join(__dirname, '../js')));
// app.use('/images', express.static(path.join(__dirname, '../images')));

// app.get('/login.html',(req,res)=>{
//     res.sendFile(path.join(__dirname, '../html', 'login.html'));
// });
// app.get('/signup.html',(req,res)=>{
//     res.sendFile(path.join(__dirname, '../html', 'signup.html'));
// });
// app.get('/home.html',(req,res)=>{
//     res.sendFile(path.join(__dirname, '../html', 'home.html'));
// });
// app.get('/menu.html',(req,res)=>{
//     res.sendFile(path.join(__dirname, '../html', 'menu.html'));
// });

// app.post('/signup.html', async (req, res) => {
//     const data = {
//         name: req.body.name,
//         phone: req.body.phone,
//         email: req.body.email,
//         pass: req.body.password
//     }
//     await user.create(data);

// });

// function isExist(){
    
// }

// app.get('/login.html', (req, res) => {
//     email = req.body.email;
//     pass = req.body.password;  
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
