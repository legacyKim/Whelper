import { React, useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";

import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"

import MyContext from '../context';

import { debounce } from 'lodash';

import useScrollAnima from './hook/useScrollAnima.js'

import ViewEdit from './SlateView.js'
import { token_check } from '../data/token_check.js'

import { syncCateListData, syncCateListDataDel, resetWriteCate } from '../data/reducers.js'
import { writeListCateData, cateListData_cate, cateListDataPost, cateListDataDelete } from '../data/api.js';

function Category() {

    let { writeListKeyword } = useParams();
    const [cateProps, setCateProps] = useState(writeListKeyword);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { rootHeight, cateScrollPosition, setCateScrollPosition, isAuth } = useContext(MyContext);

    const writeListState = useSelector((state) => state.WriteListCateDataOn);
    const cateListState = useSelector((state) => state.cateData);

    const [writeListArr, setWriteListArr] = useState(writeListState.data.write || []);
    const cateListArr = cateListState.data.cate || [];

    useEffect(() => {
        dispatch(cateListData_cate());
        dispatch(resetWriteCate());

        dispatch(writeListCateData({ page, cateArr })).then(() => {
            setTotalPages(writeListState.data.totalPages);
        });
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(writeListState.data.totalPages);

    // cate arr setting
    const keywordArrLocalString = localStorage.getItem('cateHistory');
    const keywordArrLocal = keywordArrLocalString !== null ? JSON.parse(keywordArrLocalString) : [];

    const [cateArr, setCateArr] = useState(() => {
        if (cateProps !== undefined) {
            return [cateProps];
        } else if (keywordArrLocal) {
            return keywordArrLocal;
        } else {
            return [];
        }
    });
    const [cateArrLength, setCateArrLength] = useState(keywordArrLocal.length);

    useEffect(() => {
        setWriteListArr(writeListState.data.write);
    }, [writeListState]);

    useEffect(() => {
        const updateScroll = debounce(() => {
            setCateScrollPosition(window.scrollY || document.documentElement.scrollTop);
        });
        window.addEventListener('scroll', updateScroll);
        return () => {
            window.removeEventListener('scroll', updateScroll);
        };
    }, []);

    useEffect(() => {

        const cateAreaHeight = document.querySelector('.content_area_cate').offsetHeight;

        if (page <= totalPages) {
            if (cateAreaHeight <= Math.ceil(cateScrollPosition + rootHeight)) {
                setPage((prevPage) => prevPage + 1);
            }
        }
    }, [cateScrollPosition]);

    useEffect(() => {
        if (page <= totalPages) {
            dispatch(writeListCateData({ page, cateArr }));
        }
    }, [page]);

    // cate Array
    const clickRemove = (i) => {
        setCateArr((prevKeywordArr) =>
            cateArr.includes(cateArr[i])
                ? prevKeywordArr.filter((item) => item !== cateArr[i])
                : [...prevKeywordArr, cateArr[i]]
        );
    }

    const clickRemoveAll = () => {
        setCateArr(cateArr.filter((item) => item === cateArr));
    }

    const [removeBtn, setRemoveBtn] = useState(false);
    //// cate arr setting

    useEffect(() => {

        if (cateArrLength < cateArr.length) {

            dispatch(resetWriteCate());
            dispatch(writeListCateData({ page: 1, cateArr })).then(() => {
                setTotalPages(writeListState.data.totalPages);
                setPage(1);
                setCateProps(undefined);
            });

        } else {

            const newCateFilter = writeListArr.filter((item) =>
                cateArr.some(cate => item.keywords.includes(cate))
            );
            setWriteListArr(newCateFilter);

            if (cateArr.length === 0) {
                dispatch(resetWriteCate());
            }
        }

        if (cateArr.length >= 1) {
            setRemoveBtn(true);
        } else {
            setRemoveBtn(false);
        }

        localStorage.setItem('cateHistory', JSON.stringify(cateArr));
        setCateArrLength(cateArr.length);

    }, [cateArr]);

    // category add popup
    const [catePopup, catePopupActive] = useState("");
    const cateAdd = () => {
        catePopupActive(!catePopup);
        if (!catePopup) {
            catePopupActive('active');
        } else {
            catePopupActive('');
        }
    }

    var cateInput = useRef(null);
    const cateSaveBtn = async () => {

        const isTokenValid = await token_check(navigate);

        if (isTokenValid) {

            const category = cateInput.current.value;
            const cateCheck = cateListArr.filter((item) => item.category === category);

            if (cateCheck.length > 0 && category !== '') {

                alert('카테고리가 존재합니다.');
                cateInput.current.value = '';
                return;

            } else {
                dispatch(syncCateListData({ category }));
                dispatch(cateListDataPost({ category }));

                cateInput.current.value = '';
            }

        }
    }

    const cateDelete = async (e) => {
        e.stopPropagation();

        const category = e.target.parentNode.parentNode.innerText
        const isTokenValid = await token_check(navigate);

        if (isTokenValid) {
            dispatch(syncCateListDataDel({ category }));
            dispatch(cateListDataDelete({ category }));

            setCateArr(cateArr.filter((item) => item !== category));
        }
    }

    const cateCloseBtn = () => {
        catePopupActive('');
    }
    //// category add popup

    // cateBox Open
    const [cateBox, setCateBox] = useState(false);
    const cateBoxOpen = () => {
        if (cateBox === true) {
            setCateBox(false);
        } else {
            setCateBox(true);
        }
    }

    return (

        <div className='content_area content_area_cate'>
            <div className="cate_list_btn">
                <button onClick={cateBoxOpen}><i className="icon-book"></i></button>
                {(isAuth === 0 || isAuth === 1) && (
                    <button className='cate_add_btn' onClick={cateAdd}><i className='icon-pencil-alt'></i></button>
                )}
            </div>
            <div className={`cate_list_pos scroll ${cateBox === true ? 'active' : ''}`}>
                <ul className='cate_list'>
                    {
                        cateListArr.map(function (a, i) {
                            return (
                                <li key={i}>
                                    <CategoryList cate={a} cateArr={cateArr} setCateArr={setCateArr} />

                                    {(isAuth === 0 || isAuth === 1) && (
                                        <button onClick={(e) => { cateDelete(e) }}><i className='icon-trash'></i></button>
                                    )}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className={`cate_box ${(isAuth === 0 || isAuth === 1) ? 'auth' : ''}`}>
                <div className={`cate_request ${(isAuth === 0 || isAuth === 1) ? 'auth' : ''}`}>
                    {
                        cateArr.map(function (a, i) {
                            return (
                                <div key={i} onClick={() => { clickRemove(i) }}>
                                    <span>{cateArr[i]}</span>
                                </div>
                            )
                        })
                    }
                    <button className={`icon-spin6 animate-spin ${removeBtn ? "active" : ""}`} onClick={clickRemoveAll}></button>
                </div>
                <ul className='cate_result'>
                    {
                        writeListArr.map(function (a, i) {
                            return (
                                <li key={i}>
                                    <CategoryResult i={i} writeListArr={writeListArr} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            <div className={`cateAdd ${catePopup ? catePopup : ""}`}>
                <input type="text" ref={cateInput} placeholder='Category' />
                <button onClick={cateSaveBtn}><i className='icon-ok'></i></button>
                <button onClick={cateCloseBtn}><i className='icon-cancel'></i></button>
            </div>
        </div>

    )

    function CategoryList({ cate, cateArr, setCateArr }) {

        const objClassName = '.cate_result>li';
        useScrollAnima(objClassName, cateScrollPosition, rootHeight);

        const cate_check = cate.category
        const [cateActive, setCateActive] = useState(cateArr.includes(cate_check));

        function cateClick() {
            setTimeout(() => {
                setCateArr((prevKeywordArr) =>
                    cateArr.includes(cate_check)
                        ? prevKeywordArr.filter((item) => item !== cate_check)
                        : [...prevKeywordArr, cate_check]
                );
            }, 300)

            setCateActive((prevCateActive) => !prevCateActive);
        };

        return (
            <span className={`${cateActive ? "active" : ""}`} onClick={cateClick}>{cate_check}</span>
        )
    }

    function CategoryResult({ i, writeListArr }) {

        const titleDoc = new DOMParser().parseFromString(writeListArr[i].title, 'text/html');
        const subTitleDoc = new DOMParser().parseFromString(writeListArr[i].subTitle, 'text/html');
        const contentDoc = new DOMParser().parseFromString(writeListArr[i].content, 'text/html');
        const keywordsParse = JSON.parse(writeListArr[i].keywords)

        const index = writeListArr[i].id;

        return (
            <div className='write_list'>
                <div className="fake_div">
                    <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
                </div>
                <Link to={`/components/WriteView/${index}`}></Link>
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

                    {/* <b className='write_date'>{writeDate}</b> */}

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

export default Category;