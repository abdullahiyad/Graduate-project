const user = require("../nodejs/Database/models/users");
let errors = {name:'',phone:'',email:'',password:''}
const bcrypt = require('bcrypt');
const handleErrors = (err) => {
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
  const { name, phone, email, password } = req.body;
  try {
    const users = await user.create({ name, phone, email, password });
    res.status(201).redirect('/login');
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).send(errors);
  }
}
module.exports.login_post = async (req,res) =>{
  try {
    const check = await user.findOne({email: req.body.email});
    if(!check){
      console.log("Can't find user");
    }else{
      const isPassMatch = await bcrypt.compare(req.body.password,check.password);
      if(isPassMatch){
        res.redirect('/home');
      }else{
        res.send('Password error');
      }
    }
  } catch {
    console.log('wrong details');
  } 
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
