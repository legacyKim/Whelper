import { React, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

import '../css/admin.css';

import Admin_menu from './Admin_menu.js';
import Admin_routes from './Admin_routes.js';

const queryClient = new QueryClient();

function Admin() {

    const location = useLocation();

    return (
        <QueryClientProvider client={queryClient}>
            <div className="admin">

                <Admin_menu />

                <div className='admin_wrap'>
                    {location.pathname === "/admin/Admin" && (
                        <h4 className='admin_tit'>여기엔 뭐하지..?</h4>
                    )}

                    <Admin_routes location={location} />
                </div>
            </div>
        </QueryClientProvider>
    )
}

export default Admin;