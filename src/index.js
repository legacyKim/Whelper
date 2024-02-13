import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";

import store from './store.js'

import './css/index.css';
import './css/base.css';
import './css/style.css';
import './css/fontello/css/fontello.css'

import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

    //  <React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
    //  </React.StrictMode>

);

reportWebVitals();