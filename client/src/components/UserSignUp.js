import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

class UserSignIn extends Component{

  constructor() {
    super();
    this.state = {
      firstName:'',
      lastName:'',
      emailAddress:'',
      password:'',
      confirmPassword:'',
      passwordNoMatch: false,
      invalid: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //submits a post request to the database with the provided credentials
  //signs the user in after they sign up
  //errors are thrown if the email is already associated with an account, fields are empty, or the passwords do not match
  handleSubmit(e){
    e.preventDefault();
    if(this.state.password===this.state.confirmPassword){
      let data = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        emailAddress: this.state.emailAddress,
        password: this.state.password
      }
      fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((response) => {
        if(response.ok === true){
          this.props.signIn(this.state.emailAddress, this.state.password, console.log('signin'))
          this.props.history.push('/');
        } else {
          this.setState({
            invalid: true
          })
        }
      })
    } else {
      this.setState({
        passwordNoMatch: true
      })
    }
  }

  handleChange(event){
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render(){
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <div>
            {
              (this.state.passwordNoMatch)
              ?<div>
                  <h2 className="validation--errors--label">Validation errors</h2>
                  <div className="validation-errors">
                    <ul>
                      <li>"Password" and "Confirm Password" do not match</li>
                    </ul>
                  </div>
              </div>
              :<></>
            }

            {
              (this.state.invalid)
              ?<div>
                  <h2 className="validation--errors--label">Validation errors</h2>
                  <div className="validation-errors">
                    <ul>
                      <li>All fields must be filled</li>
                      <li>Email address must be a valid email address and cannot already be attached to an account</li>
                    </ul>
                  </div>
              </div>
              :<></>
            }
            <form onSubmit={this.handleSubmit}>
              <div><input id="firstName" name="firstName" type="text" placeholder="First Name" value={this.state.firstName} onChange={this.handleChange}/></div>
              <div><input id="lastName" name="lastName" type="text" placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange}/></div>
              <div><input id="emailAddress" name="emailAddress" type="text" placeholder="Email Address" value={this.state.emailAddress} onChange={this.handleChange} /></div>
              <div><input id="password" name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/></div>
              <div><input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.handleChange}/></div>
              <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign Up</button><Link className="button button-secondary" to="/">Cancel</Link></div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(UserSignIn);
