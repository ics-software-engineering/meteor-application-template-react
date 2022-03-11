import React from 'react';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
class NotFound extends React.Component {
  render() {
    return (
      <h2 textAlign="center">
        <p>Page not found</p>
      </h2>
    );
  }
}

export default NotFound;
