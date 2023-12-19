import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { createEditor, Transforms, Node } from 'slate';
import { jsx } from 'slate-hyperscript'

import '../css/style.css';

const deserialize = (el, markAttributes = {}) => {

    if (el.nodeType === Node.TEXT_NODE) {
        return jsx('text', markAttributes, el.textContent)
    } else if (el.nodeType !== Node.ELEMENT_NODE) {
        return null
    }

    const nodeAttributes = { ...markAttributes }

    switch (el.nodeName) {
        case 'bold':
            nodeAttributes.bold = true;
            break;
        case 'highlight':
            nodeAttributes.highlight = true;
            break;
    }

    const children = Array.from(el.childNodes)
        .map(node => deserialize(node, nodeAttributes))
        .flat()

    if (children.length === 0) {
        children.push(jsx('text', nodeAttributes, ''))
    }

    switch (el.nodeName) {
        case 'bold':
            return jsx('element', { type: 'bold' }, children)
        case 'highlight':
            return jsx('element', { type: 'highlight' }, children)
        default:
            return children
    }
};

function WriteView() {

    const writeListState = useSelector((state) => state.WriteData);
    let { id } = useParams();

    const [writeContent, setWriteContent] = useState(writeListState[id]);

    console.log(writeContent);

    const [titleEditor] = useState(() => withReact(createEditor()))
    const [subTitleEditor] = useState(() => withReact(createEditor()))
    const [editor] = useState(() => withReact(createEditor()))

    const titleValue = useMemo(() => deserialize(writeContent.title), [writeContent.title])
    const subTitleValue = useMemo(() => deserialize(writeContent.subTitle), [writeContent.subTitle])
    const contentValue = useMemo(() => deserialize(writeContent.content), [writeContent.content])

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