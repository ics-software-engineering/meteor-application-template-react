import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { BrowserRouter as Router, Route, Switch, Navigate, Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import ListStuff from '../pages/ListStuff';
import ListStuffAdmin from '../pages/ListStuffAdmin';
import AddStuff from '../pages/AddStuff';
import EditStuff from '../pages/EditStuff';
import NotFound from '../pages/NotFound';
import SignUp from '../pages/SignUp';
import SignOut from '../pages/SignOut';
import NavBar from '../components/NavBar';
import SignIn from '../pages/SignIn';
import NotAuthorized from '../pages/NotAuthorized';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
const App = () => (
  <Router>
    <div>
      <NavBar/>
      <Switch>
        <Route exact path="/"><Landing/></Route>
        <Route path="/signin"><SignIn/></Route>
        <Route path="/signup"><SignUp/></Route>
        <Route path="/signout"><SignOut/></Route>
        <Route path="/home" render={() => <ProtectedRoute><Landing/></ProtectedRoute>}/>
        <Route path="/list" render={() => <ProtectedRoute><ListStuff/></ProtectedRoute>}/>
        <Route path="/add" render={() => <ProtectedRoute><AddStuff/></ProtectedRoute>}/>
        <Route path="/edit/:_id" render={() => <ProtectedRoute><EditStuff/></ProtectedRoute>}/>
        <Route path="/admin" render={() => <AdminProtectedRoute><ListStuffAdmin/></AdminProtectedRoute>}/>
        <Route path="/notauthorized"><NotAuthorized/></Route>
        <Route><NotFound/></Route>
      </Switch>
      <Footer/>
    </div>
  </Router>
);

/*
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  return isLogged ? children : <Redirect to='/signin'/>;
};

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Redirect to='/signin'/>;
  }
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  return (isLogged && isAdmin) ? children : <Redirect to='/notauthorized'/>;
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

export default App;
