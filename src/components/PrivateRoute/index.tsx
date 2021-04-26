import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UIStore } from '../../services/Store';

const renewOrExpire = async (hours: number): Promise<boolean> => {
  const expirationTime = localStorage.getItem('expirationTime');

  if(new Date().getTime() >= Number(expirationTime)){
    localStorage.clear();
    UIStore.replace({
      signed: false,
      name: ""
    });
    window.location.replace('/');
    return false;
  } else {
    const expirationTime = new Date().setHours(new Date().getHours() + hours);
    localStorage.setItem('expirationTime', String(expirationTime));
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