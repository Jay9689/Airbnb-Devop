const User = require('../models/user.js');
const passport = require('passport');

// render's SignupForm
module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs')
};

// signUp new user
module.exports.signup = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return (err);
            }
            req.flash("success", "Welcome to Wonderlust")
            res.redirect('/listings')
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('/signup')
    }
}

// render's login page
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs')
}
// verify's user credincals
module.exports.login = async (req, res) => {
    req.flash('success', "Welcome to wonder lust")
    let redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl)
}

// logout the user
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'you are logged out')
        res.redirect('/listings')
    });
}

