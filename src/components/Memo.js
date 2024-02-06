import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux"
import MyContext from '../context'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import '../css/style.css';
import { memoListDataAdd, memoListDataDelete, memoListDataUpdate, memoListAnno, memoListAnnoUpdate, memoListAnnoDelete, bookListDataAdd, bookListDelete } from "../store.js"

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

        var textArea = document.querySelectorAll('memo_anno_textarea');
        textArea.style.height = '22px';
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
    var newMemoAuthor = useRef(null);
    var newMemoComment = useRef(null);

    const MemoSaveBtn = () => {

        const id = memoListState.length;
        const memoComment = newMemoComment.current.value;
        var memoAuthor = newMemoAuthor.current.value;
        var memoSource = newMemoSource.current.value;
        var memoAnnotation = {};

        dispatch(memoListDataAdd({ id, memoComment, memoAuthor, memoSource, memoAnnotation }));
        setMemo((prevMemo) => [...prevMemo, { id, memoComment, memoAuthor, memoSource, memoAnnotation }]);

    };

    // book save
    var newBook = useRef(null);
    var newAuthor = useRef(null);

    const bookSaveBtn = () => {
        const book = newBook.current.value;
        const author = newAuthor.current.value;
        dispatch(bookListDataAdd({ book, author }))
    }

    const deleteBook = (e) => {
        e.stopPropagation();
        localStorage.removeItem('bookTitle');
        setBookTitle('전체');
        dispatch(bookListDelete({ book: bookTitle }))
    }

    // memo correct btn
    var correctMemoSource = useRef();
    var correctMemoAuthor = useRef();
    var correctMemoComment = useRef();

    const memoCorrectBtn = (a) => {

        const memoId = a.id;
        const updateMemoSource = correctMemoSource.current.value;
        const updateMemoAuthor = correctMemoAuthor.current.value;
        const updateMemoComment = correctMemoComment.current.value;

        dispatch(memoListDataUpdate({ memoId, updateMemoSource, updateMemoAuthor, updateMemoComment }));

        setMemoCorrectActive('');
        setMemoActive('active')
    };
    //// memo correct btn

    // memo reset
    const [memoRecord, setMemoRecord] = useState('active');

    const MemoRecordMode = () => {
        setMemoRecord(!memoRecord);
        if (!memoRecord) {
            setMemoRecord('active');
        } else {
            setMemoRecord('');
        }
    };

    useEffect(() => {
        newMemoComment.current.value = null;

        if (memoRecord !== 'active') {
            newMemoSource.current.value = null;
            newMemoAuthor.current.value = null;
        }

        if (bookLocalStorage === null) {
            setBookTitle("전체")
            setMemoArr(memoListState)
        } else {
            setMemoArr(memoListState.filter((item) => item.memoSource === bookTitle));
        }
    }, [memoListState]);

    useEffect(() => {
        newBook.current.value = null;
        newAuthor.current.value = null;
    }, [bookListState])
    //// memo reset

    // book name check
    const bookLocalStorage = localStorage.getItem('bookTitle');
    const [bookTitle, setBookTitle] = useState(bookLocalStorage);

    const bookChange = (i) => {
        if (i === undefined) {
            setBookTitle("전체")
            localStorage.removeItem('bookTitle');
        } else {
            setBookTitle(bookListState[i].book)
            setMemoCurrent(null);
            localStorage.setItem('bookTitle', bookListState[i].book);
        }
    }

    const [memoArr, setMemoArr] = useState(memoListState);
    const [memoArrActive, setMemoArrActive] = useState('active');

    useEffect(() => {
        if (bookLocalStorage === null) {
            setBookTitle("전체")
            setMemoCurrent(null);
            setMemoArr(memoListState);
        } else {
            setMemoCurrent(null);
            setMemoArr(memoListState.filter((item) => item.memoSource === bookTitle));
        }
        setMemoCurrent(null);
    }, [bookTitle])
    //// book name check

    // context api scroll pos
    const { scrollPosition, setScrollPosition } = useContext(MyContext);
    //// context api scroll pos

    const bookFilter = (i) => {
        localStorage.setItem('bookTitle', memoArr[i].memoSource);
        setBookTitle(memoArr[i].memoSource);
    }

    const refreshTitle = (e) => {
        e.stopPropagation();
        localStorage.removeItem('bookTitle');
        setBookTitle("전체")
    }

    // memo Annotation
    const [memoAnnoActive, setMemoAnnoActive] = useState();
    useEffect(() => {
        if (memoAnnoActive === 'active') {
            setMemoAnnoActive('active')
        } else {
            setMemoAnnoActive('')
        }
    }, [memoAnnoActive]);

    var newMemoAnno = useRef();

    // memo anno add
    const memoAnnoBtn = (memo) => {

        const memoId = memo.id;
        const memoAnno = newMemoAnno.current.value;

        const annotationKeys = Object.keys(memo.memoAnnotation);
        if (annotationKeys.length > 0) {
            var annoKey = Math.max(...annotationKeys.map(key => parseInt(key))) + 1;
        } else {
            var annoKey = 0;
        }

        const newKey = annoKey.toString();
        const memoAnnoIndex = newKey;

        dispatch(memoListAnno({ memoId, memoAnno, memoAnnoIndex }));
        setMemoAnnoActive('')

        var textArea = document.querySelectorAll('memo_anno_textarea');
        textArea.style.height = '22px';
    }

    // memo anno correct box open
    const [memoAnnoCorrText, setMemoAnnoCorrText] = useState();
    const [annoCorrectActive, setAnnoCorrectActive] = useState('');
    const [memoAnnoIndex, setMemoAnnoIndex] = useState();
    const memoAnnoCorrectBtn = (memo, i) => {
        if (annoCorrectActive !== 'active') {
            setAnnoCorrectActive('active');
        } else {
            setAnnoCorrectActive('');
        }
        setMemoAnnoCorrText(memo.memoAnnotation[i]); 
        setMemoAnnoIndex(i);
    }

    // memo anno correct complete
    const memoAnnoCorrComBtn = (memo, memoAnnoCorrProps) => {

        const corrMemoId = memo.id;
        const corrMemoAnno = memoAnnoCorrProps;
        const corrAnnotationKeys = memoAnnoIndex;

        dispatch(memoListAnnoUpdate({ corrMemoId, corrMemoAnno, corrAnnotationKeys }));
        setAnnoCorrectActive('');

    }

    // memo anno delete
    const memoAnnoDeleteBtn = (memo, i) => {
        const corrMemoId = memo.id;
        const corrAnnotationKeys = i;

        dispatch(memoListAnnoDelete({ corrMemoId, corrAnnotationKeys }));
    }
    //// memo Annotation

    // when add new one
    useEffect(() => {
        if (memoCurrent !== null) {
            setMemoCurrent(memoArr[memoCurrent.id]);
        }
    }, [memoArr]);
    //// when add new one

    // anno textarea height
    const annoTextareaChange = (e) => {

        var textArea = document.querySelectorAll('memo_anno_textarea');
        var lineHeight = parseInt(window.getComputedStyle(textArea).lineHeight, 10);
        var numberOfLines = Math.ceil(textArea.scrollHeight / lineHeight);

        if (e.keyCode === 13) {
            textArea.style.height = `${lineHeight * (numberOfLines + 1)}px`;
        }

    }
    //// anno textarea height

    return (

        <div className='common_page'>
            <div className='content_area reverse'>
                <div className='book_list_pos'>
                    <div className='book_list'>
                        <div className={`book_list_current ${scrollPosition > 0 ? "scroll_event" : ""}`} onClick={bookListOn}>
                            <i className='icon-book'></i>
                            <strong>{bookTitle}</strong>
                            <b onClick={(e) => refreshTitle(e)} className={`icon-cancel ${bookTitle !== '전체' ? 'active' : ''}`}></b>
                            <b onClick={(e) => deleteBook(e)} className={`icon-trash hover_opacity ${bookTitle !== '전체' ? 'active' : ''}`}></b>
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
                                                }}>{bookListState[i].book}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className={`memo_btn ${scrollPosition > 0 ? "scroll_event" : ""}`}>
                        <button onClick={memoAddOn} className='icon-pencil-alt'></button>
                        <button onClick={bookAddOn} className='icon-book-2'></button>
                    </div>
                </div>

                <div className={`memo_wrap reverse`}>
                    {
                        memoArr.map(function (a, i) {
                            return (
                                <div className='memo_content' key={i}>
                                    <div className='memoList_btn'>
                                        <button className='icon-edit-alt' onClick={() => memoCorrectOn(a)}></button>
                                        {/* <button className='icon-trash' onClick={() => delMemoList(i)}></button> */}
                                    </div>
                                    <div className='memo_content_box'>
                                        <p className='font_text' onClick={() => memoDetailOn(a)}>{memoArr[i].memoComment}</p>
                                        <div className='memo_content_btn_box'>
                                            <button onClick={() => bookFilter(i)}>{memoArr[i].memoSource}</button>
                                            <span>{memoArr[i].memoAuthor}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                {/* memoDetail */}
                <div className={`memoDetail_content ${memoActive ? memoActive : ""}`}>
                    {memoCurrent !== null && <MemoView memo={memoCurrent} />}
                    <div className='memoDetail_btn'>
                        <button className='icon-flow-split' onClick={() => {
                            setMemoAnnoActive('active');
                        }}></button>
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
                        <input type='text' placeholder='newAuthor' ref={newAuthor}></input>
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
                        <button className={`icon-pin ${memoRecord ? memoRecord : ""}`} onClick={MemoRecordMode}></button>
                        <input type='text' placeholder='newMemoSource' ref={newMemoSource}></input>
                        <input type='text' placeholder='newMemoAuthor' ref={newMemoAuthor}></input>
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

        const [memoAnnoCorrProps, setMemoAnnoCorrProps] = useState(memoAnnoCorrText);
        const memoCorrTextChange = (e) => {
            setMemoAnnoCorrProps(e.target.value)
        }

        return (

            <div className='memoDetail_content_pos scroll'>
                <ul className='memoDetail_content_info'>
                    <li>
                        <strong>출처</strong>
                        <span className=''>{memo.memoSource}</span>
                    </li>
                    <li>
                        <strong>저자</strong>
                        <span className=''>{memo.memoAuthor}</span>
                    </li>
                </ul>
                <div className='memo_comment_box scroll'>
                    <p className=''>{memo.memoComment}</p>
                </div>

                <div className={`memo_anno_common ${memoAnnoActive ? 'active' : ''}`}>
                    <textarea className='memo_anno_textarea' placeholder="memo_annotation" ref={newMemoAnno} onKeyDown={annoTextareaChange}></textarea>
                    <button className='icon-ok' onClick={() => memoAnnoBtn(memo)}></button>
                    <button className='icon-cancel' onClick={() => setMemoAnnoActive('')}></button>
                </div>

                <div className={`memo_anno_common corr ${annoCorrectActive ? 'active' : ''}`}>
                    <textarea className='memo_anno_textarea' value={memoAnnoCorrProps} placeholder="memo_anno_correct" onChange={(e) => memoCorrTextChange(e)} onKeyDown={annoTextareaChange}></textarea>
                    <button className='icon-ok' onClick={() => memoAnnoCorrComBtn(memo, memoAnnoCorrProps)}></button>
                    <button className='icon-cancel' onClick={() => setAnnoCorrectActive('')}></button>
                </div>

                {memo.memoAnnotation !== null && <MemoAnno memo={memo} />}

            </div>
        )
    }

    function MemoAnno({ memo }) {

        return (
            <ul className='memo_annotation'>
                {
                    Object.values(memo.memoAnnotation).map(function (m, i) {
                        return (
                            <li key={i}>
                                <div className='memo_annotation_fac'>
                                    <i className='icon-level-down'></i>
                                    <div className='memo_annotation_fac_box'>
                                        <p className='text'>{memo.memoAnnotation[i]}</p>
                                        <button className='icon-feather' onClick={() => { memoAnnoCorrectBtn(memo, i) }}></button>
                                        <button className='icon-trash' onClick={() => { memoAnnoDeleteBtn(memo, i) }}></button>
                                    </div>
                                </div>

                            </li>
                        )
                    })
                }
            </ul>
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
                        <input type="text" placeholder="correctMemoSource" className="memo_source" defaultValue={memo.memoAuthor} ref={correctMemoAuthor}></input>
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