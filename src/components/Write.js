import React, { useState, useEffect, useRef } from 'react';
import WriteContentData from '../data'

import '../css/components.css';
import { Link } from 'react-router-dom';

function WriteList(props) {

    let [WriteListData, swtWriteListData] = useState(WriteContentData);

    const [isWriteOn, setIsWriteOn] = useState(false);

    const WriteOn = () => {
        setIsWriteOn(!isWriteOn);
    }

    return (

        <div className='common_page'>
            <div className='content_area'>

                <div className='content_write'>
                    <button onClick={WriteOn} className='content_write_save'>글쓰기</button>
                </div>

                {
                    WriteListData.map(function (a, i) {

                        return (

                            <div className='WriteDiv' key={i}>
                                <WriteShowContents WriteListData={WriteListData[i]} i={i} />
                            </div>

                        )
                    })
                }

                {isWriteOn ? <Write WriteListData={WriteListData} /> : null}

            </div>
        </div>

    )

    function Write(props) {

        console.log(props);

        let [fade, setFade] = useState('')

        useEffect(() => {
            const fadeTimer = setTimeout(() => { setFade('showThis') }, 100)
            return () => {
                clearTimeout(fadeTimer);
                setFade('')
            }
        }, []);

        // UPDATE
        const undateWriteListData = (id, newTitle, newSubTitle, newContent) => {
            swtWriteListData(prevData => prevData.map(item => (item.id === id ? { ...item, title: newTitle, subTitle: newSubTitle, content: newContent } : item)));
        };

        const addData = (props) => {
            const newData = {
                // id: props.length + 1,
                title: newTitle,
                subTitle: newSubTitle,
                content: newContent,
            };
            swtWriteListData(prevData => [...prevData, newData]);
        };

        const newTitle = useRef();
        const newSubTitle = useRef();
        const newContent = useRef();

        return (
            <div className={`write_page ${fade}`}>
                <div className='write_page_pos'>
                    <input type="text" placeholder="TITLE" className="write_title" ref={newTitle}></input>
                    <input type="text" placeholder="SUBTITLE" className="write_subtitle" ref={newSubTitle}></input>
                    <textarea type="text" placeholder="CONTENT" className="write_textarea" ref={newContent}></textarea>
                    <div className='write_page_btn'>
                        <button className='write_btn_save' onClick={() => addData(props.WriteListData.id, newTitle.current.value, newSubTitle.current.value, newContent.current.value)}>Save</button>
                        <button className='write_btn_cancel' onClick={WriteOn}></button>
                    </div>
                </div>
            </div>
        )
    }

}

function WriteShowContents(props) {

    return (

        <Link to={`/components/View/${props.WriteListData.id}`}>
            <div className='write_list'>
                <div className='write_list_btn'>
                    <button></button>
                    <button></button>
                </div>
                <span>{props.WriteListData.title}</span>
                <strong>{props.WriteListData.subTitle}</strong>
                <p>{props.WriteListData.content}</p>
            </div>
        </Link>

    )

}

export default WriteList;
