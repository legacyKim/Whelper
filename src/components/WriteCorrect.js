import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { writeListDataUpdate } from "../store.js"

import { useParams } from 'react-router-dom';

import '../css/style.css';

function WriteCorrect() {

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
            <div className='write_page_btn'>
                <button className='write_btn_save' onClick={WriteCorrectBtn}>Save</button>
            </div>
        </div>
    )
}

export default WriteCorrect;