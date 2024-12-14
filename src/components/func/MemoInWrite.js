import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { MemoListInWrite, bookDataInWrite } from '../../data/api.js';

function MemoInWrite({ memoInWriteBtn, setMemoInWriteBtn, setAnnoListBtn, setLinkListBtn, setMemoText, setMemoCopyActiveOn }) {

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

    // memo Copy btn
    const [memoCopyBtnActive, setMemoCopyBtnActive] = useState(false);
    var memoTextContent;

    const memoCopyBtn = (e) => {
        e.preventDefault();
        if (e._reactName === 'onContextMenu' && e.target.classList.contains('memolist_in_write_content') || e.target.classList.contains('memolist_in_write_anno_content')) {

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const memoInWrite = document.querySelector('.memo_in_write');
            const btnPos = document.querySelector('.btn_wrap_pos_memo');

            if (btnPos && memoInWrite) {
                const parentRect = memoInWrite.getBoundingClientRect();

                const relativeX = mouseX - parentRect.left;
                const relativeY = mouseY - parentRect.top;

                btnPos.style.top = relativeY - 10 + 'px';
                btnPos.style.left = relativeX - 10 + 'px';
            }

            memoTextContent = e.target.innerHTML;
            setMemoText(memoTextContent);

            setMemoCopyBtnActive(true);

        }
    };

    const memoCopyActiveBtn = () => {
        setMemoCopyActiveOn(true);
    }

    return (

        <div className={`memo_in_write ${memoInWriteBtn === true ? 'active' : ''}`} onClick={() => { setMemoCopyBtnActive(false) }}>

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

                <ul className='memolist_in_write_result scroll' onContextMenu={memoCopyBtn}>
                    {
                        memoListInWrite.map(function (a, i) {
                            return (
                                <li key={i} className="">
                                    <span className="memolist_in_write_content">
                                        {memoListInWrite[i].memoComment}
                                    </span>
                                    <ol className='memolist_in_write_anno'>
                                        {
                                            memoListInWrite[i].memoAnnotation.map(function (n, j) {
                                                return (
                                                    <li key={j}>
                                                        <p className='memolist_in_write_anno_content'>{memoListInWrite[i].memoAnnotation[j]}</p>
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

                <div className='btn_wrap_pos_memo'>
                    <div className={`btn_list ${memoCopyBtnActive === true ? 'active' : ''} `}>

                        <div className="btn_wrap">
                            <button className="icon-popup" onClick={memoCopyActiveBtn}></button>
                        </div>

                    </div>
                </div>
            </div>
        </div >

    )
}

export default MemoInWrite;