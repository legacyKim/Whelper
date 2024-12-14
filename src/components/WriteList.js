import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import { syncWriteListPageData, syncWriteListDelete } from '../data/reducers.js'
import { writeListPageData } from '../data/api.js';

import { debounce } from 'lodash';

import MyContext from '../context';
import ViewEdit from './ViewEdit.js';

import writeNavi from './hook/writeNavi.js';
import useScrollAnima from './hook/useScrollAnima.js';

import Gotop from './func/Gotop.js';
import Lock from './func/Lock.js';

function WriteList() {

    const { isAuth, rootHeight, wlScrollPosition, setWlScrollPosition, writeListCheckPwCorr, setWriteListCheckPwCorr } = useContext(MyContext);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(syncWriteListPageData());

        dispatch(writeListPageData(page)).then(() => {
            setTotalPages(writeListState.data.totalPages)
        });
    }, [dispatch]);

    const [page, setPage] = useState(1);

    const writeListState = useSelector((state) => state.WriteListPageDataOn);
    const writeListArr = writeListState.data.write || [];

    const [totalPages, setTotalPages] = useState(writeListState.data.totalPages);

    const updateScroll = useCallback(
        debounce(() => {
            setWlScrollPosition(window.scrollY || document.documentElement.scrollTop);
        }, 100),
        []
    );

    useEffect(() => {
        window.addEventListener('scroll', updateScroll);
        return () => {
            window.removeEventListener('scroll', updateScroll);
        };
    }, []);

    const contentAreaRef = useRef(null);

    useEffect(() => {
        if (totalPages === null) {
            dispatch(writeListPageData({ page: 1 })).then((response) => {
                setTotalPages(response.payload.totalPages);
            });
        }
    }, [totalPages, dispatch]);

    useEffect(() => {
        const writeAreaHeight = contentAreaRef.current.offsetHeight;

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
            <div className='content_area content_area_write' ref={contentAreaRef}>
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

                <Gotop></Gotop>

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

        const write_password = writeContent.password;
        const writeContentId = writeContent.id;

        const writePath = `/components/WriteCorrect/${writeContentId}`;
        const objClassName = '.WriteDiv';
        useScrollAnima(objClassName, wlScrollPosition, rootHeight);

        // lock pop
        const [writeListCheckPop, setWriteListCheckPop] = useState(false);
        //// lock pop

        return (

            <div>
                {(isAuth === 0 || isAuth === 1) && (
                    <div className='write_btn' onClick={(e) => {
                        if (write_password === null) {
                            writeNavi(e, writePath, navigate, isAuth);
                        } else {
                            setWriteListCheckPwCorr(true);
                            setWriteListCheckPop(true);
                        }
                    }}>
                        <i className="icon-edit-alt"></i>
                    </div>
                )}

                <div className='write_list'>
                    <div className="fake_div">
                        <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
                        {write_password != null && write_password !== '' && (
                            <i className="lock icon-lock-1"></i>
                        )}
                    </div>

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

                    <Lock isAuth={isAuth} write_password={write_password} writeContentId={writeContentId} writeListCheckPwCorr={writeListCheckPwCorr} writeNavi={writeNavi} writePath={writePath} writeListCheckPop={writeListCheckPop} setWriteListCheckPop={setWriteListCheckPop}></Lock>

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