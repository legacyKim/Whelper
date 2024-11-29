import React, { useRef, useEffect, useState, useContext } from 'react';
import { useLocation } from "react-router-dom";

import MyContext from '../context';
import LinkCheck from './hook/LinkCheck.js'

function LinkPopup({ linkList, setLinkList, setLinkActive, editor, CustomEditor }) {

    const location = useLocation();
    const { mode, setMode } = useContext(MyContext);

    useEffect(() => {
        if (window.location.pathname.includes('Correct')) {
            setMode('correct');
        } else {
            setMode('write');
        };
    }, []);

    var editorCheck;
    if (!(editor.children instanceof HTMLCollection)) {
        editorCheck = editor.children;
    } else {
        editorCheck = editor;
    }

    useEffect(() => {
        const links = LinkCheck(editor);
        setLinkList(links);
    }, [editorCheck]);

    const linkUrl = useRef();
    const linkExplain = useRef();

    const [textAreaHeight, setTextAreaHeight] = useState();
    useEffect(() => {
        if (textAreaHeight !== undefined) {
            linkExplain.current.style.height = textAreaHeight + 'px';
        }
    }, [textAreaHeight]);

    const textareaChange = (e) => {
        linkExplain.current.style.height = 'auto'; //height 초기화
        linkExplain.current.style.height = linkExplain.current.scrollHeight + 'px';
    }

    return (
        <div className={`modal`}>
            <div className="modal_box">
                <span>링크를 입력해 주세요.</span>
                <input type="text" ref={linkUrl} placeholder='url' />
                <textarea ref={linkExplain} placeholder='explain' onChange={(e) => {
                    textareaChange(e);
                }}></textarea>
                <div className="btn_wrap">
                    <button onClick={() => {

                        const linkUrlValue = linkUrl.current.value;
                        const linkExplainValue = linkExplain.current.value;

                        if (linkUrlValue !== '') {
                            const isDuplicate = linkList.some(link => link.url === linkUrlValue);
                            if (!isDuplicate) {
                                const isUrlCheck = CustomEditor.toggleLink(editor, linkUrlValue, linkExplainValue, mode);

                                if (isUrlCheck === true) {
                                    setLinkActive(false);
                                }

                            } else {
                                alert("이미 존재하는 링크입니다.");
                            }

                        } else {
                            alert("링크를 입력해 주세요.")
                            return;
                        }

                    }}>저장</button>
                    <button onClick={() => {
                        setLinkActive(false)
                    }}>취소</button>
                </div>
            </div>
        </div>
    )

}

export default LinkPopup;