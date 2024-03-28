const user = require("../nodejs/Database/models/users");

module.exports.signup_get = (req,res) =>{
    res.render('signup');
}
module.exports.login_get = (req,res) =>{
    res.render('login');
}
module.exports.signup_post = async (req,res) =>{
    const {name,phone,email,password} = req.body;

    try {
        const users = await user.create({name,phone,email,password});
        res.status(201).json(users);
    } catch (err) {
        console.log(err);
        res.status(400).send("User doesn't created");
    }

    res.send('new signup');
}
module.exports.login_post = async (req,res) =>{
    const { email, password } = req.body;
    console.log(email, password);
    res.send('user login');
}
module.exports.home_get = (req,res) =>{
    res.render('home');
}
module.exports.home_post = (req,res) =>{
    res.send('This is home page');
}
module.exports.menu_get = (req,res) =>{
    res.render('menu');
}
module.exports.menu_post = (req,res) =>{
    res.send('This is menu page');
}
