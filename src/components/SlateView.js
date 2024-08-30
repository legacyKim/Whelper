import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { createEditor, Editor, Transforms, Element } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'

import deserialize from './hook/deserialize.js';
import useSlateRender from './hook/useSlateRender.js';

const ViewEdit = ({ titleDoc, subTitleDoc, contentDoc }) => {

    const [titleEditor] = useState(() => withReact(createEditor()));
    const [subTitleEditor] = useState(() => withReact(createEditor()));
    const [editor] = useState(() => withReact(createEditor()));

    const lsTitleValue = JSON.parse(localStorage.getItem('view_title')) || undefined;
    const lsSubTitleValue = JSON.parse(localStorage.getItem('view_subTitle')) || undefined;
    const lsContentValue = JSON.parse(localStorage.getItem('view_content')) || undefined;

    const titleValue = titleDoc !== null ? deserialize(titleDoc.body) : lsTitleValue;
    const subTitleValue = subTitleDoc !== null ? deserialize(subTitleDoc.body) : lsSubTitleValue;
    const contentValue = contentDoc !== null ? deserialize(contentDoc.body) : lsContentValue;

    localStorage.setItem('view_title', JSON.stringify(titleValue));
    localStorage.setItem('view_subTitle', JSON.stringify(subTitleValue));
    localStorage.setItem('view_content', JSON.stringify(contentValue));

    const { renderElement, renderLeaf } = useSlateRender();

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