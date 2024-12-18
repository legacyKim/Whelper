import { React, useEffect, useState, useRef, useCallback } from 'react';
import { NavLink, useNavigate, Link, useLocation, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux"

import { debounce } from 'lodash';
import MyContext from './context'

import writeNavi from './components/hook/writeNavi.js'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './css/style.css';

import Menu_Routes from './Menu_Routes';
import Menu_Routes_admin from './Menu_Routes_admin.js';

import { logout, userCheckRefresh } from './data/api.js'

function App() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const prevPathRef = useRef();

    useEffect(() => {
        prevPathRef.current = location.pathname;
    }, [location.pathname]);

    const prevPathname = prevPathRef.current;
    const currentPathname = location.pathname;

    const [isAuth, setAuth] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const checkAuth = async () => {

            const cookieName = 'csrf_access_token';
            const cookies = document.cookie.split(';');
            const hasCookie = cookies.some(cookie => {
                const trimmedCookie = cookie.trim();
                return trimmedCookie.startsWith(`${cookieName}=`);
            });

            if (hasCookie) {
                const result = await dispatch(userCheckRefresh());
                if (result.payload?.info?.authority === 0 || result.payload?.info?.authority === 1) {
                    setAuth(result.payload.info.authority);
                } else {
                    setAuth(null);
                }
            } else {
                if (isAuth !== false) {
                    alert("다시 로그인 해주세요.");
                    navigate('/components/Login');
                    return;
                }
            }
        };

        checkAuth();

    }, [isAuth]);

    const loggedOut = async () => {
        const result = await dispatch(logout());
        setAuth(false);
    };

    // write 검증
    const writePath = '/components/Write';
    //// write 검증

    // about change theme
    const [theme, themeChange] = useState('dark');
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

    // about scroll
    const [scrollPosition, setScrollPosition] = useState(0);
    const [wlScrollPosition, setWlScrollPosition] = useState(0);
    const [MemoScrollPosition, setMemoScrollPosition] = useState(0);
    const [cateScrollPosition, setCateScrollPosition] = useState(0);
    const [searchScrollPosition, setSearchScrollPosition] = useState(0);
    const rootHeight = document.getElementById('root').offsetHeight;
    //// aboutr scroll

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

    // anno ui
    const [annoListBtn, setAnnoListBtn] = useState(false);
    const [annoClick, setAnnoClick] = useState();
    const [annoString, setAnnoString] = useState();
    //// anno ui

    // memoInWrite 
    const [memoInWriteBtn, setMemoInWriteBtn] = useState(false);
    const [memoText, setMemoText] = useState('');
    const [memoCopyActiveOn, setMemoCopyActiveOn] = useState(false);
    //// memoInWrite

    // linkListBtn
    const [linkListBtn, setLinkListBtn] = useState(false);
    const [linkList, setLinkList] = useState([]);
    //// linkListBtn

    // customEditor mode
    const [mode, setMode] = useState();
    //// customEditor mode

    // password check for corr
    const [writeListCheckPwCorr, setWriteListCheckPwCorr] = useState();
    //// password check for corr

    // default right click, copy
    useEffect(() => {
        if (isAuth === false) {
            const handleKeyDown = (event) => {
                if (event.ctrlKey && event.key.toLowerCase() === 'c') {
                    event.preventDefault();
                }
            };

            const onClickRight = (event) => {
                event.preventDefault();
            }

            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('contextmenu', onClickRight);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('contextmenu', onClickRight);
            };
        }
    }, [isAuth])
    //// default right click, copy

    const updateScrollHeader = useCallback(
        debounce(() => {
            setScrollPosition(window.scrollY || document.documentElement.scrollTop);
        }, 100),
        []
    );

    const [showHeader, setShowHeader] = useState(false);
    useEffect((e) => {
        window.addEventListener('scroll', updateScrollHeader);
        return () => {
            window.removeEventListener('scroll', updateScrollHeader);
        };

    }, []);

    useEffect(() => {
        const handleMouseOver = (e) => {
            const header = document.querySelector(".header");
            const headerHeight = header.clientHeight;
            if (scrollPosition > headerHeight) {
                if (e.clientY < headerHeight) {
                    setShowHeader(true);
                } else {
                    setShowHeader(false);
                }
            }
        };
        document.addEventListener('mouseover', handleMouseOver);
        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, [scrollPosition]);

    return (

        <MyContext.Provider value={{
            location,
            showHeader,
            searchArr, setSearchArr,
            wlScrollPosition, setWlScrollPosition, MemoScrollPosition, setMemoScrollPosition, cateScrollPosition, setCateScrollPosition, searchScrollPosition, setSearchScrollPosition,
            rootHeight,
            isAuth, setAuth,
            loading, setLoading,
            annoListBtn, setAnnoListBtn, annoClick, setAnnoClick, annoString, setAnnoString,
            prevPathname, currentPathname,
            memoInWriteBtn, setMemoInWriteBtn,
            memoText, setMemoText,
            memoCopyActiveOn, setMemoCopyActiveOn,
            linkListBtn, setLinkListBtn,
            linkList, setLinkList,
            mode, setMode,
            writeListCheckPwCorr, setWriteListCheckPwCorr,
        }}>
            <div id='app' className={`App ${theme}`}>

                <ToastContainer />

                <div className={`header ${showHeader === true ? "active" : ""}`}>
                    <div className='logo'>
                        <NavLink to="/" className='bambueong_logo' onClick={() => { navigate('/') }}></NavLink>
                    </div>
                    <ul className='header_btn'>
                        <li className='btn'><NavLink className='icon-vector-pencil' onClick={(e) => { writeNavi(e, writePath, navigate, isAuth) }}>
                            <div className='tooltip'><span>Write</span></div>
                        </NavLink></li>
                        <li className='btn'><NavLink to="/components/WriteList" className='icon-clipboard' >
                            <div className='tooltip'><span>Write-List</span></div>
                        </NavLink></li>
                        <li className='btn'><NavLink to="/components/Memo" className='icon-comment' >
                            <div className='tooltip'><span>Memo</span></div>
                        </NavLink></li>

                        <li className='btn'><NavLink to={`/components/AnnoLink`} className='icon-flow-split' >
                            <div className='tooltip'><span>Annotation</span></div>
                        </NavLink></li>

                        <li className='btn'><NavLink to={`/components/Category`} className='icon-tags' >
                            <div className='tooltip'><span>Category</span></div>
                        </NavLink></li>
                        <li className='btn'><button className='icon-search' onClick={searchOn}>
                            <div className='tooltip'><span>Search</span></div>
                        </button></li>
                        <li className='btn'><NavLink to={`/components/Search/${searchInputValue}`} className='icon-link-1' >
                            <div className='tooltip'><span>Search Res</span></div>
                        </NavLink></li>
                        <li className='btn'><NavLink to={`/components/Work`} className='icon-list-bullet' >
                            <div className='tooltip'><span>Work</span></div>
                        </NavLink></li>

                        {(isAuth === 0 || isAuth === 1) && (
                            <li className='btn'><NavLink to={`/admin/Admin`} className='icon-key' >
                                <div className='tooltip'><span>Admin</span></div>
                            </NavLink></li>
                        )}

                        {isAuth === false ? (
                            <li className='btn'><NavLink to={`/components/Login`} className='icon-login' >
                                <div className='tooltip'><span>Log-In</span></div>
                            </NavLink></li>
                        ) : (
                            <li className='btn'><button className='icon-logout' onClick={loggedOut}>
                                <div className='tooltip'><span>Log-Out</span></div>
                            </button></li>
                        )}
                    </ul>
                </div>

                <Menu_Routes></Menu_Routes>
                <Menu_Routes_admin></Menu_Routes_admin>

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
        </MyContext.Provider >
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