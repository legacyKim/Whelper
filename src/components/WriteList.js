import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux"
import { writeListData } from '../data/api.js';

import MyContext from '../context'
import ViewEdit from './SlateView.js'

import { token_check } from '../data/token_check.js'

function WriteList() {

    const { isAuth, scrollPosition } = useContext(MyContext);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [page, setPage] = useState(1);

    console.log(page);

    useEffect(() => {
        dispatch(writeListData(page));
    }, [dispatch]);

    const writeListState = useSelector((state) => state.WriteData);
    const writeListArr = writeListState.data.write.filter(item => item !== null) || [];

    const [writeArr, setWriteArr] = useState(writeListArr);

    useEffect(() => {
        dispatch(writeListData(page));
    }, [dispatch, page]);

    useEffect(() => {
        if (scrollPosition + document.getElementById('root').offsetHeight === document.querySelector('.content_area_write').offsetHeight) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [scrollPosition]);

    useEffect(() => {
        dispatch(writeListData(page)).then(() => {
            setWriteArr((prevWriteArr) => [...prevWriteArr, ...writeListArr]);
        });
    }, [page, dispatch]);

    // 커밋 테스트

    return (
        <div className='common_page'>
            <div className='content_area content_area_write'>
                <div className='write_list_scroll'>
                    <div className='write_list_wrap'>
                        {
                            writeArr.map(function (a, i) {
                                return (
                                    <div key={i} className="WriteDiv">
                                        <WriteShowContents i={i} writeListArr={writeArr} />
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