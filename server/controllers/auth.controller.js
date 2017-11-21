'use strict';

const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const config = require("../../config/config");
const auth = require("../../config/auth");
const TokenService = require("../../config/Tokenservice");
const Tools = require("../helpers/Tools");

module.exports = { normalLogin, generateToken, registerUser };

function generateToken(req, res, next) {

  TokenService.createToken({ user: req.user, expireTime: 86400 }, (err, token) => {
    if (err) return next({status:httpStatus.UNAUTHORIZED, message:err.message || "Unknown error"});

    req.generatedToken = token;
    next();
  })

}

function normalLogin(req, res, next) {
  if (!req.body.email) {
    return next({ status: httpStatus.BAD_REQUEST, message: 'Invalid Email' });
  }
  const options = {
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    notification_id: req.body.notification_id
  }
  auth.normalAuthenticateion(options).then(user => {
    req.user = user;
    next();

  }).catch(err => {
    return next({ status: httpStatus.UNAUTHORIZED, message: err.message || "Unknown error", isPublic: true });
  });
}

function registerUser(req, res, next) {
  if ((!req.body.email && !req.body.phone) || !req.body.password) {
      return next({ status: 400, message: "Invalid Email or Phone" });
  }

  var userObj = {
      email: req.body.email ? req.body.email.toLowerCase() : null,
      password: req.body.password,
      phone: req.body.phone,
      name: req.body.name,
      otp: req.body.otp
  }
  // console.log(req);
  // Validating uniqueness of phone and mobile no. 
  auth.userAlreadyExists(userObj.email, userObj.phone).then(exist=> {
      if (exist) {
          return next({message:"Email or phone already exist", isPublic: true, status: httpStatus.UNAUTHORIZED});
      }
      else {
          
          auth.createUser(userObj).then(user => {
              req.user = { email: user.email, _id: user._id, name: user.name, phone: user.phone };
              return next();

          }).catch(err => {
              if (err.name && err.name == 'ValidationError') {
                  let errMsg = Tools.getValidationErrMsg(err.errors);
                  return next({status: httpStatus.UNAUTHORIZED, message: errMsg, isPublic: true});
              }
              else {
                  // console.log(err);
                  return next({status: httpStatus.INTERNAL_SERVER_ERROR, message: err.message});
              }

          });

      }
  }).catch(err=>{
    return next();
  })
}



