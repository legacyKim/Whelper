import { React, useState } from 'react';

// import type { FC } from "react";

import {
    NavLink, useNavigate
} from "react-router-dom";

import './css/style.css';

import Menu from './Menu'

function App() {

    const navigate = useNavigate();

    const [theme, themeChange] = useState('dark');

    const themeChangeBtn = () => {
        if (theme === 'dark') {
            themeChange('light');
            console.log(theme)
        } else {
            themeChange('dark');
            console.log(theme)
        }
    }

    // const Page: FC<{ to: string }> = (props) => <main><Link {...props} /></main>; // prettier-ignore

    return (

        <div className={`App ${theme}`}>
            <div className='header'>

                <div className='logo'>
                    <NavLink to="/" className='icon-github-circled-alt2' onClick={() => { navigate('/') }}></NavLink>
                </div>

                <ul className='header_btn'>
                    <li className='btn'><NavLink to="/components/Write" className='icon-vector-pencil' onClick={() => { navigate('/components/Write') }}></NavLink></li>
                    <li className='btn'><NavLink to="/components/WriteList" className='icon-clipboard' onClick={() => { navigate('/components/WriteList') }}></NavLink></li>
                    <li className='btn'><NavLink to="/components/Memo" className='' onClick={() => { navigate('/components/Memo') }}></NavLink></li>
                    <li className='btn'><NavLink to="/components/Search" className='icon-search' onClick={() => { navigate('/components/Search') }}></NavLink></li>
                    <li className='index_btn'>
                        <NavLink to="" onClick={() => { navigate('/components/Side') }}>
                            SIDE
                        </NavLink>
                    </li>
                    <li>
                        <div id='theme_screen' className='icon-arrows-ccw' onClick={themeChangeBtn}></div>
                    </li>
                </ul>
            </div>

            <Menu></Menu>

        </div>

    );

}

export default App;
