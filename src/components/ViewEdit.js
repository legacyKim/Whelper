import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { createEditor, } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'

import MyContext from '../context';

import deserialize from './hook/deserialize.js';
import useSlateRender from './hook/useSlateRender.js';

const ViewEdit = ({ titleDoc, subTitleDoc, contentDoc }) => {

    const location = useLocation();

    const [titleEditor] = useState(() => withReact(createEditor()));
    const [subTitleEditor] = useState(() => withReact(createEditor()));
    const [editor] = useState(() => withReact(createEditor()));

    const lsTitleValue = JSON.parse(localStorage.getItem('view_title')) || null;
    const lsSubTitleValue = JSON.parse(localStorage.getItem('view_subTitle')) || null;
    const lsContentValue = JSON.parse(localStorage.getItem('view_content')) || null;

    const titleValue = titleDoc !== null ? deserialize(titleDoc.body) : lsTitleValue;
    const subTitleValue = subTitleDoc !== null ? deserialize(subTitleDoc.body) : lsSubTitleValue;
    const contentValue = contentDoc !== null ? deserialize(contentDoc.body) : lsContentValue;

    useEffect(() => {
        if (location.pathname === `/components/WriteView/${localStorage.getItem('writeId')}`) {
            localStorage.setItem('view_title', JSON.stringify(titleValue));
            localStorage.setItem('view_subTitle', JSON.stringify(subTitleValue));
            localStorage.setItem('view_content', JSON.stringify(contentValue));
        }
    }, []);

    var contentEditableFalse = true;
    const { renderElement, renderLeaf } = useSlateRender(contentEditableFalse);

    return (
        <div className='view_common'>
            <Slate editor={titleEditor} initialValue={titleValue}>
                <Editable className="title" readOnly />
            </Slate>

            <Slate editor={subTitleEditor} initialValue={subTitleValue}>
                <Editable className="subtitle" readOnly />
            </Slate>

            <Slate editor={editor} initialValue={contentValue}>
                <Editable className="content" renderElement={renderElement} renderLeaf={renderLeaf} readOnly />
            </Slate>
        </div>
    )

};

export default ViewEdit;