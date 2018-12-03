import React from 'react';
import {Link} from 'react-router-dom'

//signout button that calls the signout method from the app on click
const UserSignOut = (props) => {
  return (
    <Link className="signout" to="/signout" onClick={props.signOut}>Sign Out</Link>
  );
}
export default UserSignOut;
