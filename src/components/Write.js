import React, { useRef, useState } from 'react';
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
        const date = new Date();

        dispatch(writeListDataAdd({ id, title, subTitle, content, date }));
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

            <CateSelect></CateSelect>

        </div>
    )

    function CateSelect() {

        let cateListData = useSelector((state) => state.cateData);

        return (
            <div className='popup'>
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
                <div className='popup_btn'>

                </div>
            </div>
        )

        function CateListFac({ i }) {

            const [testArr, setTestArr] = useState([]);

            const [cateActive, cateActiveStyle] = useState(false);
            const cateClick = () => {
                cateActiveStyle(!cateActive);
                if (!cateActive) {
                    cateActiveStyle('active');
                } else {
                    cateActiveStyle('');
                }

                setTestArr(cateListData[i])

            };

            return (
                <span className={`${cateActive ? "active" : ""}`} onClick={cateClick}>{cateListData[i]}</span>
            )

        }

    }

}

export default Write;