import { React, useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"

import { debounce } from 'lodash';
import MyContext from './context'

import { userCheck, login } from './data/api.js'
import { logout } from './data/reducers.js'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './css/style.css';
import Routes from './Routes'

function App() {

    const dispatch = useDispatch();
    // useEffect(()=>{
    //     dispatch(login())
    // }, []);

    const logSession = sessionStorage.getItem('access_token');
    const log_res = sessionStorage.getItem('auth');

    // const logged = useSelector(state => state.loginData);
    // const log_auth = logged.loggedIn.authority;
    const log_auth = 0;

    const loggedOut = () => {
        sessionStorage.removeItem('access_token');
    };

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

    const searchOn = (e) => {

        if (searchActive !== 'active') {
            e.stopPropagation();
        }

        setIsSearchOn(!isSearchOn);
        if (!isSearchOn) {
            setSearchActive('active');
        } else {
            setSearchActive('');
        }
    };

    const searchOff = () => {
        setSearchActive('');
        setIsSearchOn(false);
    }

    useEffect(() => {
        window.addEventListener('click', searchOff);
    }, [])

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

    useEffect(() => {
        const updateScroll = debounce(() => {
            setScrollPosition(window.scrollY || document.documentElement.scrollTop);
        });
        window.addEventListener('scroll', updateScroll);
        return () => {
            window.removeEventListener('scroll', updateScroll);
        };
    }, []);
    //// about header scroll

    // about search
    const keywordArrLocalString = localStorage.getItem('searchHistory');
    const keywordArrLocal = keywordArrLocalString !== null ? JSON.parse(keywordArrLocalString) : [];
    const [searchArr, setSearchArr] = useState(keywordArrLocal);

    const newSearch = useRef();
    let newSearchBtn = () => {
        const searchContent = newSearch.current.value;

        // local storage 추가
        setSearchArr((prevKeywordArr) =>
            searchArr.includes(searchContent)
                ? [...new Set(prevKeywordArr.filter((item) => item !== searchContent)), searchContent]
                : [...prevKeywordArr, searchContent]
        );
    }

    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(searchArr));
        setSearchInputValue(searchArr[searchArr.length - 1]);
        newSearch.current.addEventListener('click', (e) => e.stopPropagation())
    }, [searchArr]);

    const [searchInputValue, setSearchInputValue] = useState(searchArr[searchArr.length - 1]);

    const searchClick = () => {
        navigate(`/components/Search/${searchInputValue}`);
        newSearchBtn();
        searchOn();
    }
    //// about search

    return (

        <MyContext.Provider value={{ searchArr, setSearchArr, scrollPosition, setScrollPosition }}>
            <div id='app' className={`App ${theme}`}>

                <Routes></Routes>
                <ToastContainer />

                <div className={`header ${scrollPosition > 0 ? "active" : ""}`}>
                    <div className='logo'>
                        <NavLink to="/" className='icon-github-circled-alt2' onClick={() => { navigate('/') }}></NavLink>
                    </div>
                    <ul className='header_btn'>
                        {/* <li className='btn'><NavLink to="/components/Slate" className='icon-vector-pencil' onClick={() => { navigate('/components/Slate') }}></NavLink></li> */}
                        {log_auth === 0 && (
                            <li className='btn'><NavLink to="/components/Write" className='icon-vector-pencil' onClick={() => { navigate('/components/Write') }}></NavLink></li>
                        )}
                        <li className='btn'><NavLink to="/components/WriteList" className='icon-clipboard' onClick={() => { navigate('/components/WriteList') }}></NavLink></li>
                        <li className='btn'><NavLink to="/components/Memo" className='icon-comment' onClick={() => { navigate('/components/Memo') }}></NavLink></li>
                        {/* <li className='btn'><NavLink to="/components/Book" className='icon-book-1' onClick={() => { navigate('/components/Book') }}></NavLink></li> */}
                        <li className='btn'><NavLink to={`/components/Search/${searchInputValue}`} className='icon-link-1' onClick={() => { navigate('/components/Search') }}></NavLink></li>
                        <li className='btn'><NavLink to={`/components/Date`} className='icon-calendar' onClick={() => { navigate('/components/Date') }}></NavLink></li>
                        <li className='btn'><NavLink to={`/components/Category`} className='icon-bookmark' onClick={() => { navigate('/components/Category') }}></NavLink></li>
                        <li className='btn'><button className='icon-search' onClick={searchOn}></button></li>

                        {logSession === null ? (
                            <li className='btn'><NavLink to={`/components/Login`} className='icon-login' onClick={() => { navigate('/components/Login') }}></NavLink></li>
                        ) : (
                            <li className='btn'><button className='icon-logout' onClick={loggedOut}></button></li>
                        )}

                        <li><div id='theme_screen' className='icon-arrows-ccw' onClick={themeChangeBtn}></div></li>
                    </ul>
                </div>

                <div className={`search ${searchActive ? searchActive : ""}`}>
                    <div className="search_box">
                        <button className='icon-cancel' onClick={searchOn}></button>
                        <div className="search_input search_toggle">
                            <input type='text' ref={newSearch} value={searchInputValue} onInput={(e) => setSearchInputValue(e.target.value)}></input>
                            <button className='icon-search search_input_btn' onClick={searchClick}></button>
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
        </MyContext.Provider>
    )

    function SearchListContents({ i }) {

        let delSearchBtn = (e) => {
            setSearchArr((prevKeywordArr) =>
                searchArr.includes(searchArr[i])
                    ? prevKeywordArr.filter((item) => item !== searchArr[i])
                    : [...prevKeywordArr]
            );
            e.stopPropagation();
        }

        const searchValueClick = searchArr[i];
        const searchVal = (e) => {
            setSearchInputValue(searchValueClick);
            e.stopPropagation();
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