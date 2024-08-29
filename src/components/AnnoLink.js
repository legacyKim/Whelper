import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MyContext from '../context'

import { useSelector, useDispatch } from 'react-redux';
import { syncWriteListData, syncWriteListDataUpdate } from '../data/reducers.js';

import { createEditor, Editor, Transforms, Element } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'

const deserialize = (el, markAttributes = {}) => {

    if (el.nodeType === 3) {
        return { text: el.textContent, ...markAttributes };
    } else if (el.nodeType !== 1) {
        return null
    }

    const nodeAttributes = { ...markAttributes }

    switch (el.nodeName) {
        case 'STRONG':
            nodeAttributes.bold = true
            break;
        case 'SPAN':
            if (el.classList.contains('editor_highlight')) {
                nodeAttributes.highlight = true;
            } else if (el.classList.contains('editor_underline')) {
                nodeAttributes.underline = true;
            } else if (el.classList.contains('editor_quote')) {
                nodeAttributes.quote = true;
            } else if (el.classList.contains('editor_anno')) {
                nodeAttributes.annotation = true;
            }
            break;
    }

    const children = Array.from(el.childNodes)
        .map(node => deserialize(node, { ...nodeAttributes }))
        .flat()

    if (children.length === 0) {
        children.push({ text: '', ...nodeAttributes });
    }

    switch (el.nodeName) {
        case 'BODY':
            return children;
        case 'P':
            return { type: 'paragraph', children };
        default:
            return children;
    }
}

function AnnoLink() {

    const writeListState = useSelector((state) => state.WriteData);
    var writeListArr = writeListState.data.write || [];

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(syncWriteListData());
        dispatch(syncWriteListDataUpdate());
    }, [dispatch]);

    const [writeListAnnoArr, setWriteListAnnoArr] = useState([]);
    useEffect(() => {
        const newArr = [];
        writeListArr.forEach((ele) => {
            newArr.push({ title: ele.title });

            const parsedAnno = JSON.parse(ele.anno);
            const annoId = ele.id;
            parsedAnno.forEach((annoItem) => {
                newArr.push({ anno: annoItem.content, id: annoId });
            });
        });

        setWriteListAnnoArr(newArr);
    }, [writeListArr]);

    const { annoString, setAnnoString } = useContext(MyContext);
    const annoStringParams = (e) => {
        setAnnoString(e.target.innerHTML)
    }

    return (
        <div className='common_page'>
            <div className='content_area'>
                <ul className="annolink_wrap">
                    {writeListAnnoArr.map((a, i) => (
                        <AnnoLinkShow contentArr={a} key={i} />
                    ))}
                </ul>
            </div>
        </div>

    )

    function AnnoLinkShow({ contentArr }) {

        const [writeContent] = useState(contentArr);

        const [titleEditor] = useState(() => withReact(createEditor()));
        const titleDoc = writeContent.hasOwnProperty('title')
            ? new DOMParser().parseFromString(writeContent.title, 'text/html')
            : null;
        const titleValue = titleDoc ? deserialize(titleDoc.body) : [{ text: '' }];

        const annoContent = writeContent.hasOwnProperty('anno') ? writeContent.anno : null;

        useEffect(() => {
            const annoLinkObj = document.querySelectorAll('.annolink a');
            for (var i = 0; i < annoLinkObj.length; i++) {
                annoLinkObj[i].style.setProperty('--anno-link-num', `'${i + 1} )'`);
            }
        }, []);

        useEffect(() => {
            document.querySelectorAll('.annolink a span').forEach((ele, index) => {
                if (ele.innerHTML === annoString) {
                    ele.closest('div').classList.add('active');
                }
            })
        }, [annoString]);

        return (
            <div className={`annolink ${writeContent.hasOwnProperty('title') ? 'annolink_title' : ''}`}>

                {writeContent.hasOwnProperty('title') && (
                    <Slate editor={titleEditor} initialValue={titleValue}>
                        <div className="icon-level-down annolink_dot"></div>
                        <Editable className="title" readOnly />
                    </Slate>
                )}

                {annoContent && (
                    <Link to={`/components/WriteView/${writeContent.id}`} onClick={(e) => annoStringParams(e)}>
                        <span>{annoContent}</span>
                    </Link>
                )}

            </div>
        );
    }
}

export default AnnoLink;