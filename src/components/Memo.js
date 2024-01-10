import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux"
import MyContext from '../context'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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

    // memo correct, detail common state
    const [memoCurrent, setMemoCurrent] = useState(null);

    const memoDetailOn = (a) => {

        setMemoCurrent(a);
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

    const memoCorrectOn = (a) => {

        setMemoCurrent(a);
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
        } else if (bookListActive === 'none') {
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

    // booklist box click default
    useEffect(() => {
        if (bookListActive !== 'active') {
            setTimeout(() => {
                setBookListActive('none');
            }, 100);
        }

    }, [bookListActive])
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

        if (i === undefined) {
            setBookTitle("전체")
            localStorage.removeItem('bookTitle');
        } else {
            setBookTitle(bookListState[i])
            localStorage.setItem('bookTitle', bookListState[i]);
        }
    }

    const [memoArr, setMemoArr] = useState(memoListState);
    const [memoArrActive, setMemoArrActive] = useState('active');

    useEffect(() => {
        if (bookLocalStorage === null) {
            setBookTitle("전체")
            setMemoArr(memoListState)
        } else {
            setMemoArr(memoListState.filter((item) => item.memoSource === bookTitle));
        }

    }, [bookTitle])
    //// book name check

    // context api scroll pos
    const { scrollPosition, setScrollPosition } = useContext(MyContext);

    return (

        <div className='common_page'>
            <div className='content_area reverse'>
                <div className='book_list_pos'>
                    <div className='book_list'>
                        <div className={`book_list_current ${scrollPosition > 0 ? "scroll_event" : ""}`} onClick={bookListOn}>
                            <i className='icon-pin'></i><strong>{bookTitle}</strong>
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
                    <div className={`memo_btn ${scrollPosition > 0 ? "scroll_event" : ""}`}>
                        <button onClick={memoAddOn} className='icon-pencil-alt'></button>
                        <button onClick={bookAddOn} className='icon-book'></button>
                    </div>
                </div>

                <div className={`memo_wrap reverse`}>
                    <TransitionGroup>
                        {
                            memoArr.map(function (a, i) {
                                return (
                                    <CSSTransition timeout={300} classNames="memo" key={i}>
                                        <div className='memo_content'>
                                            <div className='memoList_btn'>
                                                <button className='icon-edit-alt' onClick={() => memoCorrectOn(a)}></button>
                                                {/* <button className='icon-trash' onClick={() => delMemoList(i)}></button> */}
                                            </div>
                                            <div className='memo_content_box'>
                                                <p className='font_text' onClick={() => memoDetailOn(a)}>{memoArr[i].memoComment}</p>
                                                <button>{memoArr[i].memoSource}</button>
                                            </div>
                                        </div>
                                    </CSSTransition>
                                )
                            })
                        }
                    </TransitionGroup>

                </div>

                {/* memoDetail */}
                <div className={`memoDetail_content ${memoActive ? memoActive : ""}`}>
                    {memoCurrent !== null && <MemoView memo={memoCurrent} />}
                    <div className='memoDetail_btn'>
                        <button className='icon-edit-alt'
                            onClick={() => {
                                memoCorrectOn(memoCurrent);
                                memoDetailClose();
                            }}></button>
                        <button className='icon-cancel' onClick={memoDetailClose}></button>
                    </div>
                </div>
                {/* memoDetail */}

                {/* memoCorrect */}
                <div className={`memoDetail_content ${memoCorrectActive ? memoCorrectActive : ""}`}>
                    {memoCurrent !== null && <MemoCorrect memo={memoCurrent} />}
                    <div className='memoDetail_btn'>
                        <button className='icon-clipboard'
                            onClick={() => {
                                memoDetailOn(memoCurrent);
                                memoCorrectClose();
                            }}></button>
                        <button className='icon-cancel' onClick={memoCorrectClose}></button>
                    </div>
                    <div className='page_btn'>
                        <button className='icon-ok-circled' onClick={() => memoCorrectBtn(memoCurrent)}></button>
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