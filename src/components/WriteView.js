import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { createEditor, Transforms, Node } from 'slate';
import { jsx } from 'slate-hyperscript'

import '../css/style.css';

const deserialize = (el, markAttributes = {}) => {

    if (el.nodeType === 3) {
        return jsx('text', markAttributes, el.textContent)
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
            }
            break;
    }

    const children = Array.from(el.childNodes)
        .map(node => deserialize(node, { ...nodeAttributes }))
        .flat()

    if (children.length === 0) {
        children.push(jsx('text', nodeAttributes, ''))
    }

    switch (el.nodeName) {
        case 'BODY':
            return jsx('fragment', {}, children)
        case 'P':
            return jsx('element', { type: 'paragraph' }, children)
        default:
            return children
    }

}

function WriteView() {

    const writeListState = useSelector((state) => state.WriteData);
    let { id } = useParams();

    const [writeContent, setWriteContent] = useState(writeListState[id]);

    const [titleEditor] = useState(() => withReact(createEditor()))
    const [subTitleEditor] = useState(() => withReact(createEditor()))
    const [editor] = useState(() => withReact(createEditor()))

    const titleDoc = new DOMParser().parseFromString(writeContent.title, 'text/html');
    const subTitleDoc = new DOMParser().parseFromString(writeContent.subTitle, 'text/html');
    const contentDoc = new DOMParser().parseFromString(writeContent.content, 'text/html');

    const titleValue = deserialize(titleDoc.body);
    const subTitleValue = deserialize(subTitleDoc.body);
    const contentValue = deserialize(contentDoc.body);

    console.log(contentValue);

    return (

        <div className='view_page'>
            <div className='common_page'>
                <div className='content_area'>
                    <div className='view_content'>

                        <Slate editor={titleEditor} initialValue={titleValue}>
                            <Editable className="title" readOnly />
                        </Slate>

                        <Slate editor={subTitleEditor} initialValue={subTitleValue}>
                            <Editable className="subtitle" readOnly />
                        </Slate>

                        <Slate editor={editor} initialValue={contentValue}>
                            <Editable className="content" readOnly />
                        </Slate>

                        <div className='write_keyword_view'>
                            {writeContent.keyword.map((k, j) => (
                                <WriteKeyword key={j} writeListKeyword={k} />
                            ))}
                        </div>
                    </div>
                    <button className='page_btn'>
                        <Link className='icon-edit-alt' to={`/components/WriteCorrect/${id}`} />
                    </button>
                </div>
            </div>
        </div>
    );

    function WriteKeyword({ writeListKeyword }) {
        return <Link to={`/components/Category/${writeListKeyword}`}>#{writeListKeyword}</Link>
    }

}

export default WriteView;