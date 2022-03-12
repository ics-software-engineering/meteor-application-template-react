import React from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/layouts/App.jsx';

/* global document */

// Importing the Bootstrap CSS
import './css/theme.css';

// Startup the application by rendering the App layout component.
Meteor.startup(() => {
  render(<App />, document.getElementById('root'));
});
