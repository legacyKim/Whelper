import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import { syncWriteListPageData, syncWriteListDelete } from '../data/reducers.js'
import { writeListPageData } from '../data/api.js';
import deserialize from './hook/deserialize.js';

import MyContext from '../context';
import ViewEdit from './ViewEdit.js';

import writeNavi from './hook/writeNavi.js';

import Gotop from './func/Gotop.js';
import Lock from './func/Lock.js';

import { FixedSizeList as List } from "react-window";

function WriteList() {

    const { isAuth, rootHeight, writeListCheckPwCorr, setWriteListCheckPwCorr } = useContext(MyContext);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(syncWriteListPageData());
        dispatch(writeListPageData());
    }, [dispatch]);

    const writeListState = useSelector((state) => state.WriteListPageDataOn);
    const writeListArr = writeListState.data.write || [];

    const WriteRow = ({ index, style, data }) => {
        const { writeListArr, isAuth } = data;

        return (
            <div className='write_list_box' style={style} key={index}>
                <WriteShowContents writeListArr={writeListArr[index]}></WriteShowContents>
            </div>
        );
    };

    const content_area_write = useRef(null);
    const [listHeight, setListHeight] = useState(0);

    let contentBoxHeight;

    if (isAuth === false) {
        contentBoxHeight = 225;
    } else {
        contentBoxHeight = 249;
    }

    useEffect(() => {
        if (content_area_write.current) {
            setListHeight(content_area_write.current.clientHeight);
        }

        const handleResize = () => {
            if (content_area_write.current) {
                setListHeight(content_area_write.current.clientHeight);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className='common_page'>
            <div className='content_area content_area_write' ref={content_area_write}>
                {content_area_write && writeListArr && (
                    <List className={`write_virtualize virtualize ${isAuth !== false ? 'auth' : ''}`}
                        height={listHeight}
                        itemCount={writeListArr.length}
                        itemSize={contentBoxHeight}
                        width="100%"
                        itemData={{ writeListArr, isAuth }}
                    >
                        {WriteRow}
                    </List>
                )}

                <Gotop></Gotop>

            </div>
        </div>
    )

    function WriteShowContents({ i, writeListArr }) {

        const [writeContent, setWriteContent] = useState(writeListArr);

        const titleDoc = writeContent.title;
        const subTitleDoc = writeContent.subTitle;
        const contentDoc = deserialize(new DOMParser().parseFromString(writeContent.content, 'text/html').body);
        const keywordsParse = JSON.parse(writeListArr.keywords)
        const create_date = new Date(writeContent.created_at).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const write_password = writeContent.password;
        const writeContentId = writeContent.id;

        const writeUsername = writeContent.username;
        const writeViews = writeContent.views;

        const writePath = `/components/WriteCorrect/${writeContentId}`;

        // lock pop
        const [writeListCheckPop, setWriteListCheckPop] = useState(false);
        //// lock pop

        return (
            <>
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

                    <Lock isAuth={isAuth} write_password={write_password} writeContentId={writeContentId} writeListCheckPwCorr={writeListCheckPwCorr} writeNavi={writeNavi} writePath={writePath} writeListCheckPop={writeListCheckPop} setWriteListCheckPop={setWriteListCheckPop}></Lock>

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
                        <div className='write_info'>
                            <b className='write_date'>{create_date}</b>
                            {writeUsername && (
                                <Link className="write_username" onClick={() => {
                                    alert("준비 중 입니다.")
                                }}>{writeUsername}</Link>
                            )}
                            {writeViews !== 0 && (
                                <div>
                                    <i className='icon-sight'></i>
                                    <b className="write_views">{writeViews}</b>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    function WriteKeyword({ writeListKeyword }) {
        return (
            <Link to={`/components/Category/${writeListKeyword}`}>#{writeListKeyword}</Link>
        );
    }
}

export default WriteList;