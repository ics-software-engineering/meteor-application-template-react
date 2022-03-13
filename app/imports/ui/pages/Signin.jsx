import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
const Signin = ({ location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);

  // Update the form controls each time the user interacts with them.
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  // Handle Signin submission using Meteor's account mechanism.
  const submit = () => {
    console.log('submit', email, password, error, redirectToReferer);
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToRef(true);
      }
    });
  };

  // Render the signin form.
  const { from } = location.state || { from: { pathname: '/' } };
  console.log('render', email, password, error, redirectToReferer, from);
  // if correct authentication, redirect to page instead of login screen
  if (redirectToReferer) {
    console.log('redirect to ', from);
    return <Redirect to={from} />;
  }
  // Otherwise return the Login form.
  return (
    <Container id="signin-page">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Login to your account</h2>
          </Col>
          <Form onSubmit={submit}>
            <Card>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Email address</strong></Form.Label>
                  <Form.Control id="signin-form-email" type="email" placeholder="E-mail address" onChange={handleChangeEmail}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Password</strong></Form.Label>
                  <Form.Control id="signin-form-password" type="password" placeholder="Password" onChange={handleChangePassword}/>
                </Form.Group>
                <Button id="signin-form-submit" variant="secondary" type="submit">Submit</Button>
              </Card.Body>
            </Card>
          </Form>
          <Alert variant="secondary">
            <Link to="/signup">Click here to Register</Link>
          </Alert>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Login was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col></Row>
    </Container>
  );
};

Signin.propTypes = {
  location: PropTypes.object,
};

export default Signin;
