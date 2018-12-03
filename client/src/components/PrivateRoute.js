import React from 'react';
import {Redirect, Route,} from 'react-router-dom';

var PrivateRoute = (props) => {
  //sets the location of where the user was trying to go of they are not signed in
  if(props.signedIn !== true)
  {
    props.setUrl(props.path)
  }
  return (
    //returns a route that either renders the indicated path or directs unauthenticated users to a sign in page
    <Route
      path={props.path}
      render={() =>
        (props.signedIn === true)
        ? props.component
        :  <Redirect to='/signin'/>
      }
    />
  );
}

export default PrivateRoute;
