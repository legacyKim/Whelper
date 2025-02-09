import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";

import store from './data/reducers.js'

import './css/base.css';
import './css/style.css';
import './css/fontello/css/fontello.css'
import './css/fontello/css/animation.css'

import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(

    //  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </QueryClientProvider>
    //  </React.StrictMode>

);

reportWebVitals();