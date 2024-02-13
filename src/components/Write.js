import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom';

import { writeListDataAdd } from "../store.js"

import { createEditor, Editor, Transforms, Text, Element as SlateElement, Node, } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'
import escapeHtml from 'escape-html'

// slate editor
const CustomEditor = {

    isBoldMarkActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.bold === true : false
    },

    isHighlightActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.highlight === true : false
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

    toggleHighlight(editor) {
        const isActive = CustomEditor.isHighlightActive(editor);
        if (isActive) {
            Editor.removeMark(editor, 'highlight');
        } else {
            Editor.addMark(editor, 'highlight', true);
        }
    },

    toggleAnnotation(editor) {
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
            }
            return string;
        }

        const children = serialize(node.children);

        switch (node.type) {
            case 'bold':
                return `<strong>${children}</strong>`;
            case 'highlight':
                return `<span class="editor_highlight">${children}</span>`;
            case 'paragraph':
                return `<p>${children}</p>`;
            default:
                return children;
        }
    }).join('');
    
};
//// serial, deserial

function Write() {

    const writeListState = useSelector((state) => state.WriteData);

    // category popup
    const [popupActive, popupActiveStyle] = useState(false);
    const popupClick = () => {
        popupActiveStyle(!popupActive);
        if (!popupActive) {
            popupActiveStyle('active');
        } else {
            popupActiveStyle('');
        }
    };
    //// category popup

    // slate text editor
    const [titleEditor] = useState(() => withReact(createEditor()))
    const [subTitleEditor] = useState(() => withReact(createEditor()))
    const [editor] = useState(() => withReact(createEditor()))
    const [annoEditor] = useState(() => withReact(createEditor()))

    const writeTitleLocal = localStorage.getItem('writeTitle');
    const writeSubTitleLocal = localStorage.getItem('writeSubTitle');
    const writeContentLocal = localStorage.getItem('writeContent');
    const contentPlaceholder = [
        {
            type: 'paragraph',
            children: [{ text: '' }],
        },
    ];

    // initial value...
    const titleValue = useMemo(() => {
        const parsedContent = writeTitleLocal !== null ? JSON.parse(writeTitleLocal) : contentPlaceholder;
        return parsedContent;
    }, []);

    const subTitleValue = useMemo(() => {
        const parsedContent = writeSubTitleLocal !== null ? JSON.parse(writeSubTitleLocal) : contentPlaceholder;
        return parsedContent;
    }, []);

    const contentValue = useMemo(() => {
        const parsedContent = writeContentLocal !== null ? JSON.parse(writeContentLocal) : contentPlaceholder;
        return parsedContent;
    }, []);

    const annoValue = useMemo(() => {
        const parsedContent = writeContentLocal !== null ? JSON.parse(writeContentLocal) : contentPlaceholder;
        return parsedContent;
    }, []);
    //// initial value....

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
    //// slate text editor

    // const newTitle = useRef();
    // const newSubTitle = useRef();

    let cateListData = useSelector((state) => state.cateData);
    const [keywordArr, setKeywordArr] = useState([]);

    // content and local storage change
    const [edTitle, setEdTitle] = useState(titleValue);
    localStorage.setItem('writeTitle', JSON.stringify(edTitle));

    const [edSubTitle, setEdSubTitle] = useState(subTitleValue);
    localStorage.setItem('writeSubTitle', JSON.stringify(edSubTitle));

    const [edAnno, setEdAnno] = useState(annoValue);
    localStorage.setItem('writeAnno', JSON.stringify(edAnno));

    const [editorValue, setEditorValue] = useState(contentValue);
    localStorage.setItem('writeContent', JSON.stringify(editorValue));
    //// content and local storage change

    // save content
    const dispatch = useDispatch();
    const WriteSaveBtn = () => {

        const id = writeListState.length;

        localStorage.removeItem('writeTitle');
        const titleString = serialize(edTitle);
        const title = titleString;

        localStorage.removeItem('writeSubTitle');
        const subTitleString = serialize(edSubTitle);
        const subTitle = subTitleString;

        localStorage.removeItem('writeContent');
        const contentString = serialize(editorValue);
        const content = contentString;

        const keyword = keywordArr;

        dispatch(writeListDataAdd({ id, title, subTitle, content, keyword }));

        setEdTitle(contentPlaceholder);
        setEdSubTitle(contentPlaceholder);
        setEditorValue(contentPlaceholder);

    };

    // save and keep the last num of id
    const recentId = writeListState.length;
    //// save content

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
                    editor={titleEditor}/>
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
                    editor={subTitleEditor}/>
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
                    <button className='icon-flow-cascade'
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleAnnotation(editor)
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
                <button className='icon-ok-circled write_btn_save' onClick={() => { popupClick(); }}></button>
            </div>

            {/* category popup */}
            <div className={`popup ${popupActive ? popupActive : ""}`}>
                <div className='popup_cate'>
                    {
                        cateListData.map(function (a, i) {
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
                    <Link to={`/components/WriteView/${recentId}`} className='icon-ok-circled write_btn_save' onClick={() => { WriteSaveBtn(); }}></Link>
                    {/* <button className='icon-ok-circled write_btn_save' onClick={() => { WriteSaveBtn(); }}></button> */}
                </div>
            </div>
        </div>
    )

    function CateListFac({ i, keywordArr, setKeywordArr }) {

        const [cateActive, setCateActive] = useState(keywordArr.includes(cateListData[i]));
        const cateClick = () => {
            setKeywordArr((prevKeywordArr) =>
                keywordArr.includes(cateListData[i])
                    ? prevKeywordArr.filter((item) => item !== cateListData[i])
                    : [...prevKeywordArr, cateListData[i]]
            );

            setCateActive((prevCateActive) => !prevCateActive);
        };

        return (
            <span className={`${cateActive ? "active" : ""}`} onClick={cateClick}>{cateListData[i]}</span>
        )

    }

    function Annotation() {

        return (
            <div className='annotation'>
                <Slate
                    editor={titleEditor}
                    initialValue={titleValue}
                    onChange={value => {
                        const isAstChange = titleEditor.operations.some(
                            op => 'set_selection' !== op.type
                        )
                        if (isAstChange) {
                            // Save the value to Local Storage.
                            setEdTitle(value)
                        }
                    }}>
                    <Editable className='write_title'
                        placeholder="Title"
                        editor={titleEditor}
                        renderElement={renderElement}
                        renderLeaf={renderLeaf} />
                </Slate>
            </div>
        )

    }

}

export default Write;