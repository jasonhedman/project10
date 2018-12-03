'use strict';

var express = require('express');
var router = express.Router();

var User = require('./models').User;
var Course = require('./models').Course;

const bcrypt = require('bcrypt');
const saltRounds = 10;

var auth = require('basic-auth');

router.get('/users', (req, res, next) => {
  User.authorize(auth(req).name, auth(req).pass, (err, user) => {
    if(err) return next(err);
    res.status(200);
    res.json(user);
  });
});

router.post('/users', (req, res, next) => {
  console.log(req.body);
  var user = new User(req.body);
  if(req.body.emailAddress.search(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) === -1){
    var err = new Error("Please enter a valid email");
    return next(err);
  }
  user.save((err, user) => {
    console.log(err);
    if(err) return next(err);
    res.status(201);
    res.location('/');
    res.json({});
  });
});

router.get('/courses', (req, res, next) => {
  Course.find({})
    .populate({
      path: 'user',
      model: 'User',
      select: {'emailAddress':0, 'password':0, '__v':0}
    })
    .exec((err, courses) => {
    if(err) return next(err);
    res.status(200);
    res.json(courses);
  });
});

router.get('/courses/:id', (req, res, next) => {
  Course.findById(req.params.id)
    .populate({
      path: 'user',
      model: 'User',
      select: {'emailAddress':0, 'password':0, '__v':0}
    })
    .exec((err, course) => {
    if(err) return next(err);
    res.json(course);
  });
});

router.post('/courses', (req, res, next) => {
  if(auth(req)){
    User.authorize(auth(req).name, auth(req).pass, (err, user) => {
      if(err) return next(err);
      var course = new Course({
        user: user.id,
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded,
      });
      res.location('/courses/'+course._id);
      course.save((err, course) => {
        if(err) return next(err);
        res.status(201);
        res.json({});
      })
    });
  } else {
    var err = new Error("Authorization is required. Please enter an email and password");
    err.status = 401;
    return next(err);
  }
});

router.put('/courses/:id', (req, res, next) => {
  User.authorize(auth(req).name, auth(req).pass, (err, user) => {
    console.log(err);
    if(err) return next(err);
    if(req.body.title && req.body.description){
      Course.findById(req.params.id, (err, course) => {
        if(course.user.toString() == user._id.toString()){
          console.log("ween")
          course.update(req.body, (err) => {
            if(err) return next(err);
            res.json({});
            next();
          });
        } else {
          var err = new Error('You are not allowed to edit content that is not owned by you');
          err.status = 403;
          return next(err);
        }
      });
    } else {
      var err = new Error('All fields required');
      err.status = 400;
      return next(err);
    }
  });
});

router.delete('/courses/:id', (req, res, next) => {
  User.authorize(auth(req).name, auth(req).pass, (err, user) => {
    if(err) return next(err);
    Course.findById(req.params.id, (err, course) => {
        if(course.user.toString() == user._id.toString()){
          course.remove((err) => {
            if(err) return next(err);
            next();
          });
        } else {
          var err = new Error('You are not allowed to delete content that is not owned by you');
          err.status = 403;
          return next(err);
        }
      });
  });
});

module.exports = router;
