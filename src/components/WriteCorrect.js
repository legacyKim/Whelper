import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux"

import { syncWriteListData, syncWriteListDataUpdate } from "../data/reducers.js"
import { cateListData, writeListDataUpdate } from '../data/api.js';

import { createEditor, Editor, Text, Element as SlateElement, Node, } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'
import escapeHtml from 'escape-html'

import { useParams, Link, useNavigate } from 'react-router-dom';

// slate editor
const CustomEditor = {

    isBoldMarkActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.bold === true : false
    },

    isUnderlineActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.underline === true : false
    },

    isHighlightActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.highlight === true : false
    },

    isQuote(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.isQuote === true : false
    },

    isAnnotation(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.isAnnotation === true : false
    },

    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'bold')
        } else {
            Editor.addMark(editor, 'bold', true)
        }
    },

    toggleUnderline(editor) {
        const isActive = CustomEditor.isUnderlineActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'underline')
        } else {
            Editor.addMark(editor, 'underline', true)
        }
    },

    toggleHighlight(editor) {
        const isActive = CustomEditor.isHighlightActive(editor);
        if (isActive) {
            Editor.removeMark(editor, 'highlight');
        } else {
            Editor.addMark(editor, 'highlight', true);
        }
    },

    toggleQuote(editor) {
        const isActive = CustomEditor.isQuote(editor);
        if (isActive) {
            Editor.removeMark(editor, 'quote');
        } else {
            Editor.addMark(editor, 'quote', true);
        }
    },

    toggleAnnotaion(editor) {
        const isActive = CustomEditor.isAnnotation(editor);
        if (isActive) {
            Editor.removeMark(editor, 'annotation');
        } else {
            Editor.addMark(editor, 'annotation', true);
        }
    },

}
//// slate editor

// serial, deserial
const serialize = nodes => {

    return nodes.map(node => {

        if (Text.isText(node)) {
            let string = escapeHtml(node.text);
            if (node.bold) {
                string = `<strong>${string}</strong>`;
            } else if (node.highlight) {
                string = `<span class="editor_highlight">${string}</span>`;
            } else if (node.underline) {
                string = `<span class="editor_underline">${string}</span>`
            } else if (node.quote) {
                string = `<span class="editor_quote">${string}</span>`
            } else if (node.annotation) {
                string = `<span class="editor_annotation">${string}</span>`
            }
            return string;
        }

        const children = serialize(node.children);

        switch (node.type) {
            case 'bold':
                return `<strong>${children}</strong>`;
            case 'underline':
                return `<span class="editor_underline">${children}</span>`;
            case 'highlight':
                return `<span class="editor_highlight">${children}</span>`;
            case 'quote':
                return `<span class="editor_quote">${children}</span>`;
            case 'annotation':
                return `<span class="editor_annotation">${children}</span>`;
            case 'paragraph':
                return `<p>${children}</p>`;
            default:
                return children;
        }


    }).join('');

};

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
            } else if (el.classList.contains('editor_annotation')) {
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
//// serial, deserial

function WriteCorrect() {

    let { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(syncWriteListData());
        dispatch(cateListData());
    }, [dispatch]);

    const writeListState = useSelector((state) => state.WriteData);
    const cateListState = useSelector((state) => state.cateData);

    const writeListArr = writeListState.data.write || [];
    const writeListCheck = (id) => {
        for (var i = 0; i < writeListArr.length; i++) {
            if (writeListArr[i].id === Number(id)) {
                return writeListArr[i];
            }
        }
    };
    const cateListArr = cateListState.data.cate || [];

    const [popupActive, popupActiveStyle] = useState(false);
    const popupClick = () => {
        popupActiveStyle(!popupActive);
        if (!popupActive) {
            popupActiveStyle('active');
        } else {
            popupActiveStyle('');
        }
    };

    const [titleEditor] = useState(() => withReact(createEditor()))
    const [subTitleEditor] = useState(() => withReact(createEditor()))
    const [editor] = useState(() => withReact(createEditor()))
    const [annoEditor] = useState(() => withReact(createEditor()))

    const [writeContent, setWriteContent] = useState(() => writeListCheck(id));

    const titleDoc = new DOMParser().parseFromString(writeContent.title,'text/html');
    const subTitleDoc = new DOMParser().parseFromString(writeContent.subTitle, 'text/html');
    const contentDoc = new DOMParser().parseFromString(writeContent.content, 'text/html');
    const keywordsParse = (writeContent !== undefined) ? JSON.parse(writeContent.keywords) : [];

    const titleValue = deserialize(titleDoc.body);
    const subTitleValue = deserialize(subTitleDoc.body);
    const contentValue = deserialize(contentDoc.body);

    const contentPlaceholder = [
        {
            type: 'paragraph',
            children: [{ text: '' }],
        },
    ];
    //// initial value....

    const renderElement = useCallback(({ attributes, children, element }) => {
        switch (element.type) {
            case 'bold':
                return <strong {...attributes} style={{ fontWeight: 'bold' }}>{children}</strong>
            case 'underline':
                return <span {...attributes} className='editor_underline' style={{ textDecoration: 'underline', textUnderlinePosition: 'from-font' }}>{children}</span>
            case 'highlight':
                return <span {...attributes} className='editor_highlight'>{children}</span>
            case 'quote':
                return <span {...attributes} className='editor_quote'>{children}</span>
            case 'annotation':
                return <span {...attributes} className='editor_annotation'>{children}</span>
            default:
                return <p {...attributes}>{children}</p>;
        }
    }, [])

    const renderLeaf = useCallback(({ attributes, children, leaf }) => {

        let style = {};
        if (leaf.bold) {
            style.fontWeight = 'bold';
        }
        if (leaf.highlight) {
            style.backgroundColor = 'linear-gradient(to top, rgba(255, 243, 150, 0.6) 95%, transparent 100%)';
        }
        if (leaf.underline) {
            style.textDecoration = 'underline';
            style.textUnderlinePosition = 'under';
        }

        return (
            <span  {...attributes}
                style={style}
                className={`${leaf.highlight ? 'editor_highlight' : ''} ${leaf.underline ? 'editor_underline' : ''}`}>
                {children}
            </span>
        );

    }, []);
    //// slate text editor

    const [keywordArr, setKeywordArr] = useState(keywordsParse);

    // content and local storage change
    const [edTitle, setEdTitle] = useState(titleValue);
    const [edSubTitle, setEdSubTitle] = useState(subTitleValue);
    const [edAnno, setEdAnno] = useState(contentValue);
    const [editorValue, setEditorValue] = useState(contentValue);
    //// content and local storage change

    const WriteCorrectBtn = () => {

        const id = writeContent.id;

        const titleString = serialize(edTitle);
        const title = titleString;

        const subTitleString = serialize(edSubTitle);
        const subTitle = subTitleString;

        const contentString = serialize(editorValue);
        const content = contentString;

        const keywords = JSON.stringify(keywordArr);

        const now = new Date();
        const update_time = new Date(now.getTime() + (9 * 60 * 60 * 1000)).toISOString();

        dispatch(syncWriteListDataUpdate({ id, title, subTitle, content, keywords, update_time }));
        dispatch(writeListDataUpdate({ id, title, subTitle, content, keywords, update_time }))

        setEdTitle(contentPlaceholder);
        setEdSubTitle(contentPlaceholder);
        setEditorValue(contentPlaceholder);

    };

    // toolbar
    const [toolbarActive, setToolbarActive] = useState(false);
    const toolbarOpen = (e) => {
        e.preventDefault();
        setToolbarActive('active');

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const editorBtnPos = document.querySelector('.editor_btn');

        if (editorBtnPos) {
            editorBtnPos.style.top = mouseY + 'px';
            editorBtnPos.style.left = mouseX + 'px';
        }
    };

    const toolbarClose = (e) => {
        setToolbarActive('');
    }
    //// toolbar

    return (
        <div className='Write'>

            <Slate
                editor={titleEditor}
                initialValue={titleValue}
                onChange={value => {
                    const isAstChange = titleEditor.operations.some(
                        op => 'set_selection' !== op.type
                    )
                    if (isAstChange) {
                        setEdTitle(value)
                    }
                }}>
                <Editable className='write_title'
                    placeholder="Title"
                    editor={titleEditor} />
            </Slate>

            <Slate
                editor={subTitleEditor}
                initialValue={subTitleValue}
                onChange={value => {
                    const isAstChange = subTitleEditor.operations.some(
                        op => 'set_selection' !== op.type
                    )
                    if (isAstChange) {
                        setEdSubTitle(value)
                    }
                }}>
                <Editable className='write_subtitle'
                    placeholder="Sub Title"
                    editor={subTitleEditor} />
            </Slate>

            <Slate
                editor={editor}
                initialValue={contentValue}
                onChange={value => {
                    const isAstChange = editor.operations.some(
                        op => 'set_selection' !== op.type
                    )
                    if (isAstChange) {
                        setEditorValue(value)
                    }
                }}>

                <div className={`editor_btn ${toolbarActive ? toolbarActive : ""}`}>
                <button className='icon-gwallet'
                        onMouseDown={event => {
                            event.preventDefault();
                            CustomEditor.toggleHighlight(editor);
                            toolbarClose();
                        }}>
                    </button>
                    <button className='icon-bold'
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleBoldMark(editor)
                            toolbarClose();
                        }}>
                    </button>
                    <button className='icon-underline'
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleUnderline(editor)
                            toolbarClose();
                        }}>
                    </button>
                    <button className='icon-quote'
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleQuote(editor)
                            toolbarClose();
                        }}>
                    </button>
                    <button className='icon-list-bullet'
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleAnnotaion(editor)
                            toolbarClose();
                        }}>
                    </button>
                </div>

                <Editable className='write_content scroll' onContextMenu={toolbarOpen} onClick={toolbarClose}
                    placeholder="작은 것들도 허투로 생각하지 말지어다. 큰 것들도 최초에는 작았다."
                    editor={editor}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={event => {
                        toolbarClose()
                        if (!event.ctrlKey) {
                            return
                        }
                        switch (event.key) {

                            case 'b': {
                                event.preventDefault()
                                CustomEditor.toggleBoldMark(editor)
                                break
                            }

                            case 'h': {
                                event.preventDefault();
                                CustomEditor.toggleHighlight(editor);
                                break
                            }

                            case 'a': {
                                event.preventDefault();
                                CustomEditor.toggleAnnotation(editor);
                                break
                            }

                        }
                    }}
                />
            </Slate>

            <div className='page_btn'>
                <Link to={`/components/WriteView/${writeContent.id}`} onClick={() => { navigate(`/components/WriteView/${writeContent.id}`) }} className='icon-reply'></Link>
                <button className='icon-ok-circled write_btn_save' onClick={() => { popupClick(); }}></button>
            </div>

            {/* category popup */}
            <div className={`popup ${popupActive ? popupActive : ""}`}>
                <div className='popup_cate'>
                    {
                        cateListArr.map(function (a, i) {
                            return (
                                <div key={i}>
                                    <CateListFac i={i} keywordArr={keywordArr} setKeywordArr={setKeywordArr}></CateListFac>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='page_btn'>
                    <button className="write_btn_back icon-reply" onClick={popupClick}></button>
                    <Link className='icon-ok-circled write_btn_save' to={`/components/WriteView/${writeContent.id}`} onClick={() => { navigate(`/components/WriteView/${writeContent.id}`); WriteCorrectBtn(); }}></Link>
                </div>
            </div>
        </div>
    )

    function CateListFac({ i, keywordArr, setKeywordArr }) {

        const category = cateListArr[i].category
        const [cateActive, setCateActive] = useState(keywordArr.includes(category));
        const cateClick = () => {
            setKeywordArr((prevKeywordArr) =>
                keywordArr.includes(category)
                    ? prevKeywordArr.filter((item) => item !== category)
                    : [...prevKeywordArr, category]
            );

            setCateActive((prevCateActive) => !prevCateActive);
        };

        return (
            <span className={`${cateActive ? "active" : ""}`} onClick={cateClick}>{category}</span>
        )

    }

}

export default WriteCorrect;