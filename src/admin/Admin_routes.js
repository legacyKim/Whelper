import React from 'react';
import { Route, Routes } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import history from '../history.ts'

import Admin from './Admin.js';
import User from './User.js';
import Log from './Log.js';
import Stats from './Stats.js';
import Updates from './Updates.js';

function Admin_routes({ location }) {

    if (location.pathname.includes("components")) return;
    if (location.pathname === '/') return;

    return (
        <div className={`admin_content`}>

            <TransitionGroup component={null}>
                <CSSTransition key={location.key} classNames="fade" timeout={300}>
                    <Routes history={history}>
                        <Route path="/Admin" element={<Admin />} />
                        <Route path="/User" element={<User />} />
                        <Route path="/Log" element={<Log />} />
                        <Route path="/Stats" element={<Stats />} />
                        <Route path="/Updates" element={<Updates />} />
                    </Routes>
                </CSSTransition>
            </TransitionGroup>

        </div>
    );
}

export default Admin_routes;
