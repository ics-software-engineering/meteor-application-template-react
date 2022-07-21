import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col } from 'react-bootstrap';

/* After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => {
  Meteor.logout();
  return (
    <Col id="signout-page" className="text-center py-3"><h2>You are signed out.</h2></Col>
  );
};

export default SignOut;
