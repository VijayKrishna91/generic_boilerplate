'use strict';

const express = require("express");
const validate = require("express-validation");
const expressJwt = require("express-jwt");
const paramValidation = require("../../config/param-validation");
const authCtrl = require("../controllers/auth.controller");
const config = require("../../config/config");
const router = express.Router(); // eslint-disable-line new-cap


router.route("/login")
  .post(validate(paramValidation.login), authCtrl.normalLogin, authCtrl.generateToken, (req,res,next)=>{
    return res.json({ token: req.generatedToken, user: req.user });
  });

router.post('/register', authCtrl.registerUser, authCtrl.generateToken, function (req, res, next) {
    
    return res.json({ user: req.user, token: req.generatedToken });
});

module.exports = router;