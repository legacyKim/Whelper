import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { writeListDataUpdate } from "../store.js"

import { useParams, Link, useNavigate } from 'react-router-dom';

import '../css/style.css';

function WriteCorrect() {

    const navigate = useNavigate();

    const writeListState = useSelector((state) => state.WriteData);
    let { id } = useParams();

    const dispatch = useDispatch();
    const newTitle = useRef();
    const newSubTitle = useRef();
    const newContent = useRef();

    const WriteCorrectBtn = () => {
        const updateTitle = newTitle.current.value;
        const updateSubTitle = newSubTitle.current.value;
        const updateContent = newContent.current.value;

        dispatch(writeListDataUpdate({ id, updateTitle, updateSubTitle, updateContent }));
    };

    return (
        <div className='Write'>
            <input type="text" placeholder="TITLE" className="write_title" defaultValue={writeListState[id].title} ref={newTitle}></input>
            <input type="text" placeholder="SUBTITLE" className="write_subtitle" defaultValue={writeListState[id].subTitle} ref={newSubTitle}></input>
            <textarea type="text" placeholder="CONTENT" className="write_textarea" defaultValue={writeListState[id].content} ref={newContent}></textarea>
            <div className='page_btn'>
                <Link to="/components/WriteList" className='icon-ok-circled write_btn_save' onClick={() => { navigate('/components/WriteList'); WriteCorrectBtn(); }}></Link>
            </div>
        </div>
    )
}

export default WriteCorrect;