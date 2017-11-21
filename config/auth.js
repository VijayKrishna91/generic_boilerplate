'use strict';

const config = require("./config");
const User = require("../server/models/index").User;

module.exports = { normalAuthenticateion, userAlreadyExists, createUser }

function normalAuthenticateion(options) {
    return new Promise((resolve,reject)=>{
        // Change it to lowercase. 
        if (!options || !options.email) {
            return reject(Error("Invalid Email"));
        }
        if (!options || !options.password, null) {
            return reject(Error("Invalid Password"));
        }
        User.findOne({
            email: options.email
        }, "name password _id email phone gender random_key", function (err, user) {
            if (err) { return reject(Error('Error fetching user')); }

            if (!user) {
                return reject(Error('Authentication failed. User not found.'));
            }
            else if (user) {
                // check if password matches
                // console.log(options.password);
                // console.log(user);
                user.authenticate(options.password, function (err, isMatch) {
                    if (err) { return reject(Error('Authentication failed. Incorrect Password')); }
                    
                    if (isMatch) {
                        if(!user.random_key){
                            user.random_key = Tools.randomID(6);
                            user.markModified("random_key");
                        }
                        fixUserObj(user,options).then(user=>{
                            return resolve(user);
                        }).catch(err=>{
                            return reject(err);
                        })
                    }
                    else {
                        return reject(Error('Authentication failed. Incorrect Password'));
                    }

                });
            }
        });
    });
    
}

function userAlreadyExists(email, phone) {

    let flag;
    let message = null, err = null;
    if (!email && !phone) {
        flag = true;
        message = "Empty Email and Phone";
        return Promise.reject({message:message, isPublic:true});
    } else {
        let query = {
            "$or": [
            ]
        }
        if (email) {
            query["$or"].push({ "email": email });
        }
        if (phone) {
            query["$or"].push({ "phone": phone })
        }

        return User.findOne(query, "_id").lean().exec().then(user=>{
            if (err) {
                flag = true;
                message = "Error Occured";
                err = "Internal Error occured";
                throw {message:message, isPublic:true};
            } else {
                if (user) {
                    return true;
                } else {
                    return false;
                }

            }
        })
    }

}
function createUser(user, cb) {
    const newUser = new User(user);
    newUser.markModified('email');
    return newUser.save();
}

function fixUserObj(userObj, options) {
    // Not used for now- but will be used later on for saving notification_ids 
    // and other things
    return new Promise((resolve, reject) => {
        userObj.save().then(data=>{
            return resolve(userObj);
        }).catch(err=>{
            return reject(err);
        })
    });
}


