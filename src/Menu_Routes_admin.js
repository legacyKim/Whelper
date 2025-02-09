import React from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { Route, Routes, useLocation } from "react-router-dom";

import Admin from './admin/Admin';

function Menu_Routes_admin() {

    const location = useLocation();

    if (location.pathname.includes("components")) return;
    if (location.pathname === '/') return;

    return (
        <div className={`admin_set`}>
            <Routes>
                <Route path="/admin/Admin/*" element={<Admin />} />
            </Routes>
        </div>
    );
}

export default Menu_Routes_admin;
