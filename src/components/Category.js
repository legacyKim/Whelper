
import { React, useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"

import '../css/style.css';


function Category() {

    let cateListData = useSelector((state) => state.cateData);

    // catelist scroll event
    var cateScrollArea = useRef();

    // scroll direction
    const [currentY, setCruuentY] = useState(0);
    const [recentY, setRecentY] = useState(0);

    const cateScrollMove = () => {
        setCruuentY(cateScrollArea.current.scrollTop);
        const diffY = currentY - recentY;

        if (diffY === 0) {
            console.log("무시")
        } else if (diffY > 0) {
            console.log("아래로")
        } else {
            console.log("위로");
        }

    };

    const cateScrollRecent = () => {
        setRecentY(cateScrollArea.current.scrollTop);
        return recentY;
    }

    useEffect(() => {
        cateScrollArea.current.addEventListener("scroll", cateScrollMove);
        cateScrollArea.current.addEventListener("scrollend", cateScrollRecent);
    
        return () => {
            cateScrollArea.current.removeEventListener("scroll", cateScrollMove);
            cateScrollArea.current.removeEventListener("scrollend", cateScrollRecent);
        }
    }, [])

    // catelist scroll event

    return (

        <div className='content_area'>
            <div className='cate_list_pos' ref={cateScrollArea} >
                <ul className='cate_list'>
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