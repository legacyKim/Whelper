
import { React, useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"

import '../css/style.css';

function Category() {

    let cateListData = useSelector((state) => state.cateData);

    // catelist scroll event
    const [cateScroll, cateScrollPos] = useState(0);
    var cateScrollArea = useRef();

    const cateScrollMove = () => {
        cateScrollPos(cateScrollArea.current.scrollTop);
        console.log(cateScrollArea);
        console.log(cateScrollArea.current);
        console.log(cateScrollArea.current.scrollTop);
    };

    useEffect(() => {
        cateScrollArea.addEventListener('scroll', cateScrollMove);
        console.log(cateScroll);
    }, [cateScroll]);
    // catelist scroll event

    return (

        <div className='content_area'>
            <div className='cate_list_pos'>
                <ul className='cate_list' ref={cateScrollArea}>
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