const { Router } = require("express");
const authController = require("../controller/authController");
const {isLoggedIn } = require("../middleware/authMiddlewares");

const router = Router();

router.get('/signup',isLoggedIn, authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', isLoggedIn, authController.login_get);
router.post('/login',authController.login_post);
router.get('/home' , authController.home_get);
router.post('/home' ,authController.home_post);
router.get('/menu', authController.menu_get);
router.post('/menu',  authController.menu_post);

module.exports = router;
