import { React, useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format, subDays, isAfter } from 'date-fns';

import 'react-toastify/dist/ReactToastify.css';

import { writeListData } from '../data/api.js';
import { syncWriteListDataDate } from "../data/reducers";
import ViewEdit from './SlateView.js';

const useRouteChange = (callback) => {
    const location = useLocation();
    useEffect(() => {
        callback(location);
    }, [location, callback]);
};

function Date_sort() {

    // writeList date
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(writeListData());
        dispatch(syncWriteListDataDate());
    }, [dispatch]);

    const writeListState = useSelector((state) => state.writeListData);
    const groupedData = writeListState.filter(item => item !== null) || [];

    const [writeListActive, setWriteListActive] = useState();
    useRouteChange((location) => {
        if (location.pathname === '/') {
            setWriteListActive('active');
        } else {
            setWriteListActive('');
        }
    });
    //// writeList date

    const isEmpty = Object.keys(groupedData).length === 0;

    return (
        <div className={`content_area date ${writeListActive}`}>
            {isEmpty ? (
                <strong className='dontWasteYourTime'>어영부영하다가 내 이럴 줄 알았지...</strong>
            ) : (
                Object.keys(groupedData).map(date => (
                    <div className='date_box' key={date}>
                        <h2><i className='icon-level-down'></i>{date}</h2>
                        <ul className='data_list_wrap'>
                            {groupedData.map((item) => (
                                <li className='date_list' key={item.id}>
                                    <WriteShowContents writeListArr={item} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    )

    function WriteShowContents({ writeListArr }) {

        const [writeContent, setWriteContent] = useState(writeListArr);
        const titleDoc = new DOMParser().parseFromString(writeContent.title, 'text/html');
        const subTitleDoc = new DOMParser().parseFromString(writeContent.subTitle, 'text/html');
        const contentDoc = new DOMParser().parseFromString(writeContent.content, 'text/html');
        const create_date = writeContent.created_at;

        return (
            <Link to={`/components/WriteView/${writeListArr.id}`}>
                <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
            </Link>
        )
    }

}

export default Date_sort;