import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import { syncWriteListPageData } from '../data/reducers.js'
import { writeListPageData } from '../data/api.js';

import { debounce } from 'lodash';

import MyContext from '../context';
import ViewEdit from './SlateView.js';

import useScrollAnima from './hook/useScrollAnima.js'

import { token_check } from '../data/token_check.js';

function WriteList() {

    const { isAuth, rootHeight, wlScrollPosition, setWlScrollPosition } = useContext(MyContext);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(syncWriteListPageData());

        dispatch(writeListPageData(page)).then(() => {
            setTotalPages(writeListState.data.totalPages)
        });
    }, [dispatch])

    const [page, setPage] = useState(1);

    const writeListState = useSelector((state) => state.WriteListPageDataOn);
    const writeListArr = writeListState.data.write || [];

    const [totalPages, setTotalPages] = useState(writeListState.data.totalPages);
    console.log(totalPages);

    useEffect(() => {
        const updateScroll = debounce(() => {
            setWlScrollPosition(window.scrollY || document.documentElement.scrollTop);
        });
        window.addEventListener('scroll', updateScroll);
        return () => {
            window.removeEventListener('scroll', updateScroll);
        };
    }, []);

    useEffect(() => {
        const writeAreaHeight = document.querySelector('.content_area_write').offsetHeight;

        if (page <= totalPages) {
            if (writeAreaHeight <= Math.ceil(wlScrollPosition + rootHeight)) {
                setPage((prevPage) => prevPage + 1);
            }
        }
    }, [wlScrollPosition]);

    useEffect(() => {
        if (page <= totalPages) {
            dispatch(writeListPageData(page));
        }
    }, [page]);

    return (
        <div className='common_page'>
            <div className='content_area content_area_write'>
                <div className='write_list_scroll'>
                    <div className='write_list_wrap'>
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
                </div>
            </div>
        </div>
    )

    function WriteShowContents({ i, writeListArr }) {

        const [writeContent, setWriteContent] = useState(writeListArr[i]);

        const titleDoc = new DOMParser().parseFromString(writeContent.title, 'text/html');
        const subTitleDoc = new DOMParser().parseFromString(writeContent.subTitle, 'text/html');
        const contentDoc = new DOMParser().parseFromString(writeContent.content, 'text/html');
        const keywordsParse = JSON.parse(writeListArr[i].keywords)
        const create_date = new Date(writeContent.created_at).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const writeNavi = async (e) => {
            e.preventDefault();
            const isTokenValid = await token_check(navigate);

            if (isTokenValid) {
                navigate(`/components/WriteCorrect/${writeListArr[i].id}`);
            }
        };

        const objClassName = '.WriteDiv';
        useScrollAnima(objClassName, wlScrollPosition, rootHeight);

        return (

            <div>
                {(isAuth === 0 || isAuth === 1) && (
                    <div className='write_btn'>
                        <Link className='icon-edit-alt' onClick={writeNavi}></Link>
                    </div>
                )}

                <div className='write_list'>
                    <div className="fake_div">
                        <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
                    </div>
                    <Link to={`/components/WriteView/${writeContent.id}`}></Link>
                    <div className='write_keyword'>
                        <ul className='write_keyword_list'>
                            {
                                keywordsParse.map((k, i) => (
                                    <li key={i}>
                                        <WriteKeyword writeListKeyword={k} />
                                    </li>
                                ))
                            }
                        </ul>

                        <b className='write_date'>{create_date}</b>

                    </div>
                </div>
            </div>
        )
    }

    function WriteKeyword({ writeListKeyword }) {
        return (
            <Link to={`/components/Category/${writeListKeyword}`}>#{writeListKeyword}</Link>
        );
    }
}

export default WriteList;