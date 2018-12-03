'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  emailAddress: String,
  password: String
});

UserSchema.pre("save", function(next){
  const user = this;
  bcrypt.genSalt(10, function (err, salt) {
       if (err) return next(err);
       bcrypt.hash(user.password, salt, function (err, hash) {
           if (err) console.log(err);
           user.password = hash;
           next();
       });
   });
});

UserSchema.statics.authorize = function(email, password, callback){
  User.findOne({emailAddress:email}, (err, user) => {
    console.log(user);
    callback();
    // if(err){
    //   return callback(err);
    // } else if(!user){
    //   var error = new Error('User not found!');
    //   error.status = 401;
    //   return callback(error);
    // }
    // bcrypt.compare(password, user.password, (err, result) => {
    //   if(result){
    //     return callback(null, user);
    //   } else {
    //     return callback();
    //   }
    // });
  })}

var User = mongoose.model("User", UserSchema);

module.exports.User = User;
