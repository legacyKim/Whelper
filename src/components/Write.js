import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux"
import WriteContentData from '../data'

import '../css/components.css';
import { Link } from 'react-router-dom';

function WriteList(props) {

    let writeListState = useSelector((state) => state.writeData)

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
                    writeListState.map(function (a, i) {
                        return (
                            <div className='WriteDiv' key={i}>
                                <WriteShowContents writeListState={writeListState[i]} i={i} />
                            </div>
                        )
                    })
                }

                {isWriteOn ? <Write writeListState={writeListState} /> : null}

            </div>
        </div>

    )

    function Write(props) {

        let [fade, setFade] = useState('')

        useEffect(() => {
            const fadeTimer = setTimeout(() => { setFade('showThis') }, 100)
            return () => {
                clearTimeout(fadeTimer);
                setFade('')
            }
        }, []);

        // UPDATE
        const updateWriteListData = (id, newTitle, newSubTitle, newContent) => {
            swtWriteListData(prevData =>
                prevData.map(item =>
                    item.id === id ? { ...item, title: newTitle, subTitle: newSubTitle, content: newContent } : item
                )
            );
        };

        const addData = () => {
            const newData = {
                title: newTitle.current.value,
                subTitle: newSubTitle.current.value,
                content: newContent.current.value,
            };
            swtWriteListData(prevData => [...prevData, newData]);
            WriteOn()
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

    function WriteShowContents(props) {

        return (

            <Link to={`/components/View/${props.writeListState.id}`}>
                <div className='write_list'>
                    <div className='write_list_btn'>
                        <button></button>
                        <button></button>
                    </div>
                    <span>{props.writeListState.title}</span>
                    <strong>{props.writeListState.subTitle}</strong>
                    <p>{props.writeListState.content}</p>
                </div>
            </Link>

        )

    }
}



export default WriteList;