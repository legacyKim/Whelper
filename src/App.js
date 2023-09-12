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

    const [isSearchOn, setIsSearchOn] = useState('');
    const searchOn = (e) => {
        setIsSearchOn('active');
        // e.stopPropagaion();
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
            <Search></Search>

        </div>

    )

    function Search() {

        let [active, setActive] = useState('')

        useEffect(() => {
            setActive('active')
        }, [isSearchOn]);

        return (

            <div className={`search ${isSearchOn != false ? active : ""}`}>
                <div className="search_box">
                    <input type='text'></input>
                    <button className='w_color' onClick={searchOn}>
                        임시닫기
                    </button>
                </div>
            </div>

        )

    }

}

export default App;
