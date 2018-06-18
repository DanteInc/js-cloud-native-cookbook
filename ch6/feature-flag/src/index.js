import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const federated = {
    // UPDATE ME
    google_client_id: '1234567890',
    facebook_app_id: '1234567890',
    amazon_client_id: '1234567890'
};

ReactDOM.render(<App  federated={federated} />, document.getElementById('root'));
