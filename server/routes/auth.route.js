// import express from 'express';
// import validate from 'express-validation';
// import expressJwt from 'express-jwt';
// import paramValidation from '../../config/param-validation';
// import authCtrl from '../controllers/auth.controller';
// import config from '../../config/config';
// import authCtrl2 from "../controllers/auth2.cont";

const express = require("express");
const validate = require("express-validation");
const expressJwt = require("express-jwt");
const paramValidation = require("../../config/param-validation");
const authCtrl = require("../controllers/auth.controller");
const config = require("../../config/config");
const authCtrl2 = require("../controllers/auth2.cont");



const router = express.Router(); // eslint-disable-line new-cap

/** POST /auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** GET /auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);


router.route("/login2")
  .post(validate(paramValidation.login), authCtrl2.login, authCtrl2.generateToken, (req,res,next)=>{
    console.log(req);
    console.log("anything");
  });
// export default router;
module.exports = router;
