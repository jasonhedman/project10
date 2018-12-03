import React from 'react';
import {Link} from 'react-router-dom'

import UserSignOut from './UserSignOut.js';

const Header = (props) => {

  //conditionally renders the header buttons depending on whether or not the user is signed in
  let header;
  if(props.signedIn){
    header = <nav><span>{"Welcome " + props.user.fullName}</span><UserSignOut signOut={props.signOut}/></nav>;
  } else {
    header = <nav><Link className="signup" to="/signup">Sign Up</Link><Link className="signin" to="/signin">Sign In</Link></nav>;
  }

  return (
    <div className="header">
      <div className="bounds">
        <h1 className="header--logo">Courses</h1>
        {header}
      </div>
    </div>
  );
}

export default Header
