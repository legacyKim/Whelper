import { React, useEffect, useState } from 'react';

// import type { FC } from "react";

import {
    NavLink, useNavigate
} from "react-router-dom";

import './css/style.css';
import Routes from './Routes'

function App() {

    const navigate = useNavigate();
    const [theme, themeChange] = useState('dark');

    const themeChangeBtn = () => {
        if (theme === 'dark') {
            themeChange('light');
        } else {
            themeChange('dark');
        }
    }

    const [isSearchOn, setIsSearchOn] = useState(false);
    const [searchActive, setSearchActive] = useState('');

    const searchOn = () => {
        setIsSearchOn(!isSearchOn);
        if (!isSearchOn) {
            setSearchActive('active');
        } else {
            setSearchActive('');
        }
    };

    const closeSearch = () => {
        setTimeout(() => {
            setIsSearchOn(false);
        }, 300);

        setSearchActive('');
    };

    useEffect(() => {
        if (searchActive) {
            setSearchActive('active');
        } else {
            setSearchActive('');
        }
    }, [searchActive]);

    const [scrollPosition, setScrollPosition] = useState(0);

    const updateScroll = () => {
        setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    };
    
    useEffect(() => {
        window.addEventListener('scroll', updateScroll);
    }, []);

    return (

        <div id='app' className={`App ${theme}`}>
            <div className={`header ${scrollPosition > 0 ? "active" : ""}`}>

                <div className='logo'>
                    <NavLink to="/" className='icon-github-circled-alt2' onClick={() => { navigate('/') }}></NavLink>
                </div>

                <ul className='header_btn'>
                    <li className='btn'><NavLink to="/components/Write" className='icon-vector-pencil' onClick={() => { navigate('/components/Write') }}></NavLink></li>
                    <li className='btn'><NavLink to="/components/WriteList" className='icon-clipboard' onClick={() => { navigate('/components/WriteList') }}></NavLink></li>

                    <li className='btn'><NavLink to="/components/Memo" className='icon-comment' onClick={() => { navigate('/components/Memo') }}></NavLink></li>
                    <li className='btn'><button className='icon-search' onClick={searchOn}></button></li>

                    {/* <li className='index_btn'>
                        <NavLink to="" onClick={() => { navigate('/components/Side') }}>SIDE</NavLink>
                    </li> */}
                    <li>
                        <div id='theme_screen' className='icon-arrows-ccw' onClick={themeChangeBtn}></div>
                    </li>
                </ul>
            </div>

            <Routes></Routes>
            {/* <Search isSearchOn={isSearchOn} searchActive={searchActive}></Search> */}

            <div className={`search ${searchActive ? searchActive : ""}`}>
                <div className="search_box">
                    <button className='w_color icon-cancel' onClick={closeSearch}></button>
                    <div className="search_input">
                        <input type='text'></input>
                    </div>
                    <ol className='search_list'>
                        <li>
                        </li>

                    </ol>
                </div>
            </div>
        </div>

    )

}

export default App;
