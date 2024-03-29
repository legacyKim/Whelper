import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom';

import { syncWriteListData, syncCateListData } from "../data/reducers"
import { writeListData, writeListDataPost, cateListData, cateListDataPost } from '../data/api.js';

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

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(writeListData())
        dispatch(cateListData())
    }, [dispatch]);

    const writeListState = useSelector((state) => state.WriteData);
    const cateListState = useSelector((state) => state.cateData);

    const writeListArr = writeListState.data.write || [];
    const cateListArr = cateListState.data.cate || [];

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

    // category add popup
    const [catePopup, catePopupActive] = useState("");
    const cateAdd = () => {
        catePopupActive(!catePopup);
        if (!catePopup) {
            catePopupActive('active');
        } else {
            catePopupActive('');
        }
    }

    var cateInput = useRef(null);

    const cateSaveBtn = () => {
        console.log(cateListArr);
        const id = cateListArr;
        const category = cateInput;

        dispatch(syncCateListData({ id, category }));
    }
    //// category add popup

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
    const WriteSaveBtn = () => {

        localStorage.removeItem('writeTitle');
        const titleString = serialize(edTitle);
        const title = titleString;

        localStorage.removeItem('writeSubTitle');
        const subTitleString = serialize(edSubTitle);
        const subTitle = subTitleString;

        localStorage.removeItem('writeContent');
        const contentString = serialize(editorValue);
        const content = contentString;

        const keywords = JSON.stringify(keywordArr)

        dispatch(syncWriteListData({ title, subTitle, content, keywords }));
        dispatch(writeListDataPost({ title, subTitle, content, keywords }));

        setEdTitle(contentPlaceholder);
        setEdSubTitle(contentPlaceholder);
        setEditorValue(contentPlaceholder);

    };

    // save and keep the last num of id
    const recentId = writeListArr.length;
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
                <Editable className='write_title' placeholder="Title" editor={titleEditor} />
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
                <ul className='popup_cate'>
                    {
                        cateListArr.map(function (a, i) {
                            return (
                                <li key={i}>
                                    <CateListFac i={i} keywordArr={keywordArr} setKeywordArr={setKeywordArr}></CateListFac>
                                </li>
                            )
                        })
                    }
                    <CateFacAdd></CateFacAdd>
                </ul>

                <div className='page_btn'>
                    <button className="write_btn_back icon-reply" onClick={popupClick}></button>
                    <button className="write_btn_back icon-plus-squared" onClick={cateAdd}></button>
                    <Link to={`/components/WriteView/${recentId}`} className='icon-ok-circled write_btn_save' onClick={() => { WriteSaveBtn(); }}></Link>
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

    function CateFacAdd() {
        return (
            <div className={`cateAdd ${catePopup ? catePopup : ""}`}>
                <i className='icon-hash'></i>
                <input type="text" ref={cateInput} />
                <button onCick={cateSaveBtn}><i className='icon-plus-circled'></i></button>
            </div>
        )
    }

}

export default Write;