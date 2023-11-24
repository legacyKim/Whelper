import { React, useEffect, useState, useRef, useContext } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import MyContext from './context'
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

    const searchOn = (e) => {
        e.preventDefault();
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

    useEffect(()=>{
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

    const updateScroll = () => {
        setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    };

    useEffect(() => {
        window.addEventListener('scroll', updateScroll);
    }, []);
    //// about header scroll

    // about search
    const keywordArrLocal = JSON.parse(localStorage.getItem('searchHistory') || []);
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
        // local storage
        localStorage.setItem('searchHistory', JSON.stringify(searchArr));
        setSearchInputValue(searchArr[searchArr.length - 1]);
        newSearch.current.addEventListener('click', (e)=>e.stopPropagation())
    }, [searchArr]);

    const [searchInputValue, setSearchInputValue] = useState(searchArr[searchArr.length - 1]);

    const searchClick = () => {
        navigate(`/components/Search/${searchInputValue}`);
        newSearchBtn();
        searchOn();
    }
    //// about search

    return (

        <MyContext.Provider value={{ searchArr, setSearchArr }}>
            <div id='app' className={`App ${theme}`}>

                <Routes></Routes>

                <div className={`header ${scrollPosition > 0 ? "active" : ""}`}>
                    <div className='logo'>
                        <NavLink to="/" className='icon-github-circled-alt2' onClick={() => { navigate('/') }}></NavLink>
                    </div>
                    <ul className='header_btn'>
                        <li className='btn'><NavLink to="/components/Slate" className='icon-vector-pencil' onClick={() => { navigate('/components/Slate') }}></NavLink></li>
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