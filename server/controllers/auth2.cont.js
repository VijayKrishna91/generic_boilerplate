const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const config = require("../../config/config");

const passport = require("passport");  
const passportJWT = require("passport-jwt");  
const ExtractJwt = passportJWT.ExtractJwt;  
const Strategy = passportJWT.Strategy;  
const params = {  
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const strategy = new Strategy(params, function(payload, done) {
    /*  var user = users[payload.id] || null;
     if (user) {
         return done(null, {
             id: user.id
         });
     } else {
         return done(new Error("User not found"), null);
     } */
     console.log(payload);
     return done(null,{id:2});
 });
 
 passport.use(strategy);
 
 function initialize()  {
     return passport.initialize();
 }
 function authenticate() {
     return passport.authenticate("jwt", false); // Session false
 }

 function generateToken(req,res,next){
    const token = jwt.sign({
        username: req.user.username,
        _id: req.user._id
    }, config.jwtSecret);
    req.token = token;
    return next();
 }
 function login(req,res,next){
     return next();
 }
 
module.exports = { login, initialize , authenticate, generateToken };