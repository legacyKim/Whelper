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

import { useQuery } from '@tanstack/react-query';
import { updateNotice } from '../data/api.js';

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
    }, [scrollPosition]);

    // notice popup
    const [noticePopup, setUpdatePopup] = useState(() => {
        const hideUntil = localStorage.getItem('hideNotice');
        if (hideUntil) {
            const hideUntilDate = new Date(hideUntil);
            const now = new Date();
            return hideUntilDate < now;
        }
        return true;
    });
    //// notice popup

    const { data, isLoading, error } = useQuery({
        queryKey: ['notice', { limit: 5 }],
        queryFn: updateNotice,
    });

    const [noticeInfo, setNoticeInfo] = useState([]);

    useEffect(() => {
        if (data) {
            setNoticeInfo(data);
        }
    }, [data]);

    const [activeNoticeId, setActiveNoticeId] = useState(null);
    useEffect(() => {
        setActiveNoticeId(noticeInfo.length - 1);
    }, [noticeInfo]);


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

            {(noticePopup && noticeInfo.length !== 0) && (
                <div className='notice_popup_bg'>
                    <div className='notice_popup' style={{ animation: noticeInfo.length > 0 ? 'ease-in 0.3s both updatePopup' : '' }}>
                        <div className="notice_popup_header">
                            <h3>Notice</h3>
                            <button onClick={() => { setUpdatePopup(false) }}>
                                <i className="icon-cancel"></i>
                            </button>
                        </div>
                        <ul className="notice_popup_body scroll">
                            {
                                noticeInfo.map((item, i) => {
                                    return (
                                        <li
                                            key={i}
                                            className={`${activeNoticeId === i ? 'active' : ''}`}
                                            onClick={() => setActiveNoticeId(activeNoticeId === i ? null : i)}
                                        >
                                            <div className="notice_popup_list">
                                                <span className='title'>
                                                    {item.title}
                                                </span>
                                                <b className='date'>
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </b>
                                            </div>
                                            <div
                                                className={`notice_content ${activeNoticeId === i ? 'active' : ''}`}
                                                ref={el => {
                                                    if (el) {
                                                        if (activeNoticeId === i) {
                                                            el.style.height = `${el.scrollHeight}px`;
                                                        } else {
                                                            el.style.height = '0px';
                                                        }
                                                    }
                                                }}>
                                                <p className="" style={{ height: item.height }}>
                                                    {item.notice}
                                                </p>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <div className="notice_popup_footer">
                            <input
                                type="checkbox"
                                id="hideNotice"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        const tomorrow = new Date();
                                        tomorrow.setDate(tomorrow.getDate() + 1);
                                        localStorage.setItem('hideNotice', tomorrow.toISOString());
                                        setUpdatePopup(false);
                                    }
                                }}
                            />


                            <label htmlFor="hideNotice">오늘 하루 동안 보지 않기</label>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function WriteShowContents({ writeListArr }) {

    const { isAuth, writeListCheckPwCorr } = useContext(MyContext);

    const [writeContent, setWriteContent] = useState(writeListArr);

    const titleDoc = writeContent.title;
    const subTitleDoc = writeContent.subTitle;
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