
import { React, useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"

import '../css/style.css';


function Category() {

    let cateListData = useSelector((state) => state.cateData);

    // catelist scroll event
    var cateScrollArea = useRef();
    var cateScrollPos = useRef();

    var currentY = 0;
    var previousY = 0;
    var scrollAmount = 22.4; // 원하는 스크롤 이동량

    // scroll direction
    const cateScrollMove = (e) => {
        currentY = cateScrollArea.current.scrollTop;

        if (e.deltaY > 0) {
            // 휠을 아래로 내렸을 때
            currentY += scrollAmount;
        } else {
            // 휠을 위로 올렸을 때
            currentY -= scrollAmount;
        }

        // 스크롤 위치를 업데이트
        cateScrollArea.current.scrollTop = currentY;

        // 이전 스크롤 위치 업데이트
        previousY = currentY;
    };

    useEffect(() => {
        cateScrollArea.current.addEventListener("wheel", cateScrollMove);
    }, [])
    // catelist scroll event

    return (

        <div className='content_area'>
            <div className='cate_list_pos' ref={cateScrollArea} >
                <ul className='cate_list' ref={cateScrollPos}>
                    {
                        cateListData.map(function (a, i) {
                            return (
                                <li key={i}>
                                    <CategoryList cate={a}></CategoryList>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>

    )

    function CategoryList({ cate }) {

        const [cateActive, cateActiveStyle] = useState(false);
        const cateClick = () => {
            cateActiveStyle(!cateActive);
            if (!cateActive) {
                cateActiveStyle('active');
            } else {
                cateActiveStyle('');
            }

        };

        return (
            <span className={`${cateActive ? "active" : ""}`} onClick={cateClick}>{cate}</span>
        )
    }


}

export default Category;