import { React, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import '../css/admin.css';

import Admin_menu from './Admin_menu.js';
import Admin_routes from './Admin_routes.js';

import onlyTokenCheck from '../data/onlyTokenCheck.js';

function Admin() {

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        onlyTokenCheck(navigate);
    }, []);

    return (
        <div className="admin">

            <Admin_menu />

            <div className='admin_wrap'>
                {location.pathname === "/admin/Admin" && (
                    <h4 className='admin_tit'>여기엔 뭐하지..?</h4>
                )}

                <Admin_routes location={location} />
            </div>
        </div>
    )
}

export default Admin;