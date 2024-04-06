const user = require("../nodejs/Database/models/users");
let errors = {name:'',phone:'',email:'',password:''}

const handleErrors = (err) => {
    console.log(err.message, err.code);
    if(err.code === 11000){
        errors.email = 'AIU';
        errors.phone = 'AIU';
        return errors;
    }
    
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors [properties.path] = properties.message;
        })
    }
    return errors;
} 

module.exports.signup_get = (req,res) =>{
    res.render('signup');
}
module.exports.login_get = (req,res) =>{
    res.render('login');
}
module.exports.signup_post = async (req,res) =>{
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    console.log('Name: ',name,"\nphone:",phone);
    try {
        const users = await user.create(name,phone,email,password);
        res.status(201).json(users);
    } catch (err) {
        handleErrors(err);
        res.status(400).json({errors});
    }
}
module.exports.login_post = async (req,res) =>{
    const { email, password } = await req.body;
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
