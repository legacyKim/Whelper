import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux"

import '../css/style.css';
import { memoListDataAdd, memoListDataDelete, memoListDataUpdate } from "../store.js"

function Memo() {

    let memoListState = useSelector((state) => state.memoData);

    // about memoDetail ShowHide
    const [isMemoDetail, setIsMemoDetail] = useState(false);
    const [memoActive, setMemoActive] = useState('');
    const [selectedMemoIndex, setSelectedMemoIndex] = useState(null);

    const memoDetailOn = (i) => {
        setSelectedMemoIndex(!isMemoDetail);
        if (!isMemoDetail) {
            setMemoActive('active');
        } else {
            setMemoActive('');
        }
        setSelectedMemoIndex(i);
    };

    const memoDetailClose = () => {
        setTimeout(() => {
            setIsMemoDetail(false);
        }, 300);

        setMemoActive('');
    };

    useEffect(() => {
        if (memoActive) {
            setMemoActive('active');
        } else {
            setMemoActive('');
        }
    }, [memoActive]);
    //// about memoDetail ShowHide

    // about memoCorrect ShowHide
    const [isMemoCorrect, setIsMemoCorrect] = useState(false);
    const [memoCorrectActive, setMemoCorrectActive] = useState('');
    const [memoCorrectIndex, setMemoCorrectIndex] = useState(null);

    const memoCorrectOn = (i) => {
        setMemoCorrectIndex(!isMemoDetail);
        if (!isMemoCorrect) {
            setMemoCorrectActive('active');
        } else {
            setMemoCorrectActive('');
        }
        setMemoCorrectIndex(i);
    };

    const memoCorrectClose = () => {
        setTimeout(() => {
            setIsMemoCorrect(false);
        }, 300);

        setMemoCorrectActive('');
    };

    useEffect(() => {
        if (memoCorrectActive) {
            setMemoCorrectActive('active');
        } else {
            setMemoCorrectActive('');
        }
    }, [memoCorrectActive]);
    //// about memoCorrect ShowHide

    const [memo, setMemo] = useState(memoListState);

    const dispatch = useDispatch();
    var newMemoKeyword = useRef(null);
    var newMemoOwner = useRef(null);
    var newMemoSource = useRef(null);
    var newMemoComment = useRef(null);

    const MemoSaveBtn = () => {
        const id = memoListState.length;
        const memoComment = newMemoComment.current.value;
        const memoKeyword = newMemoKeyword.current.value;
        const memoOwner = newMemoOwner.current.value;
        const memoSource = newMemoSource.current.value;

        dispatch(memoListDataAdd({ id, memoComment, memoKeyword, memoOwner, memoSource }));
        setMemo((prevMemo) => [...prevMemo, { id, memoComment, memoKeyword, memoOwner, memoSource }]);

    };

    // const delMemoList = (i) => {
    //     dispatch(memoListDataDelete({ id: memo[i].id }))
    // }

    // memo correct btn
    var correctMemoKeyword = useRef();
    var correctMemoOwner = useRef();
    var correctMemoSource = useRef();
    var correctMemoComment = useRef();

    const memoCorrectBtn = (memoCorrectIndex) => {
        const memoId = memoCorrectIndex;
        const updateMemoKeyword = correctMemoKeyword.current.value;
        const updateMemoOwner = correctMemoOwner.current.value;
        const updateMemoSource = correctMemoSource.current.value;
        const updateMemoComment = correctMemoComment.current.value;

        dispatch(memoListDataUpdate({ memoId, updateMemoKeyword, updateMemoOwner, updateMemoSource, updateMemoComment }));
        setMemoCorrectActive('');
    };
    // memo correct btn

    useEffect(() => {
        newMemoComment.current.value = null;
        newMemoKeyword.current.value = null;
        newMemoOwner.current.value = null;
        newMemoSource.current.value = null;

        setMemo(memoListState);
    }, [memoListState])

    return (

        <div className='common_page'>
            <div className='content_area reverse'>

                <div className='memo_btn'>
                    <button onClick={MemoSaveBtn} className='icon-ok-circled'></button>
                </div>

                <div className='memo_add'>
                    <div className='memo_input'>
                        <input type='text' placeholder='newMemoSource' ref={newMemoSource}></input>
                        <input type='text' placeholder='newMemoOwner' ref={newMemoOwner}></input>
                        <input type='text' placeholder='newMemoKeyword' ref={newMemoKeyword}></input>
                    </div>
                    <textarea className='scroll' placeholder='newMemoComment' ref={newMemoComment}></textarea>
                </div>

                <div className='memo_wrap'>

                    {
                        memo.map(function (a, i) {
                            return (
                                <div className='memo_content' key={i}>
                                    <div className='memoList_btn'>
                                        <button className='icon-edit-alt' onClick={() => memoCorrectOn(i)}></button>
                                        {/* <button className='icon-trash' onClick={() => delMemoList(i)}></button> */}
                                    </div>
                                    <div className='memo_content_box'>
                                        <p className='font_text' onClick={() => memoDetailOn(i)}>{memo[i].memoComment}</p>
                                    </div>
                                </div>
                            )
                        })
                    }

                    {/* memoDetail */}
                    <div className={`memoDetail_content ${memoActive ? memoActive : ""}`}>
                        {selectedMemoIndex !== null && <MemoView memo={memoListState[selectedMemoIndex]} />}
                        <div className='memoDetail_btn'>
                            <button className='icon-edit-alt'
                                onClick={() => {
                                    memoCorrectOn(selectedMemoIndex);
                                    memoDetailClose();
                                }}></button>
                            <button className='icon-cancel' onClick={memoDetailClose}></button>
                        </div>
                    </div>
                    {/* memoDetail */}

                    {/* memoCorrect */}
                    <div className={`memoDetail_content ${memoCorrectActive ? memoCorrectActive : ""}`}>
                        {memoCorrectIndex !== null && <MemoCorrect memo={memoListState[memoCorrectIndex]} />}
                        <div className='memoDetail_btn'>
                            <button className='icon-clipboard'
                                onClick={() => {
                                    memoDetailOn(memoCorrectIndex);
                                    memoCorrectClose();
                                }}></button>
                            <button className='icon-cancel' onClick={memoCorrectClose}></button>
                        </div>
                        <div className='page_btn'>
                            <button className='icon-ok-circled' onClick={() => memoCorrectBtn(memoCorrectIndex)}></button>
                        </div>
                    </div>
                    {/* memoCorrect */}

                </div>
            </div>
        </div >

    )

    function MemoView({ memo }) {

        return (
            <div className='memoDetail_content_pos'>
                <ul className='memoDetail_content_info'>
                    <li>
                        <strong>출처</strong>
                        <span className='font_text color_w'>{memo.memoSource}</span>
                    </li>
                    <li>
                        <strong>저자</strong>
                        <span className='font_text color_w'>{memo.memoOwner}</span>
                    </li>
                    <li>
                        <strong>키워드</strong>
                        <span className='font_text color_w'>{memo.memoKeyword}</span>
                    </li>
                </ul>
                <div className='scroll'>
                    <p className='font_text color_w'>{memo.memoComment}</p>
                </div>
            </div>
        )

    }

    function MemoCorrect({ memo }) {

        return (
            <div className="memoCorrect_content_pos">
                <ul className='memoCorrect_info'>
                    <li>
                        <strong>출처</strong>
                        <input type="text" placeholder="correctMemoSource" className="memo_source" defaultValue={memo.memoSource} ref={correctMemoSource}></input>
                    </li>
                    <li>
                        <strong>저자</strong>
                        <input type="text" placeholder="correctMemoOwner" className="memo_owner" defaultValue={memo.memoOwner} ref={correctMemoOwner}></input>
                    </li>
                    <li>
                        <strong>키워드</strong>
                        <input type="text" placeholder="correctMemoKeyword" className="memo_keyword" defaultValue={memo.memoKeyword} ref={correctMemoKeyword}></input>
                    </li>
                </ul>
                <textarea type="text" plsaceholder="correctMemoComment" className="memo_comment scroll" defaultValue={memo.memoComment} ref={correctMemoComment}></textarea>
            </div>
        )
    }

}

export default Memo;

// const memoSubmit = async (event) => {

//     try {
//         const response = await axios.post('http://localhost:3000/api/Memo', { memo: newMemo });
//         setMemo([...props, response.data]);
//         setNewMemo('');
//     } catch (err) {
//         console.error(err);
//     }
// }

// const memoDelete = async (a) => {

//     try {
//         const response = await axios.delete(`http://localhost:3000/api/Memo`, { data: { memo: a.memo } });
//         const updatedMemoList = props.MainMemoData.filter(memo => memo.memo !== a.memo);
//         setMemo(updatedMemoList);
//     } catch (err) {
//         console.error(err);
//     }
// }