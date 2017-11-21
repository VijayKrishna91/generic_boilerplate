'use strict';
// import mongoose from "mongoose";
const mongoose = require("mongoose");

const {UserSchema } = require("./user.model");
const User = mongoose.model("User", UserSchema);

module.exports =  { User };
