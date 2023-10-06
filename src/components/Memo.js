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

    // about memoDetail ShowHide
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
    //// about memoDetail ShowHide

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

    const delMemoList = (i) => {
        dispatch(memoListDataDelete({ id: memo[i].id }))
    }

    useEffect(() => {
        newMemoComment.current.value = null;
        newMemoKeyword.current.value = null;
        newMemoOwner.current.value = null;
        newMemoSource.current.value = null;
    }, [memoListState]);

    return (

        <div className='common_page'>
            <div className='content_area'>

                <div className='memo_btn'>
                    <button onClick={MemoSaveBtn} className='icon-ok-circled'></button>
                </div>

                <div className='memo_add'>
                    <textarea className='scroll' placeholder='newMemoComment' ref={newMemoComment}></textarea>
                    <div className='memo_input'>
                        <input type='text' placeholder='newMemoKeyword' ref={newMemoKeyword}></input>
                        <input type='text' placeholder='newMemoOwner' ref={newMemoOwner}></input>
                        <input type='text' placeholder='newMemoSource' ref={newMemoSource}></input>
                    </div>
                </div>

                <div className='memo_wrap'>

                    {
                        memo.map(function (a, i) {
                            return (
                                <div className='memo_content' key={i}>
                                    <div className='memoList_btn'>
                                        <button className='icon-edit-alt' onClick={() => memoCorrectOn(i)}></button>
                                        <button className='icon-trash' onClick={() => delMemoList(i)}></button>
                                    </div>
                                    <p className='font_text' onClick={() => memoDetailOn(i)}>{memo[i].memoComment}</p>
                                </div>
                            )
                        })
                    }

                    {/* memoDetail */}
                    <div className={`memoDetail_content ${memoActive ? memoActive : ""}`}>
                        {selectedMemoIndex !== null && <MemoView memo={memoListState[selectedMemoIndex]} />}
                        <button className='w_color icon-cancel' onClick={memoDetailClose}></button>
                    </div>
                    {/* memoDetail */}

                    {/* memoCorrect */}
                    <div className={`memoDetail_content ${memoCorrectActive ? memoCorrectActive : ""}`}>
                        {memoCorrectIndex !== null && <MemoCorrect memo={memoListState[memoCorrectIndex]} />}
                        <button className='w_color icon-cancel' onClick={memoCorrectClose}></button>
                    </div>
                    {/* memoCorrect */}

                </div>
            </div>
        </div>

    )

    function MemoView({ memo }) {

        return (
            <div className='memoDetail_content_pos'>
                <title className='font_text color_w'>{memo.memoComment}</title>
                <span className='font_text color_w'>{memo.memoSource}</span>
                <span className='font_text color_w'>{memo.memoOwner}</span>
                <span className='font_text color_w'>{memo.memoKeyword}</span>
            </div>
        )

    }

    function MemoCorrect({ memo }) {

        const dispatch = useDispatch();
        var correctMemoKeyword = useRef(null);
        var correctMemoOwner = useRef(null);
        var correctMemoSource = useRef(null);
        var correctMemoComment = useRef(null);

        const memoCorrectBtn = () => {
            const memoId = memo.id;
            const memoKeyword = correctMemoKeyword.current.value;
            const memoOwner = correctMemoOwner.current.value;
            const memoSource = correctMemoSource.current.value;
            const memoComment = correctMemoComment.current.value;

            dispatch(memoListDataUpdate({memoId, memoComment, memoKeyword, memoOwner, memoSource }));
        };

        return (
            <div className='memoCorrect_content_pos'>
                <input type="text" placeholder="correctMemoKeyword" className="write_title" defaultValue={memo.memoKeyword} ref={correctMemoKeyword}></input>
                <input type="text" placeholder="correctMemoOwner" className="write_subtitle" defaultValue={memo.memoOwner} ref={correctMemoOwner}></input>
                <input type="text" placeholder="correctMemoSource" className="write_subtitle" defaultValue={memo.memoSource} ref={correctMemoSource}></input>
                <textarea type="text" placeholder="correctMemoComment" className="write_textarea" defaultValue={memo.memoComment} ref={correctMemoComment}></textarea>
                <div className='page_btn'>
                    <button className='icon-ok-circled write_btn_save' onClick={() => memoCorrectBtn}></button>
                </div>

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