import { React, useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { format, subDays, isAfter } from 'date-fns';

import { debounce } from 'lodash';

import 'react-toastify/dist/ReactToastify.css';

import { writeListDataDate } from '../data/api.js';
import { syncWriteListData } from "../data/reducers"
import ViewEdit from './SlateView.js'

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
        dispatch(writeListDataDate());
        dispatch(syncWriteListData());
    }, [dispatch]);

    const writeListState = useSelector((state) => state.WriteData);

    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);

    const writeListArr = writeListState.data.write.filter(item => {
        if (item !== null) {
            const updatedAt = new Date(item.updated_at);
            return isAfter(updatedAt, sevenDaysAgo);
        }
    }).sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at)) || [];

    const [writeListActive, setWriteListActive] = useState();

    useRouteChange((location) => {
        if (location.pathname === '/') {
            setWriteListActive('active');
        } else {
            setWriteListActive('');
        }
    });
    //// writeList date

    // list create
    const groupedData = writeListArr.reduce((acc, item) => {
        const date = format(new Date(item.updated_at), 'yyyy년 MM월 dd일');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});

    const createList = () => {
        return Object.keys(groupedData).map(date => (
            <div className='date_box' key={date}>
                <h2>{date}</h2>
                {groupedData[date].map((item, i) => (
                    <div className='date_list' key={i}>
                        <WriteShowContents i={i} writeListArr={writeListArr} />
                    </div>
                ))}
            </div>
        ));
    };

    //// list create

    return (
        <div className={`content_area date ${writeListActive}`}>
            {createList()}
        </div>
    )

    function WriteShowContents({ i, writeListArr }) {

        const [writeContent, setWriteContent] = useState(writeListArr[i]);
        const titleDoc = new DOMParser().parseFromString(writeContent.title, 'text/html');
        const subTitleDoc = new DOMParser().parseFromString(writeContent.subTitle, 'text/html');
        const contentDoc = new DOMParser().parseFromString(writeContent.content, 'text/html');
        const create_date = writeContent.created_at;

        return (
            <Link to={`/components/WriteView/${writeListArr[i].id}`}>
                <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
            </Link>
        )
    }

}

export default Date_sort;