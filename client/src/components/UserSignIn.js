import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom'

class UserSignIn extends Component{

  constructor(){
    super();
    this.state = {
      fail: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  email = React.createRef();
  password = React.createRef();


  //calls the signin method provided in the props with the form data
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signIn(this.email.current.value, this.password.current.value, () => this.props.history.push(this.props.successUrl), this.setState({fail:true}));
  }

  render(){
    let errorMessage;
    //if signin fails, an error is displayed
    if(this.state.fail){
      errorMessage = <div>
                       <h2 className="validation--errors--label">Validation errors</h2>
                       <div className="validation-errors">
                         <ul>
                           <li>Your login details are not valid</li>
                         </ul>
                       </div>
                     </div>
    }

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          {errorMessage}
          <div>
            <form onSubmit={this.handleSubmit}>
              <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" ref={this.email} /></div>
              <div><input id="password" name="password" type="password" className="" placeholder="Password" ref={this.password} /></div>
              <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign In</button><Link className="button button-secondary" to='/'>Cancel</Link></div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
        </div>
      </div>
    );
  }
}

export default withRouter(UserSignIn);
