import React from 'react';
import ReactDOM from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import App from '../../ui/layouts/App.jsx';

/* global document */

// Importing the Bootstrap CSS
import './css/theme.css';

// Startup the application by rendering the App layout component.
Meteor.startup(() => {
  const root = ReactDOM.createRoot(
    document.getElementById('root'),
  );
  root.render(<App />);
});
