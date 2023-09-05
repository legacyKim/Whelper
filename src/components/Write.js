import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { writeListDataCorrect } from "../store.js"
import '../css/style.css';

function Write() {

    const writeListState = useSelector((state) => state.WriteData);

    const dispatch = useDispatch();
    const newTitle = useRef();
    const newSubTitle = useRef();
    const newContent = useRef();

    const WriteSaveBtn = () => {
        const id = writeListState.length;
        const title = newTitle.current.value;
        const subTitle = newSubTitle.current.value;
        const content = newContent.current.value;

        dispatch(writeListDataCorrect({ id, title, subTitle, content }));
    };

    return (
        <div className='Write'>
            <input type="text" placeholder="TITLE" className="write_title" ref={newTitle}></input>
            <input type="text" placeholder="SUBTITLE" className="write_subtitle" ref={newSubTitle}></input>
            <textarea type="text" placeholder="CONTENT" className="write_textarea" ref={newContent}></textarea>
            <div className='write_page_btn'>
                <button className='write_btn_save' onClick={WriteSaveBtn}>Save</button>
            </div>
        </div>
    )
}

export default Write;