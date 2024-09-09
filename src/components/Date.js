import { React, useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format, subDays, isAfter, compareDesc  } from 'date-fns';

import 'react-toastify/dist/ReactToastify.css';

import { writeListDateData } from '../data/api.js';
import ViewEdit from './SlateView.js';

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

    const writeListState = useSelector((state) => state.WriteListDateDataOn);
    const groupedData = writeListState.data.write.filter(item => item !== null) || [];

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

    return (
        <div className={`content_area date ${writeListActive}`}>
            {isEmpty ? (
                <strong className='dontWasteYourTime'>어영부영하다가 내 이럴 줄 알았지...</strong>
            ) : (
                Object.keys(groupedByDate).map(date => (
                    <div className='date_box' key={date}>
                        <h2><i className='icon-level-down'></i>{date}</h2>
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

    const [writeContent, setWriteContent] = useState(writeListArr);
    const titleDoc = new DOMParser().parseFromString(writeContent.title, 'text/html');
    const subTitleDoc = new DOMParser().parseFromString(writeContent.subTitle, 'text/html');
    const contentDoc = new DOMParser().parseFromString(writeContent.content, 'text/html');

    return (
        <Link to={`/components/WriteView/${writeListArr.id}`}>
            <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
        </Link>
    );
}

export default Date_sort;