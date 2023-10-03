import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { useParams, Link } from 'react-router-dom';

import { writeListDataAdd } from "../store.js"
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

        dispatch(writeListDataAdd({ id, title, subTitle, content }));
    };

    const recentId = writeListState.length;

    return (
        <div className='Write'>
            <input type="text" placeholder="TITLE" className="write_title" ref={newTitle}></input>
            <input type="text" placeholder="SUBTITLE" className="write_subtitle" ref={newSubTitle}></input>
            <textarea type="text" placeholder="CONTENT" className="scroll write_textarea" ref={newContent}></textarea>
            <div className='page_btn'>
                <Link to={`/components/WriteView/${recentId}`} className='icon-ok-circled write_btn_save' onClick={() => { WriteSaveBtn(); }}></Link>
            </div>
        </div>
    )
}

export default Write;