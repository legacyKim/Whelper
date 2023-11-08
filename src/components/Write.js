import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom';

import { writeListDataAdd } from "../store.js"
import '../css/style.css';

function Write() {

    const writeListState = useSelector((state) => state.WriteData);

    const newTitle = useRef();
    const newSubTitle = useRef();
    const newContent = useRef();

    const [popupActive, popupActiveStyle] = useState(false);
    const popupClick = () => {
        popupActiveStyle(!popupActive);
        if (!popupActive) {
            popupActiveStyle('active');
        } else {
            popupActiveStyle('');
        }
    };

    let cateListData = useSelector((state) => state.cateData);
    const [keywordArr, setKeywordArr] = useState([]);

    const dispatch = useDispatch();
    const WriteSaveBtn = () => {
        const id = writeListState.length;
        const title = newTitle.current.value;
        const subTitle = newSubTitle.current.value;
        const content = newContent.current.value;
        const keyword = keywordArr;
        const date = new Date();

        dispatch(writeListDataAdd({ id, title, subTitle, content, keyword, date }));
    };
    const recentId = writeListState.length;

    return (
        <div className='Write'>
            <input type="text" placeholder="TITLE" className="write_title" ref={newTitle}></input>
            <input type="text" placeholder="SUBTITLE" className="write_subtitle" ref={newSubTitle}></input>
            <textarea type="text" placeholder="CONTENT" className="scroll write_textarea" ref={newContent}></textarea>
            <div className='page_btn'>
                <button className='icon-ok-circled write_btn_save' onClick={() => { popupClick(); }}></button>
            </div>

            {/* category popup */}
            <div className={`popup ${popupActive ? popupActive : ""}`}>
                <div className='popup_cate'>
                    {
                        cateListData.map(function (a, i) {
                            return (
                                <div key={i}>
                                    <CateListFac i={i}></CateListFac>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='page_btn'>
                    <Link to={`/components/WriteView/${recentId}`} className='icon-ok-circled write_btn_save' onClick={() => { WriteSaveBtn(); }}></Link>
                </div>
            </div>
        </div>
    )

    function CateListFac({ i }) {

        const [cateActive, cateActiveStyle] = useState(false);
        const cateClick = () => {
            cateActiveStyle(!cateActive);
            if (!cateActive) {
                cateActiveStyle(true);
                setKeywordArr((prevKeywordArr) => [...prevKeywordArr, cateListData[i]]);
            } else {
                cateActiveStyle(false);
            }
        };

        return (
            <span className={`${cateActive ? "active" : ""}`} onClick={cateClick}>{cateListData[i]}</span>
        )

    }

}

export default Write;