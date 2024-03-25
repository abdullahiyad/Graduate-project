const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../html')));
app.use('/css',express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));

app.use('/images', express.static(path.join(__dirname, '../images')));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'login.html'));
    // res.sendFile(path.join(__dirname, '../css', 'login-style.css'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'signup.html'));
});

app.post('/signup', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Password:', password);

    res.send('Signup successful!');
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log('email:', email);
    console.log('Password:', password);

    res.send('Login successful!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
