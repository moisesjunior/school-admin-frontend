import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const renewOrExpire = async (hours: number): Promise<boolean> => {
  const expirationTime = localStorage.getItem('expirationTime');

  if(new Date().getTime() >= Number(expirationTime)){
    return false;
  } else {
    return true;
  }
}

interface tokenProps {
  children: JSX.Element,
  path: string;
  exact?: boolean;
  timeToExtend: number;
}

const PrivateRoute = ( props: tokenProps ) => {
  return (
    <Route
      path={props.path}
      exact={props.exact}
      render={({ location }) => {
        return renewOrExpire(props.timeToExtend) ? (
          props.children
        )  : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }}
    />
  )
}

export default PrivateRoute;