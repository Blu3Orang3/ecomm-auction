import React, { Component } from 'react';
import {  Navigate, useLocation } from 'react-router-dom';
import auth from './auth-helper';

// PrivateRoute will only load when the user is
// authenticated, which is determined by a call to the isAuthenticated method;
// otherwise, the user will be redirected to the Signin component.

const PrivateRoute = ({ component: Component, ...rest }) => {
  const location = useLocation();

  if (!auth.isAuthenticated()) {
    return <Navigate to='/signin' state={{ from: location }} />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
