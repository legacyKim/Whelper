import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import { writeListPageData } from '../data/api.js';

import MyContext from '../context';
import ViewEdit from './SlateView.js';

import { token_check } from '../data/token_check.js';

function WriteList() {

    const { isAuth, scrollPosition, rootHeight } = useContext(MyContext);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [page, setPage] = useState(1);

    const writeListState = useSelector((state) => state.WriteListPageDataOn);
    const writeListArr = writeListState.data.write || [];

    const [totalPages, setTotalPages] = useState(writeListState.data.totalPages);

    useEffect(() => {
        if (totalPages === null) {
            dispatch(writeListPageData(page)).then(() => {
                setTotalPages(writeListState.data.totalPages)
            });
        }
    }, [scrollPosition]);

    useEffect(() => {
        const writeAreaHeight = document.querySelector('.content_area_write').offsetHeight;
        if (page <= totalPages) {
            if (Math.round(scrollPosition + rootHeight) === writeAreaHeight) {
                setPage((prevPage) => prevPage + 1);
            }
        }
    }, [scrollPosition]);

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

        useEffect(() => {
            const WriteDiv = document.querySelectorAll('.WriteDiv');

            WriteDiv.forEach((ele, i) => {
                if (scrollPosition + rootHeight - ele.offsetHeight * 2 > ele.offsetTop - ele.offsetHeight) {
                    ele.classList.add("anima");
                } else {
                    ele.classList.remove("anima");
                }
            });
        }, [])

        return (

            <div>
                {isAuth === true && (
                    <div className='write_btn'>
                        <Link className='icon-edit-alt' onClick={writeNavi}></Link>
                    </div>
                )}

                <div className='write_list'>
                    <Link to={`/components/WriteView/${writeListArr[i].id}`}>
                        <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
                    </Link>
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