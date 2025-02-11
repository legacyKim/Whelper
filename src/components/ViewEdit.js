import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { createEditor, } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'

import MyContext from '../context';

import deserialize from './hook/deserialize.js';
import useSlateRender from './hook/useSlateRender.js';

const ViewEdit = ({ titleDoc, subTitleDoc, contentDoc }) => {

    const location = useLocation();

    const [editor] = useState(() => withReact(createEditor()));

    const titleValue = titleDoc;
    const subTitleValue = subTitleDoc;
    const [contentValue] = useState(contentDoc);

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
            
            <title className='write_title'>{titleValue}</title>
            <h3 className="write_subtitle">{subTitleValue}</h3>

            <Slate editor={editor} initialValue={contentValue}>
                <Editable className="content" renderElement={renderElement} renderLeaf={renderLeaf} readOnly />
            </Slate>
        </div>
    )

};

export default ViewEdit;