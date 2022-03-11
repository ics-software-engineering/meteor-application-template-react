import React from 'react';
import { Meteor } from 'meteor/meteor';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/* After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
export default class Signout extends React.Component {
  render() {
    Meteor.logout();
    return (
      <Col id="signout-page" className="text-center"><h2>You are signed out.</h2></Col>
    );
  }
}
