'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CourseSchema = new Schema({
  user: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  estimatedTime: String,
  materialsNeeded: String
});

CourseSchema.method("update", function(updates, callback){
  Object.assign(this, updates);
  this.save(callback);
})

var Course = mongoose.model("Course", CourseSchema);

module.exports.Course = Course;
