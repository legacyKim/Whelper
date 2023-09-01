import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux"

import '../css/components.css';
import { Link } from 'react-router-dom';

function WriteList() {

    let writeListState = useSelector((state) => state.WriteData)

    console.log(writeListState);

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

                {isWriteOn ? <Write /> : null}

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

        const newTitle = useRef();
        const newSubTitle = useRef();
        const newContent = useRef();

        const addData = () => {
            const newData = {
                title: newTitle.current.value,
                subTitle: newSubTitle.current.value,
                content: newContent.current.value,
            };
            swtWriteListData(prevData => [...prevData, newData]);
            WriteOn()
        };

        return (
            <div className={`write_page ${fade}`}>
                <div className='write_page_pos'>
                    <input type="text" placeholder="TITLE" className="write_title" ref={this.newTitle}></input>
                    <input type="text" placeholder="SUBTITLE" className="write_subtitle" ref={this.newSubTitle}></input>
                    <textarea type="text" placeholder="CONTENT" className="write_textarea" ref={this.newContent}></textarea>
                    <div className='write_page_btn'>
                        <button className='write_btn_save' onClick={() => addData(newTitle.current.value, newSubTitle.current.value, newContent.current.value)}>Save</button>
                        <button className='write_btn_cancel' onClick={WriteOn}></button>
                    </div>
                </div>
            </div>
        )
    }

    function WriteShowContents() {

        // UPDATE
        const updateWriteListData = (id, newTitle, newSubTitle, newContent) => {
            swtWriteListData(prevData =>
                prevData.map(item =>
                    item.id === id ? { ...item, title: newTitle, subTitle: newSubTitle, content: newContent } : item
                )
            );
        };

        return (

            <Link to={`/components/View/${writeListState.id}`}>
                <div className='write_list'>
                    <div className='write_list_btn'>
                        <button></button>
                        <button></button>
                    </div>
                    <span>{writeListState[i].title}</span>
                    <strong>{writeListState[i].subTitle}</strong>
                    <p>{writeListState[i].content}</p>
                </div>
            </Link>

        )

    }
}



export default WriteList;