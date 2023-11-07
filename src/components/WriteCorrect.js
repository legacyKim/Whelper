import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { writeListDataUpdate } from "../store.js"

import { useParams, Link, useNavigate } from 'react-router-dom';

import '../css/style.css';

function WriteCorrect() {

    const navigate = useNavigate();

    const writeListState = useSelector((state) => state.WriteData);
    let { id } = useParams();

    const [popupActive, popupActiveStyle] = useState(false);
    const popupClick = () => {
        popupActiveStyle(!popupActive);
        if (!popupActive) {
            popupActiveStyle('active');
        } else {
            popupActiveStyle('');
        }
    };

    const dispatch = useDispatch();
    const newTitle = useRef();
    const newSubTitle = useRef();
    const newContent = useRef();

    let cateListData = useSelector((state) => state.cateData);
    const [keywordArr, setKeywordArr] = useState(writeListState[id].keyword);

    const WriteCorrectBtn = () => {
        const updateTitle = newTitle.current.value;
        const updateSubTitle = newSubTitle.current.value;
        const updateContent = newContent.current.value;
        const updateKeyword = keywordArr;

        dispatch(writeListDataUpdate({ id, updateTitle, updateSubTitle, updateContent, updateKeyword }));
    };

    return (
        <div className='Write'>
            <input type="text" placeholder="TITLE" className="write_title" defaultValue={writeListState[id].title} ref={newTitle}></input>
            <input type="text" placeholder="SUBTITLE" className="write_subtitle" defaultValue={writeListState[id].subTitle} ref={newSubTitle}></input>
            <textarea type="text" placeholder="CONTENT" className="write_textarea" defaultValue={writeListState[id].content} ref={newContent}></textarea>
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
                    <Link to="/components/WriteList" className='icon-ok-circled write_btn_save' onClick={() => { navigate('/components/WriteList'); WriteCorrectBtn(); }}></Link>
                </div>
            </div>
        </div>
    )

    function CateListFac({ i }) {

        const [cateActive, cateActiveStyle] = useState(false);
        const cateClick = () => {
            cateActiveStyle(!cateActive);
            if (!cateActive) {
                cateActiveStyle('active');
                setKeywordArr((prevKeywordArr) => [...prevKeywordArr, cateListData[i]]);
            } else {
                cateActiveStyle('');
            }

        };

        return (
            <span className={`${cateActive ? "active" : ""}`} onClick={cateClick}>{cateListData[i]}</span>
        )

    }

}

export default WriteCorrect;