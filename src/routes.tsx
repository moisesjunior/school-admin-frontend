import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';
import ClassAtCourses from './pages/Course/ClassAtCourses';
import FormCourse from './pages/Course/Form';
import ListCourse from './pages/Course/List';
import FormExpenditure from './pages/Expenditure/Form';
import ListExpenditure from './pages/Expenditure/List';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import CashFlow from './pages/Payment/CashFlow';
import FormPayment from './pages/Payment/Form';
import ListPayment from './pages/Payment/List';
import Profile from './pages/Profile';
import RenewPassword from './pages/RenewPassword';
import FormStudent from './pages/Student/Form';
import ListStudent from './pages/Student/List';
import FormUser from './pages/User/Form';
import ListUser from './pages/User/List';
import { UIStore } from './services/Store';

const Router = () => {
  const signed = UIStore.useState(s => s.signed);

  return (
    <BrowserRouter>
      {
        signed === true ? ( 
          <>
            <NavBar />
            <Switch>
              <PrivateRoute timeToExtend={8} path="/home">
                <Home />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/profile">
                <Profile />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/payments">
                <ListPayment />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/payment">
                <FormPayment />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/students">
                <ListStudent />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/student">
                <FormStudent />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/expenditures">
                <ListExpenditure />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/expenditure">
                <FormExpenditure />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/courses">
                <ListCourse />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/course">
                <FormCourse />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/classes">
                <ClassAtCourses />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/cashFlow">
                <CashFlow />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/users">
                <ListUser />
              </PrivateRoute>
              <PrivateRoute timeToExtend={8} path="/user">
                <FormUser />
              </PrivateRoute>
            </Switch>
          </>
        ) : (
          <Switch>
            <Route exact path="/" component={Login}/>
            <Route path="/forgotPassword" component={ForgotPassword}/>
            <Route path="/renewPassword" component={RenewPassword}/>
          </Switch>
        )
      }
    </BrowserRouter>
  )
}
  
export default Router;