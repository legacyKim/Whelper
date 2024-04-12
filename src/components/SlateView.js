import React, { useState, useMemo, useCallback, useEffect } from 'react'
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

const ViewEdit = ({ titleDoc, subTitleDoc, contentDoc }) => {

    console.log(titleDoc)

    const [titleEditor] = useState(() => withReact(createEditor()))
    const [subTitleEditor] = useState(() => withReact(createEditor()))
    const [editor] = useState(() => withReact(createEditor()))

    const lsTitleValue = JSON.parse(localStorage.getItem('view_title')) || undefined
    const lsSubTitleValue = JSON.parse(localStorage.getItem('view_subTitle')) || undefined
    const lsContentValue = JSON.parse(localStorage.getItem('view_content')) || undefined

    const titleValue = titleDoc !== null ? deserialize(titleDoc.body) : lsTitleValue
    const subTitleValue = subTitleDoc !== null ? deserialize(subTitleDoc.body) : lsSubTitleValue
    const contentValue = contentDoc !== null ? deserialize(contentDoc.body) : lsContentValue

    localStorage.setItem('view_title', JSON.stringify(titleValue));
    localStorage.setItem('view_subTitle', JSON.stringify(subTitleValue));
    localStorage.setItem('view_content', JSON.stringify(contentValue));

    const renderElement = useCallback(({ attributes, children, element }) => {
        switch (element.type) {
            case 'bold':
                return <strong {...attributes} style={{ fontWeight: 'bold' }}>{children}</strong>
            case 'highlight':
                return <span className='editor_highlight' {...attributes}>{children}</span>
            default:
                return <p {...attributes}>{children}</p>;
        }
    }, [])

    const renderLeaf = useCallback(({ attributes, children, leaf }) => {
        const style = {
            fontWeight: leaf.bold ? 'bold' : 'normal',
            backgroundColor: leaf.highlight ? true : false,
        };

        return (
            <span className={style.backgroundColor == true ? 'editor_highlight' : ''}
                {...attributes}
                style={style}>
                {children}
            </span>
        );
    }, []);

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