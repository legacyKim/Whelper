import { React, useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"

import { debounce } from 'lodash';
import MyContext from './context'

import { token_check } from './data/token_check.js'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Date from './components/Date.js'

import './css/style.css';
import Routes from './Routes'

function App() {

    var [log_check, setlog] = useState(null);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (token) {
            setlog(token);
        }
    }, [token]);

    const loggedOut = () => {
        localStorage.removeItem('access_token');
        setlog(null);
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

    // write 검증
    const writeNavi = async (e) => {
        e.preventDefault();
        const isTokenValid = await token_check(navigate);
        if (isTokenValid) {
            navigate('/components/Write');
        }
    };
    //// write 검증

    return (

        <MyContext.Provider value={{ searchArr, setSearchArr, scrollPosition, setScrollPosition }}>
            <div id='app' className={`App ${theme}`}>

                <ToastContainer />
                <Date></Date>

                <div className={`header ${scrollPosition > 0 ? "active" : ""}`}>
                    <div className='logo'>
                        <NavLink to="/" className='icon-github-circled-alt2' onClick={() => { navigate('/') }}></NavLink>
                    </div>
                    <ul className='header_btn'>
                        {/* <li className='btn'><NavLink to="/components/Slate" className='icon-vector-pencil' onClick={() => { navigate('/components/Slate') }}></NavLink></li> */}
                        <li className='btn'><NavLink to="/components/Write" className='icon-vector-pencil' onClick={writeNavi}>
                            <div className='tooltip'><span>Write</span></div>
                        </NavLink></li>
                        <li className='btn'><NavLink to="/components/WriteList" className='icon-clipboard' onClick={() => { navigate('/components/WriteList') }}>
                            <div className='tooltip'><span>Write-List</span></div>
                        </NavLink></li>
                        <li className='btn'><NavLink to="/components/Memo" className='icon-comment' onClick={() => { navigate('/components/Memo') }}>
                            <div className='tooltip'><span>Memo</span></div>
                        </NavLink></li>
                        {/* <li className='btn'><NavLink to="/components/Book" className='icon-book-1' onClick={() => { navigate('/components/Book') }}></NavLink></li> */}

                        <li className='btn'><NavLink to={`/components/Category`} className='icon-bookmark' onClick={() => { navigate('/components/Category') }}>
                            <div className='tooltip'><span>Category</span></div>
                        </NavLink></li>
                        <li className='btn'><button className='icon-search' onClick={searchOn}>
                            <div className='tooltip'><span>Search</span></div>
                        </button></li>
                        <li className='btn'><NavLink to={`/components/Search/${searchInputValue}`} className='icon-link-1' onClick={() => { navigate('/components/Search') }}>
                            <div className='tooltip'><span>Search Res</span></div>
                        </NavLink></li>
                        <li className='btn'><NavLink to={`/components/Work`} className='icon-list-bullet' onClick={() => { navigate('/components/Work') }}>
                            <div className='tooltip'><span>Work</span></div>
                        </NavLink></li>

                        {token === null ? (
                            <li className='btn'><NavLink to={`/components/Login`} className='icon-login' onClick={() => { navigate('/components/Login') }}>
                                <div className='tooltip'><span>Log-In</span></div>
                            </NavLink></li>
                        ) : (
                            <li className='btn'><button className='icon-logout' onClick={loggedOut}>
                                <div className='tooltip'><span>Log-Out</span></div>
                            </button></li>
                        )}

                        {/* <li><div id='theme_screen' className='icon-arrows-ccw' onClick={themeChangeBtn}></div></li> */}
                    </ul>
                </div>

                <Routes></Routes>

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