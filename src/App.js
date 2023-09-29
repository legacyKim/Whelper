import { React, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { searchListDataCorrect, searchListDataDelete } from "./store.js"
import { useSelector, useDispatch } from "react-redux"

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

    const searchClose = () => {
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

    let searchListState = useSelector((state) => state.SearchData);

    const dispatch = useDispatch();
    const newSearch = useRef();
    let newSearchBtn = () => {
        const searchContent = newSearch.current.value;
        const searchContentDupli = searchListState.filter(item => item.searchContent === searchContent);

        if (searchContentDupli.length !== 0) {
            dispatch(searchListDataDelete({ searchContent: searchContentDupli[0].searchContent }));
        }

        dispatch(searchListDataCorrect({ searchContent }));

    }

    const [searchInputValue, setSearchInputValue] = useState('');

    return (

        <div id='app' className={`App ${theme}`}>

            <Routes></Routes>

            <div className={`header ${scrollPosition > 0 ? "active" : ""}`}>

                <div className='logo'>
                    <NavLink to="/" className='icon-github-circled-alt2' onClick={() => { navigate('/') }}></NavLink>
                </div>

                <ul className='header_btn'>
                    <li className='btn'><NavLink to="/components/Write" className='icon-vector-pencil' onClick={() => { navigate('/components/Write') }}></NavLink></li>
                    <li className='btn'><NavLink to="/components/WriteList" className='icon-clipboard' onClick={() => { navigate('/components/WriteList') }}></NavLink></li>
                    <li className='btn'><NavLink to="/components/Memo" className='icon-comment' onClick={() => { navigate('/components/Memo') }}></NavLink></li>
                    <li className='btn'><button className='icon-search' onClick={searchOn}></button></li>
                    <li><div id='theme_screen' className='icon-arrows-ccw' onClick={themeChangeBtn}></div></li>
                </ul>
            </div>

            <div className={`search ${searchActive ? searchActive : ""}`}>
                <div className="search_box">
                    <button className='w_color icon-cancel' onClick={searchClose}></button>
                    <div className="search_input">
                        <input type='text' ref={newSearch} value={searchInputValue} onChange={(e) => setSearchInputValue(e.target.value)}></input>
                        <Link to={`/components/Search/${searchInputValue}`} className='icon-search' onClick={newSearchBtn}></Link>
                    </div>
                    <ol className='search_list'>
                        {
                            searchListState.map(function (a, i) {
                                return (
                                    <li key={i}>
                                        <SearchListContents i={i} />
                                    </li>
                                )
                            })
                        }
                    </ol>
                </div>
            </div>
        </div>

    )

    function SearchListContents({ i }) {

        let delSearchBtn = () => {
            dispatch(searchListDataDelete({ searchContent: searchListState[i].searchContent }));
        }

        const searchValueClick = searchListState[i].searchContent;
        const searchVal = () => {
            setSearchInputValue(searchValueClick);
        }

        return (
            <div>
                <span onClick={searchVal}>{searchListState[i].searchContent}</span>
                <button className='icon-cancel-squared' onClick={delSearchBtn}></button>
            </div>
        )

    }

}

export default App;
