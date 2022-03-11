import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class StuffItem extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.stuff.name}</td>
        <td>{this.props.stuff.quantity}</td>
        <td>{this.props.stuff.condition}</td>
        <td>
          <Link to={`/edit/${this.props.stuff._id}`}>Edit</Link>
        </td>
      </tr>
    );
  }
}

// Require a document to be passed to this component.
StuffItem.propTypes = {
  stuff: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(StuffItem);
