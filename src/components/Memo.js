import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux"

import '../css/style.css';
import { memoListDataAdd, memoListDataDelete, memoListDataUpdate, bookListDataAdd } from "../store.js"

function Memo() {

    let memoListState = useSelector((state) => state.memoData);
    let bookListState = useSelector((state) => state.bookData);

    // book Add
    const [isBookAdd, setIsBookAdd] = useState(false);
    const [bookAddActive, setBookAddActive] = useState('');

    const bookAddOn = () => {
        if (!isBookAdd) {
            setBookAddActive('active');
            setMemoAddActive('');
        } else {
            setBookAddActive('');
        }
    };

    const bookAddClose = () => {
        setTimeout(() => {
            setIsBookAdd(false);
        }, 300);

        setBookAddActive('');
    };

    useEffect(() => {
        if (bookAddActive) {
            setBookAddActive('active');
            setMemoAddActive('');
        } else {
            setBookAddActive('');
        }
    }, [bookAddActive]);

    // about memoAdd showHide
    const [isMemoAdd, setIsMemoAdd] = useState(false);
    const [memoAddActive, setMemoAddActive] = useState('');

    const memoAddOn = () => {
        if (!isMemoAdd) {
            setMemoAddActive('active');
            setBookAddActive('');
        } else {
            setMemoAddActive('');
        }
    };

    const memoAddClose = () => {
        setTimeout(() => {
            setIsMemoAdd(false);
        }, 300);

        setMemoAddActive('');
    };

    useEffect(() => {
        if (memoAddActive) {
            setMemoAddActive('active');
        } else {
            setMemoAddActive('');
        }
    }, [memoAddActive]);
    //// about memoAdd Showhide

    // about memoDetail ShowHide
    const [isMemoDetail, setIsMemoDetail] = useState(false);
    const [memoActive, setMemoActive] = useState('');
    const [selectedMemoIndex, setSelectedMemoIndex] = useState(null);

    const memoDetailOn = (a) => {
        setSelectedMemoIndex(a.id);
        if (!isMemoDetail) {
            setMemoActive('active');
        } else {
            setMemoActive('');
        }
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

    const memoCorrectOn = (a) => {
        setMemoCorrectIndex(a.id);
        if (!isMemoCorrect) {
            setMemoCorrectActive('active');
        } else {
            setMemoCorrectActive('');
        }
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

    // book list
    const [isBookList, setIsBookList] = useState(false);
    const [bookListActive, setBookListActive] = useState('');
    const [bookListChange, setBookListChange] = useState(null);

    const bookListOn = (i) => {
        setIsBookList(!isBookList);
        if (!isBookList) {
            setBookListActive('active');
        } else {
            setBookListActive('');
        }
    };

    const bookListClose = () => {
        setTimeout(() => {
            setIsBookList(false);
        }, 300);
        setBookListActive('');
    };

    useEffect(() => {
        if (bookListActive) {
            setBookListActive('active');
        } else {
            setBookListActive('');
        }
    }, [bookListActive]);
    //// book list

    // memo save
    const [memo, setMemo] = useState(memoListState);

    const dispatch = useDispatch();
    var newMemoSource = useRef(null);
    var newMemoComment = useRef(null);

    const MemoSaveBtn = () => {
        const id = memoListState.length;
        const memoComment = newMemoComment.current.value;
        var memoSource = newMemoSource.current.value;

        dispatch(memoListDataAdd({ id, memoComment, memoSource }));
        setMemo((prevMemo) => [...prevMemo, { id, memoComment, memoSource }]);

    };

    // book save
    var newBook = useRef(null);

    const bookSaveBtn = () => {
        const bookName = newBook.current.value;
        dispatch(memoListDataAdd)
    }

    // const delMemoList = (i) => {
    //     dispatch(memoListDataDelete({ id: memo[i].id }))
    // }

    // memo correct btn
    var correctMemoSource = useRef();
    var correctMemoComment = useRef();

    const memoCorrectBtn = (a) => {

        const memoId = a.id;
        const updateMemoSource = correctMemoSource.current.value;
        const updateMemoComment = correctMemoComment.current.value;

        dispatch(memoListDataUpdate({ memoId, updateMemoSource, updateMemoComment }));
        setMemoCorrectActive('');
    };
    //// memo correct btn

    // memo reset
    useEffect(() => {
        newMemoComment.current.value = null;
        newMemoSource.current.value = null;

        if (bookLocalStorage === null) {
            setBookTitle("전체")
            setMemoArr(memoListState)
        } else {
            setMemoArr(memoListState.filter((item) => item.memoSource === bookTitle));
        }
    }, [memoListState])
    //// memo reset

    // book name check
    const bookLocalStorage = localStorage.getItem('bookTitle');
    const [bookTitle, setBookTitle] = useState(bookLocalStorage);

    const bookChange = (i) => {

        setSelectedMemoIndex(null)
        setMemoCorrectIndex(null)

        if (i === undefined) {
            setBookTitle("전체")
            localStorage.removeItem('bookTitle');
        } else {
            setBookTitle(bookListState[i])
            localStorage.setItem('bookTitle', bookListState[i]);
        }
    }

    const [memoArr, setMemoArr] = useState(memoListState);

    useEffect(() => {
        if (bookLocalStorage === null) {
            setBookTitle("전체")
            setMemoArr(memoListState)
        } else {
            setMemoArr(memoListState.filter((item) => item.memoSource === bookTitle));
        }
    }, [bookTitle])
    //// book name check

    // memoArr effect

    const [memoArrActive, setMemoArrActive] = useState('active');

    useEffect(()=>{
        setMemoArrActive('');
        setTimeout(()=>{
            setMemoArrActive('active');
        }, 300)
    }, [bookTitle])

    return (

        <div className='common_page'>
            <div className='content_area reverse'>
                <div className='book_list_pos'>
                    <div className='book_list'>
                        <div className='book_list_current'>
                            <i className='icon-pin'></i><strong onClick={bookListOn}>{bookTitle}</strong>
                        </div>
                        <div className={`book_list_box ${bookListActive ? bookListActive : ''}`}>
                            <ul className='scroll'>
                                <li>
                                    <span className='all' onClick={() => {
                                        bookListClose();
                                        bookChange();   
                                    }}>전체</span>
                                </li>
                                {
                                    bookListState.map(function (k, i) {
                                        return (
                                            <li key={i}>
                                                <span className='' onClick={() => {
                                                    bookListClose();
                                                    bookChange(i);
                                                }}>{bookListState[i]}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className='memo_btn'>
                        <button onClick={memoAddOn} className='icon-pencil-alt'></button>
                        <button onClick={bookAddOn} className='icon-book'></button>
                    </div>
                </div>

                <div className='memo_wrap reverse'>

                    {
                        memoArr.map(function (a, i) {
                            return (
                                <div className={`memo_content ${memoArr !== null ? memoArrActive : "" }`} key={i}>
                                    <div className='memoList_btn'>
                                        <button className='icon-edit-alt' onClick={() => memoCorrectOn(a)}></button>
                                        {/* <button className='icon-trash' onClick={() => delMemoList(i)}></button> */}
                                    </div>
                                    <div className='memo_content_box'>
                                        <p className='font_text' onClick={() => memoDetailOn(a)}>{memoArr[i].memoComment}</p>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>

                {/* memoDetail */}
                <div className={`memoDetail_content ${memoActive ? memoActive : ""}`}>
                    {selectedMemoIndex !== null && <MemoView memo={memoArr[selectedMemoIndex]} />}
                    <div className='memoDetail_btn'>
                        <button className='icon-edit-alt'
                            onClick={() => {
                                memoCorrectOn(memoArr[selectedMemoIndex]);
                                memoDetailClose();
                            }}></button>
                        <button className='icon-cancel' onClick={memoDetailClose}></button>
                    </div>
                </div>
                {/* memoDetail */}

                {/* memoCorrect */}
                <div className={`memoDetail_content ${memoCorrectActive ? memoCorrectActive : ""}`}>
                    {memoCorrectIndex !== null && <MemoCorrect memo={memoArr[memoCorrectIndex]} />}
                    <div className='memoDetail_btn'>
                        <button className='icon-clipboard'
                            onClick={() => {
                                memoDetailOn(memoArr[memoCorrectIndex]);
                                memoCorrectClose();
                            }}></button>
                        <button className='icon-cancel' onClick={memoCorrectClose}></button>
                    </div>
                    <div className='page_btn'>
                        <button className='icon-ok-circled' onClick={() => memoCorrectBtn(memoArr[memoCorrectIndex])}></button>
                    </div>
                </div>
                {/* memoCorrect */}

                {/* book add */}
                <div className={`book_add memo_add ${bookAddActive ? bookAddActive : ""}`}>
                    <div className='memo_input'>
                        <input type='text' placeholder='newBook' ref={newBook}></input>
                    </div>
                    <div className='memo_btn flex-end'>
                        <button className='icon-ok' onClick={bookSaveBtn}></button>
                        <button className='icon-cancel' onClick={bookAddClose}></button>
                    </div>
                </div>
                {/* bookadd */}

                {/* memoAdd */}
                <div className={`memo_add ${memoAddActive ? memoAddActive : ""}`}>
                    <textarea className='scroll' placeholder='newMemoComment' ref={newMemoComment}></textarea>
                    <div className='memo_input'>
                        <input type='text' placeholder='newMemoSource' ref={newMemoSource}></input>
                    </div>
                    <div className='memo_btn flex-end'>
                        <button className='icon-ok' onClick={MemoSaveBtn}></button>
                        <button className='icon-cancel' onClick={memoAddClose}></button>
                    </div>
                </div>
                {/* memoAdd */}

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