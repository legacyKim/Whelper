import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux"
import MyContext from '../context'

import { debounce } from 'lodash';

import useScrollAnima from './hook/useScrollAnima.js'

import { memoListData, memoListDataPost, memoListDataUpdate, memoListDataDelete, memoListAnnoPost, memoListAnnoUpdate, memoListAnnoDelete, bookListData, bookListDataPost, bookListDataDelete } from "../data/api"
import { syncMemoListDataAdd, syncMemoListDelete, syncMemoListDataUpdate, syncMemoListAnno, syncMemoListAnnoUpdate, syncMemoListAnnoDelete, resetMemo, syncBookListDataAdd, syncBookListDelete, setMemoPage } from "../data/reducers.js"
import { token_check } from '../data/token_check.js'

function Memo() {

    const { isAuth, rootHeight, MemoScrollPosition, setMemoScrollPosition } = useContext(MyContext);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(bookListData());

        dispatch(setMemoPage());
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

    const page = memoListState.data.page;
    const [totalPages, setTotalPages] = useState(memoListState.data.totalPages);

    const bookLocalStorage = localStorage.getItem('bookTitle');
    const [bookTitle, setBookTitle] = useState(bookLocalStorage);

    useEffect(() => {
        const updateScroll = debounce(() => {
            setMemoScrollPosition(window.scrollY || document.documentElement.scrollTop);
        });
        window.addEventListener('scroll', updateScroll);
        return () => {
            window.removeEventListener('scroll', updateScroll);
        };
    }, []);

    useEffect(() => {
        if (totalPages === null) {
            dispatch(memoListData({ page, bookTitle })).then(() => {
                setTotalPages(memoListState.data.totalPages);
            });
        }

        const memoAreaHeight = document.querySelector('.content_area_memo').offsetHeight

        if (page <= totalPages) {
            if (Math.ceil(MemoScrollPosition + rootHeight) <= memoAreaHeight) {
                dispatch(setMemoPage(page + 1));
            }
        }
    }, [MemoScrollPosition]);

    useEffect(() => {
        if (page <= totalPages) {
            dispatch(memoListData({ page, bookTitle }));
        }
    }, [page, dispatch]);

    const [memoArr, setMemoArr] = useState(memoListArr);

    useEffect(() => {
        setMemoArr(memoListArr)
    }, [memoListState])

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
    var newMemoSource = useRef(null);
    var newMemoSourcePage = useRef(null);
    var newMemoAuthor = useRef(null);
    var newMemoComment = useRef(null);

    const MemoSaveBtn = async () => {

        const isTokenValid = await token_check(navigate);

        if (newMemoComment.current.value === '') {
            alert('코멘트가 없습니다.');
            return;
        } else if (newMemoSource.current.value === '') {
            alert('저서 정보가 없습니다.');
            return;
        } else if (newMemoAuthor.current.value === '') {
            alert('저자 정보가 없습니다.');
            return;
        } else if (isTokenValid) {

            var randomId = Math.random().toString(36).substr(2, 9);
            const memoComment = newMemoComment.current.value;
            var memoAuthor = newMemoAuthor.current.value;
            var memoSource = newMemoSource.current.value;
            var memoSourcePage = newMemoSourcePage.current.value;
            var memoAnnotation = [];

            dispatch(syncMemoListDataAdd({ memoComment, memoAuthor, memoSource, memoSourcePage, memoAnnotation, randomId }));
            dispatch(memoListDataPost({ memoComment, memoAuthor, memoSource, memoSourcePage, memoAnnotation }));

            if (memoListArr.length === 0) {
                dispatch(syncBookListDataAdd({ memoSource, memoAuthor }));
                dispatch(bookListDataPost({ memoSource, memoAuthor }));
            } else {
                const sourceExists = memoListArr.some((ele) => ele.memoSource === memoSource);
                if (!sourceExists) {
                    dispatch(syncBookListDataAdd({ memoSource, memoAuthor }));
                    dispatch(bookListDataPost({ memoSource, memoAuthor }));
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
                const sourceExists = bookListArr.some((ele) => ele.memoSource === memoSource);
                if (!sourceExists) {
                    dispatch(syncBookListDataAdd({ memoSource, memoAuthor }));
                    dispatch(bookListDataPost({ memoSource, memoAuthor }));
                }
            }
        }
    }

    // book delete
    const [modalDeleteBook, setModalDeleteBook] = useState(false);

    // memo delete
    const [modalDeleteMemo, setModalDeleteMemo] = useState(false);

    // memo correct btn
    var correctMemoSource = useRef();
    var correctMemoSourcePage = useRef();
    var correctMemoAuthor = useRef();
    var correctMemoComment = useRef();

    const memoCorrectBtn = async (a) => {

        const isTokenValid = await token_check(navigate);
        if (isTokenValid) {

            const id = a.id
            const memoSource = correctMemoSource.current.value;
            const memoSourcePage = correctMemoSourcePage.current.value;
            const memoAuthor = correctMemoAuthor.current.value;
            const memoComment = correctMemoComment.current.value;
            const memoAnnotation = a.memoAnnotation;

            dispatch(syncMemoListDataUpdate({ id, memoSource, memoSourcePage, memoAuthor, memoComment, memoAnnotation }));
            dispatch(memoListDataUpdate({ id, memoSource, memoSourcePage, memoAuthor, memoComment }));

            if (memoListArr.length === 0) {
                dispatch(syncBookListDataAdd({ memoSource, memoAuthor }));
                dispatch(bookListDataPost({ memoSource, memoAuthor }));
            } else {
                const sourceExists = memoListArr.some((ele) => ele.memoSource === memoSource);
                if (!sourceExists) {
                    dispatch(syncBookListDataAdd({ memoSource, memoAuthor }));
                    dispatch(bookListDataPost({ memoSource, memoAuthor }));
                }
            }

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
    }, [bookListArr]);
    //// memo reset

    // book name check
    const bookChange = (i) => {
        if (i === undefined) {
            setBookTitle("전체")
            localStorage.removeItem('bookTitle');
        } else {
            setBookTitle(bookListArr[i].memoSource);
            localStorage.setItem('bookTitle', bookListArr[i].memoSource);
        }
    }

    useEffect(() => {

        if (bookLocalStorage === null) {
            setBookTitle("전체")
        }

        setMemoCurrent(null);

        dispatch(resetMemo());
        dispatch(memoListData({ page, bookTitle })).then(() => {
            setTotalPages(memoListState.data.totalPages);
        });

    }, [bookTitle]);

    useEffect(() => {
        newMemoComment.current.value = null;

        if (memoRecord !== 'active') {
            newMemoSource.current.value = null;
            newMemoSourcePage.current.value = null;
            newMemoAuthor.current.value = null;
            memoAddClose();
        }

    }, [memoListArr]);
    //// book name check

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
    const memoannoListBtn = async (memo) => {
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
        if (memoCurrent && memoCurrent.memoSource) {
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
            <div className='content_area content_area_memo reverse'>
                <div className={`book_list_pos`}>
                    <div className='book_list'>
                        <div className={`book_list_current ${MemoScrollPosition > 0 ? "scroll_event" : ""}`} onClick={bookListOn}>
                            <i className='icon-book'></i>
                            <strong className={`${bookListActive ? bookListActive : ''}`}>{bookTitle}</strong>
                            <b onClick={(e) => refreshTitle(e)} className={`icon-cancel ${bookTitle !== '전체' ? 'active' : ''}`}></b>
                            {isAuth === 0 && (
                                <b onClick={(e) => {
                                    e.stopPropagation()
                                    setModalDeleteBook(true);
                                }} className={`icon-trash hover_opacity ${bookTitle !== '전체' ? 'active' : ''}`}></b>
                            )}
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
                    {(isAuth === 0 || isAuth === 1) && (
                        <div className={`memo_btn ${MemoScrollPosition > 0 ? "scroll_event" : ""}`}>
                            <button onClick={memoAddOn} className='icon-pencil-alt'></button>
                            <button onClick={bookAddOn} className='icon-book-2'></button>
                        </div>
                    )}
                </div>

                <div className={`memo_scroll ${(isAuth === 0 || isAuth === 1) ? 'auth' : ''}`}>
                    <div className={`memo_wrap`}>
                        {
                            memoArr.map(function (a, i) {
                                return (
                                    <div className='memo_content' key={i}>
                                        <div className={`memoList_btn ${(isAuth === 0 || isAuth === 1) ? 'auth' : ''}`}>
                                            {(isAuth === 0 || isAuth === 1) && (
                                                <button className='icon-edit-alt' onClick={() => memoCorrectOn(a)}></button>
                                            )}
                                            {/* <button className='icon-trash' onClick={() => delMemoList(i)}></button> */}
                                        </div>

                                        <MemoContentBox memoArr={memoArr} i={i} a={a} />

                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                {/* memoDetail */}
                <div className={`memo_content_pos ${memoActive ? memoActive : ""}`}>
                    {memoCurrent && memoCurrent.memoSource && <MemoView memo={memoCurrent} />}
                </div>
                {/* memoDetail */}

                {/* memoCorrect */}
                <div className={`memo_content_pos ${memoCorrectActive ? memoCorrectActive : ""}`}>
                    {memoCurrent && memoCurrent.memoSource && <MemoCorrect memo={memoCurrent} />}
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

                    <div className='memo_btn flex-end'>
                        <button className='icon-ok' onClick={MemoSaveBtn}></button>
                        <button className='icon-cancel' onClick={memoAddClose}></button>
                    </div>

                    <div className='memo_input'>
                        <button className={`icon-pin ${memoRecord ? memoRecord : ""}`} onClick={MemoRecordMode}></button>
                        <input type='text' placeholder='newMemoSource' ref={newMemoSource}></input>
                        <input type='text' placeholder='newMemoSourcePage' ref={newMemoSourcePage}></input>
                        <input type='text' placeholder='newMemoAuthor' ref={newMemoAuthor}></input>
                    </div>
                </div>
                {/* memoAdd */}

                {modalDeleteBook === true && (
                    <ModalDeleteBook setBookTitle={setBookTitle} setModalDeleteBook={setModalDeleteBook} />
                )}

                {modalDeleteMemo === true && (
                    <ModalDeleteMemo setModalDeleteMemo={setModalDeleteMemo} memoCurrent={memoCurrent} />
                )}

            </div>
        </div >

    )

    function MemoContentBox({ memoArr, i, a }) {

        const objClassName = '.memo_content';
        useScrollAnima(objClassName, MemoScrollPosition, rootHeight);

        return (
            <div className='memo_content_box'>
                <p className='font_text' onClick={() => memoDetailOn(a)}>{memoArr[i].memoComment}</p>
                <div className='memo_content_btn_box'>
                    <div>
                        <button onClick={() => bookFilter(i)}>{memoArr[i].memoSource}</button>
                        {memoArr[i].memoSourcePage !== null && memoArr[i].memoSourcePage !== '' && (
                            <span>{memoArr[i].memoSourcePage}p</span>
                        )}
                    </div>
                    <span>{memoArr[i].memoAuthor}</span>
                </div>
            </div>
        )
    }

    function MemoView({ memo }) {

        const [memoAnnoCorrProps, setMemoAnnoCorrProps] = useState(memoAnnoCorrText);
        const memoCorrTextChange = (e) => {
            setMemoAnnoCorrProps(e.target.value)
        }

        return (

            <div className='memoDetail_content_pos'>
                <ul className='memoDetail_content_info'>
                    <li>
                        <strong>출처</strong>
                        <span className=''>{memo.memoSource}</span>
                        {memo.memoSourcePage !== null && memo.memoSourcePage !== '' && (
                            <span className=''>{memo.memoSourcePage}p</span>
                        )}
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
                    <button className='icon-ok' onClick={() => memoannoListBtn(memo)}></button>
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
                    {(isAuth === 0 || isAuth === 1) && (
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

                            {memo.id !== undefined && isAuth === 0 && (
                                <button className='icon-trash'
                                    onClick={() => {
                                        setModalDeleteMemo(true)
                                        memoDetailClose();
                                    }}>
                                </button>
                            )}

                        </div>
                    )}
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
                        <strong>쪽수</strong>
                        <input type="text" placeholder="correctMemoSourcePage" className="memo_source" defaultValue={memo.memoSourcePage} ref={correctMemoSourcePage}></input>
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

    function ModalDeleteMemo({ memoCurrent }) {

        const deleteMemoInModal = async (memoCurrent) => {
            const isTokenValid = await token_check(navigate);
            if (isTokenValid) {
                const corrMemoId = memoCurrent.id;
                dispatch(syncMemoListDelete(corrMemoId));
                dispatch(memoListDataDelete(corrMemoId));
                setMemoCurrent(null);
            }
            setModalDeleteMemo(false);
        }

        return (
            <div className="modal">
                <div className="modal_box">
                    <span>메모를 삭제하시겠습니까?</span>
                    <div className="btn_wrap">
                        <button onClick={() => setModalDeleteMemo(false)}>취소</button>
                        <button onClick={() => deleteMemoInModal(memoCurrent)}>삭제</button>
                    </div>
                </div>
            </div>
        )
    }

    function ModalDeleteBook({ setBookTitle, setModalDeleteBook }) {

        const deleteBookInModal = () => {
            localStorage.removeItem('bookTitle');
            setBookTitle('전체');

            const memoSource = bookTitle;

            dispatch(syncBookListDelete({ memoSource }));
            dispatch(bookListDataDelete({ memoSource: bookTitle }));

            setModalDeleteBook(false);
        }

        return (
            <div className="modal">
                <div className="modal_box">
                    <span>저서를 삭제하시겠습니까?</span>
                    <div className="btn_wrap">
                        <button onClick={() => setModalDeleteBook(false)} className='cancel'>취소</button>
                        <button onClick={deleteBookInModal}>삭제</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Memo;