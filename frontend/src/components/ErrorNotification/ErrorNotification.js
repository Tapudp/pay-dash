import React from 'react';
import './ErrorNotification.css';

const ErrorNotification = ({ errorMessage, close }) => (
  <div className='error-notification-container'>
    <p className='error-message'>{errorMessage}</p>
    <button onClick={close}>Close</button>
  </div>
);

export default ErrorNotification;
