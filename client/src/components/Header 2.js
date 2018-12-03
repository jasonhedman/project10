import React from 'react';

const Header = (props) => {

  let nav;

  if(props.user){
    nav = <span>Welcome {props.user}</span>;
  } else {
    nav = <a className="signup" href="sign-up.html">Sign Up</a>;
  }

  return (
    <div className="header">
      <div className="bounds">
        <h1 className="header--logo">Courses</h1>
        <nav>{nav}<a className="signout" href="index.html">Sign Out</a></nav>
      </div>
    </div>
  );
}

export default Header
