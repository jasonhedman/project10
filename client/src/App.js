import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';

import axios from 'axios';

class App extends Component{
  constructor(){
    super();
    this.state={
      user:{},
      signedIn:false,
      toHome:false,
      signInUrl:'/'
    }

    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.isAuthorized = this.isAuthorized.bind(this);
    this.setSignInUrl = this.setSignInUrl.bind(this);
  }

  //removes the currently authenticated users
  //passed to the signout button
  signOut(){
    this.setState({
      signedIn: false,
      user: {}
    });
    window.localStorage.removeItem('user');
  }

  //used to indicate the route which a user is trying to go to
  //passed to the private routes so that they direct the user to the route they wanted to go to after signing in
  setSignInUrl(path){
    this.setState({
      signInUrl: path
    })
  }


  //method which is called in order to sign the user in
  //called in many different scenarios
  signIn(emailAddress, pass, func, failure){
    axios.request({
      url: 'http://localhost:5000/api/users',
      method: 'get',
      auth: {
        username: emailAddress,
        password: pass
      }
    })
    .then((response) => {
      var name = "" + response.data.firstName + " " + response.data.lastName;
      this.setState({
        user: {
          email: response.data.emailAddress,
          password: pass,
          fullName: name,
          id: response.data._id
        },
        signedIn: true,
      });
      window.localStorage.setItem('user', JSON.stringify({
        email: response.data.emailAddress,
        password: pass
      }))
    })
    .then((response) => {
      if(func){
        func();
      }
    })
    .catch((err) => {
      if(failure){
        failure();
      }
    })
  }


  //checks if there is a currently authenticated user
  //passed to components that render conditionally and chekck if a user is signed in
  isAuthorized(){
    return this.state.signedIn;
  }

  //called every time the app is rendered
  //checks local storage and attempts to login with the credentials
  componentDidMount(){
    var user = JSON.parse(window.localStorage.getItem('user'));
    if(user){
      this.signIn(user.email, user.password, null)
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header user={this.state.user} signOut={this.signOut} signedIn={this.state.signedIn} />
          <Switch>
            <Route exact path='/' render={()=><Courses />} />
            <PrivateRoute path='/courses/create' setUrl={this.setSignInUrl} signedIn={this.state.signedIn} component={<CreateCourse userObj={this.state.userObj} user={this.state.user}/>} />
            <PrivateRoute path='/courses/:id/update' setUrl={this.setSignInUrl} signedIn={this.state.signedIn} component={<UpdateCourse user={this.state.user} />} />
            <Route path='/courses/:id' render={({match}) => {return<CourseDetail user={this.state.user} id={match.params.id}/>}} />
            <Route path='/signin' render={() => <UserSignIn signIn={this.signIn} isAuthorized={this.isAuthorized} successUrl={this.state.signInUrl}/>} />
            <Route path='/signup' render={() => <UserSignUp signIn={this.signIn}/>}/>
            <Route path='/signout' render={() => <Redirect to='/' />} />
            <Route path='/notfound' component={NotFound} />
            <Route path='/forbidden' component={Forbidden} />
            <Route path='/error' component={UnhandledError} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
