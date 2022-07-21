import React from 'react';
import { Meteor } from 'meteor/meteor';
import Col from 'react-bootstrap/Col';
import { PAGE_IDS } from '../utilities/PageIDs';

/* After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => {
  Meteor.logout();
  return (
    <Col id={PAGE_IDS.SIGN_OUT} className="text-center"><h2>You are signed out.</h2></Col>
  );
};

export default SignOut;
