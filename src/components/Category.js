
import { React, useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from "react-redux"

import ViewEdit from './SlateView.js'

function Category() {

    let cateListData = useSelector((state) => state.cateData);

    var cateScrollArea = useRef();
    var cateScrollPos = useRef();

    var currentY = 0;
    var previousY = 0;
    var scrollAmount = 22.4;

    // scroll direction
    const cateScrollMove = (e) => {
        currentY = cateScrollArea.current.scrollTop;

        if (e.deltaY > 0) {
            currentY += scrollAmount;
        } else {
            currentY -= scrollAmount;
        }

        cateScrollArea.current.scrollTop = currentY;
        previousY = currentY;
    };

    useEffect(() => {
        cateScrollArea.current.addEventListener("wheel", cateScrollMove);
    }, [])
    //// catelist scroll event

    // write => cate keyword click event
    let { writeListKeyword } = useParams();
    const [cateProps, setCateProps] = useState(writeListKeyword);
    //// write => cate keyword click event

    // cate arr setting
    const keywordArrLocalString = localStorage.getItem('cateHistory');
    const keywordArrLocal = keywordArrLocalString !== null ? JSON.parse(keywordArrLocalString) : [];

    // cate Array
    const [cateArr, setCateArr] = useState(keywordArrLocal);

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

    // cate result
    const writeListState = useSelector((state) => state.WriteData);
    let [cateFilterRes, setCateFilterRes] = useState([]);
    //// cate result

    useEffect(() => {

        // filter writeList
        let newCateFilter = [];
        cateArr.forEach((cateItem) => {
            writeListState.forEach((writeItem) => {
                if (writeItem.keyword.includes(cateItem)) {
                    newCateFilter = [...newCateFilter, writeItem];
                    newCateFilter = [...new Set(newCateFilter)];
                    return newCateFilter;
                }
            });

        });
        setCateFilterRes(newCateFilter);

        // reset btn show
        if (cateArr.length >= 1) {
            setRemoveBtn(true);
        } else {
            setRemoveBtn(false);
        }

        // localstorage
        localStorage.setItem('cateHistory', JSON.stringify(cateArr));
    }, [cateArr])

    useEffect(() => {
        if (cateProps !== undefined) {
            setCateArr([cateProps])
        }
    }, [cateProps]);

    return (

        <div className='content_area'>
            <div className='cate_list_pos' ref={cateScrollArea} >
                <ul className='cate_list' ref={cateScrollPos}>
                    {
                        cateListData.map(function (a, i) {
                            return (
                                <li key={i}>
                                    <CategoryList cate={a} cateArr={cateArr} setCateArr={setCateArr}></CategoryList>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className='cate_box'>
                <div className='cate_request'>
                    {
                        cateArr.map(function (a, i) {
                            return (
                                <span key={i} onClick={() => { clickRemove(i) }}>{cateArr[i]}</span>
                            )
                        })
                    }
                    <button className={`icon-spin6 animate-spin ${removeBtn ? "active" : ""}`} onClick={clickRemoveAll}></button>
                </div>
                <ul className='cate_result'>
                    {
                        cateFilterRes.map(function (a, i) {
                            return (
                                <li key={i}>
                                    <CategoryResult i={i} cateFilterRes={cateFilterRes} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>

    )

    function CategoryList({ cate, cateArr, setCateArr }) {

        const [cateActive, setCateActive] = useState(cateArr.includes(cate));

        function cateClick() {

            setTimeout(() => {
                setCateArr((prevKeywordArr) =>
                    cateArr.includes(cate)
                        ? prevKeywordArr.filter((item) => item !== cate)
                        : [...prevKeywordArr, cate]
                );
            }, 300)

            setCateActive((prevCateActive) => !prevCateActive);
        };

        return (
            <span className={`${cateActive ? "active" : ""}`} onClick={cateClick}>{cate}</span>
        )
    }

    function CategoryResult({ i, cateFilterRes }) {

        const titleDoc = new DOMParser().parseFromString(cateFilterRes[i].title, 'text/html');
        const subTitleDoc = new DOMParser().parseFromString(cateFilterRes[i].subTitle, 'text/html');
        const contentDoc = new DOMParser().parseFromString(cateFilterRes[i].content, 'text/html');

        return (
            <div className='write_list'>
                <Link to={`/components/WriteView/${writeListState[i].id}`}>
                    <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
                </Link>
                <div className='write_keyword'>
                    <ul className='write_keyword_list'>
                        {
                            writeListState[i].keyword.map((k, i) => (
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