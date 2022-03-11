import React from 'react';
import { Meteor } from 'meteor/meteor';
import Col from 'react-bootstrap/Col';

/* After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
const Signout = () => {
  Meteor.logout();
  return (
    <Col id="signout-page" className="text-center"><h2>You are signed out.</h2></Col>
  );
};

export default Signout;
