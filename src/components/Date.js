import { React, useEffect, useState, useContext, useCallback } from 'react';

import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MyContext from '../context';

import { debounce } from 'lodash';
import { format, compareDesc } from 'date-fns';

import 'react-toastify/dist/ReactToastify.css';

import { writeListDateData } from '../data/api.js';
import ViewEdit from './ViewEdit.js';

import writeNavi from './hook/writeNavi.js';
import Lock from './func/Lock.js';

const useRouteChange = (callback) => {
    const location = useLocation();
    useEffect(() => {
        callback(location);
    }, [location, callback]);
};

function Date_sort() {

    const dispatch = useDispatch();
    const [writeListActive, setWriteListActive] = useState();

    useEffect(() => {
        dispatch(writeListDateData());
    }, [dispatch]);

    const writeListStateDate = useSelector((state) => state.WriteListDateDataOn);
    const groupedData = Array.isArray(writeListStateDate.data.write) === true ? writeListStateDate.data.write.filter(item => item !== null) : [];

    useRouteChange((location) => {
        if (location.pathname === '/') {
            setWriteListActive('active');
        } else {
            setWriteListActive('');
        }
    });

    const groupedByDate = {};

    groupedData.sort((a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        return compareDesc(dateA, dateB);
    });

    groupedData.forEach(item => {
        const date = format(new Date(item.updated_at || item.created_at), 'yyyy년 MM월 dd일');
        if (!groupedByDate[date]) {
            groupedByDate[date] = [];
        }
        groupedByDate[date].push(item);
    });

    const isEmpty = Object.keys(groupedByDate).length === 0;

    const rootHeight = document.getElementById('root').offsetHeight;
    const [scrollPosition, setScrollPosition] = useState(0);

    const updateScrollDate = useCallback(
        debounce(() => {
            setScrollPosition(window.scrollY || document.documentElement.scrollTop);
        }, 100),
        []
    );

    useEffect((e) => {
        window.addEventListener('scroll', updateScrollDate);
        return () => {
            window.removeEventListener('scroll', updateScrollDate);
        };

    }, []);

    function dataListScroll() {
        const dateList = document.querySelectorAll('.date_list');

        dateList.forEach((ele, i) => {
            if (scrollPosition + rootHeight - ele.offsetHeight * 2 > ele.offsetTop - ele.offsetHeight) {
                ele.classList.add("anima");
            }
        });
    }
    dataListScroll();

    useEffect(() => {
        dataListScroll();
    }, [scrollPosition])

    return (
        <div className={`content_area date ${writeListActive}`}>
            {isEmpty ? (
                <strong className='dontWasteYourTime'>어영부영하다가 내 이럴 줄 알았지...</strong>
            ) : (
                Object.keys(groupedByDate).map(date => (
                    <div className='date_box' key={date}>
                        <h2><i className='icon-calendar'></i>{date}</h2>
                        <ul className='data_list_wrap'>
                            {groupedByDate[date].map((item) => (
                                <li className='date_list' key={item.id}>
                                    <WriteShowContents writeListArr={item} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
}

function WriteShowContents({ writeListArr }) {

    const { isAuth, writeListCheckPwCorr } = useContext(MyContext);

    const [writeContent, setWriteContent] = useState(writeListArr);

    const titleDoc = new DOMParser().parseFromString(writeContent.title, 'text/html');
    const subTitleDoc = new DOMParser().parseFromString(writeContent.subTitle, 'text/html');
    const contentDoc = new DOMParser().parseFromString(writeContent.content, 'text/html');

    const write_password = writeContent.password;
    const writeContentId = writeListArr.id;

    const writePath = `/components/WriteView/${writeContentId}`;

    const [writeListCheckPop, setWriteListCheckPop] = useState(false);

    return (
        <div className="date_content_box">
            <div className="date_content_box_anima"></div>
            <div className={`fake_div ${writeListCheckPop ? 'active' : ''}`}>
                <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
                {write_password != null && write_password !== '' && (
                    <i className="lock icon-lock-1"></i>
                )}
            </div>

            <Lock isAuth={isAuth} write_password={write_password} writeContentId={writeContentId} writeListCheckPwCorr={writeListCheckPwCorr} writeNavi={writeNavi} writePath={writePath} writeListCheckPop={writeListCheckPop} setWriteListCheckPop={setWriteListCheckPop}></Lock>

        </div>

    );
}

export default Date_sort;