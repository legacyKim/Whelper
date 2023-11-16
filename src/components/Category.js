
import { React, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux"

import '../css/style.css';
import '../lib/fontello/css/animation.css'

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

    // cate arr setting

    const keywordArrLocal = JSON.parse(localStorage.getItem('cateHistory'));
    const [cateArr, setCateArr] = useState(keywordArrLocal);

    useEffect(()=>{
        localStorage.setItem('cateHistory', JSON.stringify(cateArr));
    }, [cateArr])

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

    useEffect(() => {
        if (cateArr.length >= 1) {
            setRemoveBtn(true);
        } else {
            setRemoveBtn(false);
        }
    }, [cateArr])
    //// cate arr setting

    // cate result
    const writeListState = useSelector((state) => state.WriteData);
    let [cateFilterRes, setCateFilterRes] = useState([]);

    useEffect(() => {
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
    }, [cateArr])
    //// cate result

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

        return (
            <div className='write_list'>
                <Link to={`/components/WriteView/${writeListState[i].id}`}>
                    <span>{cateFilterRes[i].title}</span>
                    <strong>{cateFilterRes[i].subTitle}</strong>
                    <p>{cateFilterRes[i].content}</p>
                </Link>
            </div>

        )
    }

}

export default Category;