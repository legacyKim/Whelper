import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { MemoListInWrite, bookDataInWrite } from '../data/api.js';

function MemoInWrite({ memoInWriteBtn, setMemoInWriteBtn, setAnnoListBtn, setLinkListBtn }) {

    const dispatch = useDispatch();

    useEffect(() => {
        setMemoInWriteBtn(false);
    }, []);

    const memoInWriteBtnActive = () => {
        if (memoInWriteBtn === true) {
            setMemoInWriteBtn(false);
        } else {
            setMemoInWriteBtn(true);

            setAnnoListBtn(false);
            setLinkListBtn(false);
        }
    }

    const [memoListInWrite, setMemoListInWrite] = useState([]);
    const [bookListInWrite, setBookListInWrite] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await dispatch(bookDataInWrite());
            setBookListInWrite(result.payload.book);
        };
        fetchData();
    }, []);

    const memoSearchBtn = async (e) => {

        const selectedValue = e.target.value;

        const result = await dispatch(MemoListInWrite({ selectedValue }));
        setMemoListInWrite(result.payload.memo);
    }

    const area = document.querySelector('.memo_in_write');
    const [listWidth, setListWidth] = useState(266);

    let x = 0;

    const mouseDownHandler = function (e) {

        x = e.clientX;

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {

        const dx = e.clientX - x;
        const newMemoListWidth = listWidth - dx;

        area.style.minWidth = `${newMemoListWidth}px`;
        area.style.maxWidth = `${newMemoListWidth}px`;
        area.style.right = `-${newMemoListWidth}px`;
    };

    const mouseUpHandler = function () {
        setListWidth(area.getBoundingClientRect().width);
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    return (

        <div className={`memo_in_write ${memoInWriteBtn === true ? 'active' : ''}`}>

            <button className="memo_in_write_btn" onClick={memoInWriteBtnActive}>
                <i className='icon-comment'></i>
            </button>

            {memoInWriteBtn === true && (
                <button className="memo_in_write_wide" onMouseDown={mouseDownHandler}>
                    <i className='icon-resize-horizontal'></i>
                </button>
            )}

            <div className="memolist_in_write_box">

                <select className='bookList_in_write' onChange={memoSearchBtn}>
                    {
                        bookListInWrite.map(function (a, i) {
                            return (
                                <option key={i} value={bookListInWrite[i].memoSource}>
                                    {bookListInWrite[i].memoSource}
                                </option>
                            )
                        })
                    }
                </select>

                <ul className='memolist_in_write_result scroll'>
                    {
                        memoListInWrite.map(function (a, i) {
                            return (
                                <li key={i}>
                                    <span>
                                        {memoListInWrite[i].memoComment}
                                    </span>
                                    <ol className='memolist_in_write_anno'>
                                        {
                                            memoListInWrite[i].memoAnnotation.map(function (n, j) {
                                                return (
                                                    <li key={j}>
                                                        <p>{memoListInWrite[i].memoAnnotation[j]}</p>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ol>
                                    {memoListInWrite[i].memoSourcePage && (
                                        <b>- {memoListInWrite[i].memoSourcePage}p</b>
                                    )}

                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div >

    )
}

export default MemoInWrite;