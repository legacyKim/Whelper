import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import MyContext from '../../context.js';

function Gotop() {
    
    const { rootHeight, wlScrollPosition, setWlScrollPosition, MemoScrollPosition, setMemoScrollPosition, cateScrollPosition, setCateScrollPosition, searchScrollPosition, setSearchScrollPosition } = useContext(MyContext);
    const location = useLocation();

    const [scrollGotop, setScrollGotop] = useState(0);
    const [updateScrollPosition, setUpdateScrollPosition] = useState(() => () => {});

    useEffect(() => {

        if (location.pathname.includes('WriteList')) {
            setScrollGotop(wlScrollPosition);
            setUpdateScrollPosition(() => setWlScrollPosition);
        } else if (location.pathname.includes('Memo')) {
            setScrollGotop(MemoScrollPosition);
            setUpdateScrollPosition(() => setMemoScrollPosition);
        } else if (location.pathname.includes('Category')) {
            setScrollGotop(cateScrollPosition);
            setUpdateScrollPosition(() => setCateScrollPosition);
        } else if (location.pathname.includes('Search')) {
            setScrollGotop(searchScrollPosition);
            setUpdateScrollPosition(() => setSearchScrollPosition);
        }

    }, [location.pathname, wlScrollPosition, MemoScrollPosition, cateScrollPosition, searchScrollPosition]);

    const [gotopActive, setGotopActive] = useState('inactive');
    useEffect(() => {
        if (scrollGotop > rootHeight) {
            setGotopActive('active');
        } else {
            setGotopActive('inactive');
        }
    }, [scrollGotop, rootHeight]);

    const gotopClick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        if (updateScrollPosition) {
            updateScrollPosition(0);
        }
    };

    return (
        <div className={`gotop ${gotopActive}`} onClick={gotopClick}>
            <i className='icon-up-dir'></i>
        </div>
    );
}

export default Gotop;
