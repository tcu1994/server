const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user){
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp}, config.secret);
}

exports.signin = function(req, res, next){
    // user has already had their email and pass auth'd
    // we just need to give them a token
    res.send({ token: tokenForUser(req.user)});
}


exports.signup = function(req, res, next){
    // see if a user with the given email exist
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password){
        return res.status(422).send({ error: 'You must provide email and password'});
    }




    User.findOne({ email: email}, function(err, existingUser){
        if (err) { return next(err);}

        if (existingUser) {
            return res.status(422).send( { error: 'Email is in use'});
        }

    });

    // if exists, return error

    const user = new User({
        email: email,
        password: password
    });

    user.save(function(err){
        if (err) { return next(err);}


        res.json({ token: tokenForUser(user)});
    });
    // if not exists, create and save record

    // respond to request



}