import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import MyContext from '../context'
import { toast } from 'react-toastify';

import { memoListData, memoListDataPost, memoListDataUpdate, memoListDataDelete, memoListAnnoPost, memoListAnnoUpdate, memoListAnnoDelete, bookListData, bookListDataPost, bookListDataDelete } from "../data/api"
import { syncMemoListDataAdd, syncMemoListDelete, syncMemoListDataUpdate, syncMemoListAnno, syncMemoListAnnoUpdate, syncMemoListAnnoDelete, syncBookListDataAdd, syncBookListDelete } from "../data/reducers.js"
import { token_check } from '../data/token_check.js'

function Memo() {

    const navigate = useNavigate();
  
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(memoListData());

        dispatch(bookListData());
        dispatch(syncBookListDataAdd());

        dispatch(syncMemoListDataAdd());
        dispatch(syncMemoListDataUpdate());
        dispatch(syncMemoListDelete());
        dispatch(syncMemoListAnno());
        dispatch(syncMemoListAnnoUpdate());
        dispatch(syncMemoListAnnoDelete());
    }, [dispatch]);

    const memoListState = useSelector((state) => state.memoData);
    const bookListState = useSelector((state) => state.bookData);

    const memoListArr = memoListState.data.memo || [];
    const bookListArr = bookListState.data.book || [];

    const [memoArr, setMemoArr] = useState(memoListArr);
    const [memoReal, setMemoReal] = useState(memoArr);

    // alert
    const showToast = () => {
        toast('안녕하세요!', {
            style: {
                color: '#333',
                zIndex: '99999',
            },
        });
    };

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
    // const [memo, setMemo] = useState(memoListArr);

    var newMemoSource = useRef(null);
    var newMemoAuthor = useRef(null);
    var newMemoComment = useRef(null);

    const MemoSaveBtn = async () => {

        const isTokenValid = await token_check(navigate);
        if (isTokenValid) {

            var randomId = Math.random().toString(36).substr(2, 9);
            const memoComment = newMemoComment.current.value;
            var memoAuthor = newMemoAuthor.current.value;
            var memoSource = newMemoSource.current.value;
            var memoAnnotation = [];

            dispatch(syncMemoListDataAdd({ memoComment, memoAuthor, memoSource, memoAnnotation, randomId }));
            dispatch(memoListDataPost({ memoComment, memoAuthor, memoSource, memoAnnotation }));

            if (memoListArr.length === 0) {
                dispatch(syncBookListDataAdd({ memoSource, memoAuthor }));
                dispatch(bookListDataPost({ memoSource, memoAuthor }));
            } else {
                for (const key in memoListArr) {
                    const item = memoListArr[key];
                    if (item.memoSource !== memoSource) {
                        dispatch(syncBookListDataAdd({ memoSource, memoAuthor }));
                        dispatch(bookListDataPost({ memoSource, memoAuthor }));
                        break;
                    } else {
                        break;
                    }
                }
            }

            setMemoCurrent(null);
        }

    };

    // book save
    var newBook = useRef(null);
    var newAuthor = useRef(null);

    const bookSaveBtn = async () => {

        const isTokenValid = await token_check(navigate);
        if (isTokenValid) {

            const memoSource = newBook.current.value;
            const memoAuthor = newAuthor.current.value;

            if (memoListArr.length === 0) {
                dispatch(syncBookListDataAdd({ memoSource, memoAuthor }))
                dispatch(bookListDataPost({ memoSource, memoAuthor }));
            } else {
                for (const key in bookListArr) {
                    const item = bookListArr[key];
                    if (item.memoSource !== memoSource) {
                        dispatch(syncBookListDataAdd({ memoSource, memoAuthor }))
                        dispatch(bookListDataPost({ memoSource, memoAuthor }));
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }

    // book delete
    const deleteBook = (e) => {
        e.stopPropagation();
        localStorage.removeItem('bookTitle');
        setBookTitle('전체');
        const memoSource = bookTitle;
        dispatch(syncBookListDelete({ memoSource }))
        dispatch(bookListDataDelete({ memoSource: bookTitle }))
    }

    // memo anno delete
    const memoDeleteBtn = async (memoCurrent) => {
        const isTokenValid = await token_check(navigate);
        if (isTokenValid) {
            const corrMemoId = memoCurrent.id;
            dispatch(syncMemoListDelete(corrMemoId));
            dispatch(memoListDataDelete(corrMemoId));
            setMemoCurrent(null);
        }
    }
    //// memo Annotation

    // memo correct btn
    var correctMemoSource = useRef();
    var correctMemoAuthor = useRef();
    var correctMemoComment = useRef();

    const memoCorrectBtn = async (a) => {

        const isTokenValid = await token_check(navigate);
        if (isTokenValid) {

            const id = a.id
            const memoSource = correctMemoSource.current.value;
            const memoAuthor = correctMemoAuthor.current.value;
            const memoComment = correctMemoComment.current.value;
            const memoAnnotation = a.memoAnnotation;

            dispatch(syncMemoListDataUpdate({ id, memoSource, memoAuthor, memoComment, memoAnnotation }));
            dispatch(memoListDataUpdate({ id, memoSource, memoAuthor, memoComment }));

            setMemoCurrent({ id, memoSource, memoAuthor, memoComment, memoAnnotation });

            setMemoCorrectActive('');
            setMemoActive('active');

        }
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
        newBook.current.value = null;
        newAuthor.current.value = null;
    }, [bookListArr])
    //// memo reset

    // book name check
    const bookLocalStorage = localStorage.getItem('bookTitle');
    const [bookTitle, setBookTitle] = useState(bookLocalStorage);

    const bookChange = (i) => {
        if (i === undefined) {
            setBookTitle("전체")
            localStorage.removeItem('bookTitle');
        } else {
            setBookTitle(bookListArr[i].memoSource);
            setMemoCurrent(null);
            localStorage.setItem('bookTitle', bookListArr[i].memoSource);
        }
    }

    // infinite scroll
    var memoScrollArea = useRef();
    var memoScrollPos = useRef();
    var currentY = 0;
    var previousY = 0;
    var scrollAmount = 140;

    const memoAreaCheck = () => {
        var scY = window.innerHeight;
        const memoScrollTop = memoScrollArea.current.getBoundingClientRect().top;
        var memoAreaHeight = (scY - memoScrollTop) / scrollAmount;
        memoScrollArea.current.style.height = Math.floor(memoAreaHeight) * scrollAmount + 'px';
    }

    const memoScrollMove = (e) => {

        currentY = memoScrollArea.current.scrollTop;
        if (e.deltaY > 0) {
            currentY += scrollAmount;
        } else {
            currentY -= scrollAmount;
        }
        memoScrollArea.current.scrollTop = currentY;
        previousY = currentY;

        var scroll_num = Math.round(currentY / scrollAmount);

        if (0 <= scroll_num && scroll_num < memoListArr.length - 5 && 5 < memoArr.length) {
            memoScrollPos.current.style.top = `${scrollAmount * scroll_num}px`

            var rows = [];
            for (let i = scroll_num; i < scroll_num + 6; i += 1) {
                if (memoArr[i] !== undefined) rows.push(memoArr[i])
            }

            setMemoReal(rows)

        }

    }

    useEffect(() => {

        // check web size and attribute height;
        memoAreaCheck();

        const currentScrollArea = memoScrollArea.current;
        currentScrollArea.addEventListener('wheel', memoScrollMove);

        var rows = [];
        for (let i = 0; i < 6; i += 1) {
            if (memoArr[i] !== undefined) rows.push(memoArr[i])
        }
        setMemoReal(rows)

        return () => {
            currentScrollArea.removeEventListener('wheel', memoScrollMove);
        };
    }, [memoArr]);
    //// infinite scroll

    useEffect(() => {
        if (bookLocalStorage === null) {
            setBookTitle("전체")
            setMemoCurrent(null);
            setMemoArr(memoListArr);
        } else {
            setMemoCurrent(null);
            setMemoArr(memoListArr.filter((item) => item.memoSource === bookTitle));
        }
        setMemoCurrent(null);
        memoScrollPos.current.style.top = '0px';
    }, [bookTitle]);

    useEffect(() => {
        newMemoComment.current.value = null;
        setMemoArr(memoListArr)

        if (memoRecord !== 'active') {
            newMemoSource.current.value = null;
            newMemoAuthor.current.value = null;
        }

        if (bookLocalStorage === null) {
            setBookTitle("전체");
        } else {
            setMemoArr(memoListArr.filter((item) => item.memoSource === bookTitle));
        }

    }, [memoListArr]);
    //// book name check

    // context api scroll pos
    const { scrollPosition } = useContext(MyContext);
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
            setMemoAnnoActive('');
        }
    }, [memoAnnoActive]);

    // memo anno add
    var newMemoAnno = useRef();
    const memoAnnoBtn = async (memo) => {
        const isTokenValid = await token_check(navigate);
        if (isTokenValid) {

            const memoAnnotation = newMemoAnno.current.value;
            const memoComment = memo.memoComment;
            const memoSource = memo.memoSource;
            const memoAuthor = memo.memoAuthor;

            dispatch(syncMemoListAnno({ memoSource, memoAnnotation }));
            dispatch(memoListAnnoPost({ memoComment, memoSource, memoAuthor, memoAnnotation }))
            setMemoAnnoActive('');
            setTextAreaHeight(null);
        }

    }
    //// memo anno add

    // memo anno correct box open
    const [memoAnnoCorrText, setMemoAnnoCorrText] = useState();
    const [annoCorrectActive, setAnnoCorrectActive] = useState('');
    const [memoAnnoIndex, setMemoAnnoIndex] = useState();

    const textareaCorr = useRef();
    const [textAreaHeight, setTextAreaHeight] = useState();

    const memoAnnoCorrectBtn = (memoAnnoFac, i) => {

        const memoAnnoText = document.querySelectorAll('.text');

        if (annoCorrectActive !== 'active') {
            setAnnoCorrectActive('active');
        }

        setMemoAnnoCorrText(memoAnnoFac);
        setTextAreaHeight(memoAnnoText[i].clientHeight);
        setMemoAnnoIndex(i);
    }

    useEffect(() => {
        if (textAreaHeight !== undefined) {
            textareaCorr.current.style.height = textAreaHeight + 'px';
        }
    }, [textAreaHeight])

    // memo anno correct complete
    const memoAnnoCorrComBtn = async (memo, memoAnnoCorrProps) => {

        const isTokenValid = await token_check(navigate);
        if (isTokenValid) {

            const id = memo.id;
            const memoAnno = memoAnnoCorrProps;
            const memoComment = memo.memoComment;
            const memoSource = memo.memoSource;
            const memoAuthor = memo.memoAuthor;

            const corrAnnotationKeys = memoAnnoIndex;

            dispatch(syncMemoListAnnoUpdate({ id, memoAnno, corrAnnotationKeys }));
            dispatch(memoListAnnoUpdate({ id, memoComment, memoSource, memoAuthor, memoAnno, corrAnnotationKeys }));
            setAnnoCorrectActive('');
            setTextAreaHeight(null);

        }

    }
    //// memo anno correct complete

    // memo anno delete 
    const memoAnnoDelete = (memo, i) => {

        const id = memo.id;
        const corrAnnotationKeys = i;

        dispatch(syncMemoListAnnoDelete({ id, corrAnnotationKeys }))
        dispatch(memoListAnnoDelete({ id, corrAnnotationKeys }));

    }
    //// memo anno delete

    // when add new one
    useEffect(() => {
        if (memoCurrent !== null) {
            var index = memoCurrent.id;
            const memoRecent = memoArr.filter(item => item.id === index)
            setMemoCurrent(memoRecent[0]);
        }
    }, [memoArr]);
    //// when add new one

    // anno textarea height
    const annoTextareaChange = (e) => {
        newMemoAnno.current.style.height = 'auto'; //height 초기화
        newMemoAnno.current.style.height = newMemoAnno.current.scrollHeight + 'px';
    }

    const annoTextareaChangeCorr = (e) => {
        textareaCorr.current.style.height = 'auto'; //height 초기화
        textareaCorr.current.style.height = textareaCorr.current.scrollHeight + 'px';
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
                                    bookListArr.map(function (k, i) {
                                        return (
                                            <li key={i}>
                                                <span className='' onClick={() => {
                                                    bookListClose();
                                                    bookChange(i);
                                                }}>{bookListArr[i].memoSource}</span>
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

                <div className='memo_scroll' ref={memoScrollArea}>
                    <div className={`memo_wrap`} ref={memoScrollPos}>
                        {
                            memoReal.map(function (a, i) {
                                return (
                                    <div className='memo_content' key={i}>
                                        <div className='memoList_btn'>
                                            <button className='icon-edit-alt' onClick={() => memoCorrectOn(a)}></button>
                                            {/* <button className='icon-trash' onClick={() => delMemoList(i)}></button> */}
                                        </div>
                                        <div className='memo_content_box'>
                                            <p className='font_text' onClick={() => memoDetailOn(a)}>{memoReal[i].memoComment}</p>
                                            <div className='memo_content_btn_box'>
                                                <button onClick={() => bookFilter(i)}>{memoReal[i].memoSource}</button>
                                                <span>{memoReal[i].memoAuthor}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>


                {/* memoDetail */}
                <div className={`memo_content_pos ${memoActive ? memoActive : ""}`}>
                    {memoCurrent !== null && <MemoView memo={memoCurrent} />}
                </div>
                {/* memoDetail */}

                {/* memoCorrect */}
                <div className={`memo_content_pos ${memoCorrectActive ? memoCorrectActive : ""}`}>
                    {memoCurrent !== null && <MemoCorrect memo={memoCurrent} />}
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
                    <textarea className='memo_anno_textarea' placeholder="memo_annotation" ref={newMemoAnno} onChange={annoTextareaChange}></textarea>
                    <button className='icon-ok' onClick={() => memoAnnoBtn(memo)}></button>
                    <button className='icon-cancel' onClick={() => {
                        setMemoAnnoActive('')
                        setTextAreaHeight(null);
                    }}></button>
                </div>

                <div className={`memo_anno_common corr ${annoCorrectActive ? 'active' : ''}`}>
                    <textarea className='memo_anno_textarea' placeholder="memo_anno_correct" ref={textareaCorr} value={memoAnnoCorrProps} onChange={(e) => {
                        memoCorrTextChange(e);
                        annoTextareaChangeCorr();
                    }}></textarea>
                    <button className='icon-ok' onClick={() => memoAnnoCorrComBtn(memo, memoAnnoCorrProps)}></button>
                    <button className='icon-cancel' onClick={() => {
                        setAnnoCorrectActive('')
                        setTextAreaHeight(null);
                    }}></button>
                </div>

                {memo.memoAnnotation !== null && <MemoAnno memo={memo} />}

                <div className='memoDetail_btn'>
                    <div className='flex'>
                        <button className='icon-flow-split' onClick={() => {
                            setMemoAnnoActive('active');
                            setAnnoCorrectActive('');
                            setTextAreaHeight(null);
                        }}></button>

                        {memo.id !== undefined && (
                            <button className='icon-edit-alt'
                                onClick={() => {
                                    memoCorrectOn(memoCurrent);
                                    memoDetailClose();
                                }}></button>
                        )}
                        {memo.id !== undefined && (
                            <button className='icon-trash'
                                onClick={() => {
                                    memoDeleteBtn(memoCurrent)
                                    memoDetailClose();
                                }}>
                            </button>
                        )}
                    </div>
                    <button className='icon-cancel' onClick={() => {
                        memoDetailClose();
                        setAnnoCorrectActive('');
                        setMemoAnnoActive('');
                        setTextAreaHeight(null);
                    }}></button>
                </div>

            </div>
        )
    }

    function MemoAnno({ memo }) {

        const memoAnnoArr = memo.memoAnnotation !== undefined ? memo.memoAnnotation : [];

        return (
            <ul className='memo_annotation'>
                {
                    memoAnnoArr.map(function (m, i) {
                        return (
                            <li key={i}>
                                <div className='memo_annotation_fac'>
                                    <i className='icon-level-down'></i>
                                    <div className='memo_annotation_fac_box'>
                                        <p className={`text ${memo.id === undefined ? 'once' : ''}`}>{memo.memoAnnotation[i]}</p>

                                        {memo.id !== undefined && (
                                            <button className='icon-feather' onClick={() => {
                                                memoAnnoCorrectBtn(m, i);
                                                setMemoAnnoActive('')
                                            }}></button>
                                        )}
                                        {memo.id !== undefined && (
                                            <button className='icon-trash' onClick={() => {
                                                memoAnnoDelete(memo, i)
                                            }}></button>
                                        )}

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

                <div className='memoDetail_btn'>
                    <button className='icon-clipboard'
                        onClick={() => {
                            memoDetailOn(memoCurrent);
                            memoCorrectClose();
                        }}></button>
                    <button className='icon-cancel' onClick={memoCorrectClose}></button>
                </div>
            </div>
        )
    }
}

export default Memo;