import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux"
import { writeListData } from '../data/api.js';
import ViewEdit from './SlateView.js'

import { token_check } from '../data/token_check.js'

function WriteList() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(writeListData());
    }, [dispatch]);

    const writeListState = useSelector((state) => state.WriteData);
    const writeListArr = writeListState.data.write.filter(item => item !== null) || [];

    const [writeArr, setWriteArr] = useState(writeListArr);
    const [writeReal, setWriteReal] = useState(writeArr);

    useEffect(()=>{
        setWriteArr(writeListArr)
    }, [writeListState])

    // infinite scroll
    var writeScrollArea = useRef();
    var writeScrollPos = useRef();
    var currentY = 0;
    var previousY = 0;
    var scrollAmount = 186.4;

    const whiteAreaCheck = () => {
        var scY = window.innerHeight;
        const writeScrollTop = writeScrollArea.current.getBoundingClientRect().top;
        var writeAreaHeight = (scY - writeScrollTop) / scrollAmount;
        writeScrollArea.current.style.height = Math.floor(writeAreaHeight) * scrollAmount + 'px';
    }

    const whiteScrollMove = (e) => {

        currentY = writeScrollArea.current.scrollTop;
        if (e.deltaY > 0) {
            currentY += scrollAmount;
        } else {
            currentY -= scrollAmount;
        }
        writeScrollArea.current.scrollTop = currentY;
        previousY = currentY;

        var scroll_num = Math.round(currentY / scrollAmount);

        if (0 <= scroll_num && scroll_num < writeArr.length - 5 && 5 < writeArr.length) {
            writeScrollPos.current.style.top = `${scrollAmount * scroll_num}px`

            var rows = [];
            for (let i = scroll_num; i < scroll_num + 6; i += 1) {
                if (writeArr[i] !== undefined) rows.push(writeArr[i])
            }

            setWriteReal(rows)

        }

    }

    useEffect(() => {
        whiteAreaCheck();

        const currentScrollArea = writeScrollArea.current;
        currentScrollArea.addEventListener('wheel', whiteScrollMove);

        var rows = [];
        for (let i = 0; i < 6; i += 1) {
            if (writeArr[i] !== undefined) rows.push(writeArr[i])
        }
        setWriteReal(rows)

        return () => {
            currentScrollArea.removeEventListener('wheel', whiteScrollMove);
        };
    }, [writeArr]);
    //// infinite scroll

    return (
        <div className='common_page'>
            <div className='content_area'>
                <div className='write_list_scroll' ref={writeScrollArea}>
                    <div className='write_list_wrap' ref={writeScrollPos}>
                        {
                            writeReal.map(function (a, i) {
                                return (
                                    <div key={i} className="WriteDiv">
                                        <WriteShowContents i={i} writeListArr={writeReal} />
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
                <div className='write_btn'>
                    <Link className='icon-edit-alt' onClick={writeNavi}></Link>
                </div>
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