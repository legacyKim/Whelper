import { React, useEffect, useState, useRef, useContext } from 'react';
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

    // about change theme
    const themeChangeBtn = () => {
        if (theme === 'dark') {
            themeChange('light');
        } else {
            themeChange('dark');
        }
    }
    //// about change theme

    // about search ShowHide
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

    useEffect(() => {
        if (searchActive) {
            setSearchActive('active');
        } else {
            setSearchActive('');
        }
    }, [searchActive]);
    //// about search ShowHide

    // about header scroll
    const [scrollPosition, setScrollPosition] = useState(0);

    const updateScroll = () => {
        setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    };

    useEffect(() => {
        window.addEventListener('scroll', updateScroll);
    }, []);
    //// about header scroll

    // about search
    // const keywordArrLocal = JSON.parse(localStorage.getItem('searchHistory'));
    const [searchArr, setSearchArr] = useState([]);

    // const dispatch = useDispatch();
    const newSearch = useRef();
    let newSearchBtn = () => {
        const searchContent = newSearch.current.value;
        const searchContentDupli = searchArr.filter(item => item.searchContent === searchContent);

        if (searchContentDupli.length !== 0) {
            // local storage 삭제
        }

        // local storage 추가
        setSearchArr((prevKeywordArr) =>
            searchArr.includes(searchContent)
                ? prevKeywordArr.filter((item) => item !== searchContent)
                : [...prevKeywordArr, searchContent]
        );
    }

    const [searchInputValue, setSearchInputValue] = useState(searchArr[searchArr.length]);
    const searchLastValue = useRef();

    useEffect(() => {
        searchLastValue.current = searchArr[searchArr.length];
        setSearchInputValue(searchLastValue.current);

        // local storage
        localStorage.setItem('cateHistory', JSON.stringify(searchArr));
    }, [searchArr]);
    //// about search

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
                    <li className='btn'><NavLink to={`/components/Search/${searchInputValue}`} className='icon-link-1' onClick={() => { navigate('/components/Search') }}></NavLink></li>
                    <li className='btn'><NavLink to={`/components/Date`} className='icon-calendar' onClick={() => { navigate('/components/Date') }}></NavLink></li>
                    <li className='btn'><NavLink to={`/components/Category`} className='icon-bookmark' onClick={() => { navigate('/components/Category') }}></NavLink></li>
                    <li className='btn'><button className='icon-search' onClick={searchOn}></button></li>
                    <li><div id='theme_screen' className='icon-arrows-ccw' onClick={themeChangeBtn}></div></li>
                </ul>
            </div>

            <div className={`search ${searchActive ? searchActive : ""}`}>
                <div className="search_box">
                    <button className='icon-cancel' onClick={searchOn}></button>
                    <div className="search_input search_toggle">
                        <input type='text' ref={newSearch} value={searchInputValue} onChange={(e) => setSearchInputValue(e.target.value)}></input>
                        <Link to={`/components/Search/${searchInputValue}`} className='icon-search search_input_btn' onClick={() => { newSearchBtn(); searchOn(); }}></Link>
                    </div>
                    <ol className='search_list'>
                        {
                            searchArr.map(function (a, i) {
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
            // local storage 삭제
        }

        const searchValueClick = searchArr[i];
        const searchVal = () => {
            setSearchInputValue(searchValueClick);
        }

        return (
            <div>
                <span onClick={searchVal} >{searchArr[i]}</span>
                <button className='icon-cancel-squared' onClick={delSearchBtn}></button>
            </div>
        )

    }

}

export default App;
