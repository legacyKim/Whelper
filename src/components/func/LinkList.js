import React, { useState, useEffect } from 'react';
import LinkCheck from '../hook/LinkCheck.js'

function LinkList({ editor, linkList, setLinkList, linkListBtn, setLinkListBtn, setAnnoListBtn, setMemoInWriteBtn }) {

    var editorCheck;

    if (!(editor instanceof Document)) {
        editorCheck = editor.children;
    } else {
        editorCheck = editor;
    }

    useEffect(() => {
        if (editor !== null){
            const links = LinkCheck(editor);
            setLinkList(links);
        }
    }, [editorCheck]);

    useEffect(() => {
        setLinkListBtn(false);
    }, []);

    const linkListBtnActive = () => {
        if (linkListBtn === true) {
            setLinkListBtn(false);
        } else {
            setLinkListBtn(true);

            setAnnoListBtn(false);
            setMemoInWriteBtn(false);
        }
    }

    const area = document.querySelector('.link_list');
    const [listWidth, setListWidth] = useState(266);

    let x = 0;

    const mouseDownHandler = function (e) {

        x = e.clientX;

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {

        const dx = e.clientX - x;
        const newLinkListWidth = listWidth - dx;

        area.style.minWidth = `${newLinkListWidth}px`;
        area.style.maxWidth = `${newLinkListWidth}px`;
        area.style.right = `-${newLinkListWidth}px`;
    };

    const mouseUpHandler = function () {
        setListWidth(area.getBoundingClientRect().width);
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    return (
        <div className={`link_list ${linkListBtn === true ? 'active' : ''}`}>

            <button className="link_list_btn" onClick={linkListBtnActive}>
                <i className='icon-link'></i>
            </button>

            {linkListBtn === true && (
                <button className="link_wide" onMouseDown={mouseDownHandler}>
                    <i className='icon-resize-horizontal'></i>
                </button>
            )}

            <ul className="link_list_box scroll">

                {
                    linkList.map(function (link, i) {
                        return (
                            <li key={i}>
                                <a href={link.url} target="_blank">
                                    <span className="link_text">{link.text}</span>
                                    <span className="link_url">{link.url}</span>
                                </a>
                                <p>{link.explain}</p>
                            </li>
                        )
                    })
                }
            </ul>

        </div>
    );
}

export default LinkList;