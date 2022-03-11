import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

const LoadingSpinner = () => (<Container>
  <Row className="justify-content-md-center"><Spinner animation="border"/>Getting data</Row>
</Container>);

export default LoadingSpinner;
