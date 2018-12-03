'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

var UserSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  emailAddress: {type: String, required: true, unique: true},
  password: {type: String, required: true}
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
    if(err){
      return callback(err, null);
    } else if(!user){
      var error = new Error('User not found!');
      error.status = 401;
      return callback(error, null);
    }
    bcrypt.compare(password, user.password, (error, result) => {
      if(result){
        return callback(null, user);
      } else {
        var error = new Error("The email or password was not valid")
        error.status = 401;
        return callback(error, null);
      }
    });
  })
}

var User = mongoose.model("User", UserSchema);

var CourseSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, required: true},
  title: {type: String, required:true},
  description: {type:String, required: true},
  estimatedTime: String,
  materialsNeeded: String
});

CourseSchema.method("update", function(updates, callback){
  Object.assign(this, updates);
  this.save(callback);
})

var Course = mongoose.model("Course", CourseSchema);

module.exports.User = User;
module.exports.Course = Course;
