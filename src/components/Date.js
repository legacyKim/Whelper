import { React, useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { format, subDays, isAfter } from 'date-fns';

import { debounce } from 'lodash';

import 'react-toastify/dist/ReactToastify.css';

import { writeListDataDate } from '../data/api.js';
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
    }, [dispatch]);

    const writeListState = useSelector((state) => state.WriteData);

    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);

    const writeListArr = writeListState.data.write.filter(item => {
        const updatedAt = new Date(item.updated_at);
        return isAfter(updatedAt, sevenDaysAgo);
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

    return (
        <div className={`content_area main ${writeListActive}`}>
            {
                writeListArr.map(function (a, i) {
                    return (
                        <div key={i} className="WriteDiv">
                            <WriteShowContents i={i} writeListArr={writeListArr} />
                        </div>
                    )
                })
            }
        </div>
    )

    function WriteShowContents({ i, writeListArr }) {

        const [writeContent, setWriteContent] = useState(writeListArr[i]);
        const titleDoc = new DOMParser().parseFromString(writeContent.title, 'text/html');
        const subTitleDoc = new DOMParser().parseFromString(writeContent.subTitle, 'text/html');
        const contentDoc = new DOMParser().parseFromString(writeContent.content, 'text/html');
        const create_date = writeContent.created_at;

        return (

            <div>
                <div className='write_btn'>
                    <Link className='icon-edit-alt' to={`/components/WriteCorrect/${writeListArr[i].id}`}></Link>
                </div>
                <div className='write_list'>
                    <Link to={`/components/WriteView/${writeListArr[i].id}`}>
                        <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
                    </Link>
                </div>
            </div>
        )
    }

}

export default Date_sort;