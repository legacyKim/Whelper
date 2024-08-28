import React, { useRef, useState, useMemo, useCallback, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom';

import { syncWriteListData } from "../data/reducers"
import { writeListData, writeListDataPost, cateListData } from '../data/api.js';

import { createEditor, Editor, Transforms, Text, Element as SlateElement, Node } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import escapeHtml from 'escape-html'

import MyContext from '../context'
import AnnoList from './Anno.js'

import useAnno from './hook/useAnno.js';

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
        return marks ? marks.quote === true : false
    },

    isAnnotation(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.annotation === true : false
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

    toggleAnnotation(editor, annoTextboxOpen, onlyAnnoClose, annoRemove) {
        const isActive = CustomEditor.isAnnotation(editor);

        if (isActive) {
            annoRemove();
        } else {
            Editor.addMark(editor, 'annotation', true);
            annoTextboxOpen();
            onlyAnnoClose();
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
                string = `<span class="editor_anno editing">${string}</span>`
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
                return `<span class="editor_anno editing">${children}</span>`;
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
        dispatch(writeListData());
        dispatch(cateListData());
    }, [dispatch]);

    const cateListState = useSelector((state) => state.cateData);
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

    // slate text editor
    const [titleEditor] = useState(() => withReact(createEditor()));
    const [subTitleEditor] = useState(() => withReact(createEditor()));
    const [editor] = useState(() => withReact(createEditor()));

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
    //// initial value....

    const renderElement = useCallback(({ attributes, children, element }) => {
        switch (element.type) {
            case 'paragraph':
                return <p {...attributes}>{children}</p>;
            default:
                return <div {...attributes}>{children}</div>;
        }
    }, []);

    const renderLeaf = useCallback(({ attributes, children, leaf }) => {

        let style = {};
        let classNames = '';

        if (leaf.bold) {
            classNames = 'bold';
        }
        if (leaf.highlight) {
            style.backgroundColor = 'linear-gradient(to top, rgba(255, 243, 150, 0.6) 95%, transparent 100%)';
            classNames += ' editor_highlight';
        }
        if (leaf.underline) {
            style.textDecoration = 'underline';
            style.textUnderlinePosition = 'under';
            classNames += ' editor_underline';
        }
        if (leaf.annotation) {
            const anno_num = document.querySelectorAll('.editor_anno');
            anno_num.forEach((element, index) => {
                element.classList.remove('latest');
            });
            classNames += ' editor_anno';
        }
        if (leaf.quote) {
            classNames += ' editor_quote';
        }

        return (
            <span {...attributes} style={style} className={classNames.trim()}>
                {children}
            </span>
        );
    }, []);
    //// slate text editor

    // anno save
    const { annoListBtn, setAnnoListBtn, annoClick, setAnnoClick } = useContext(MyContext);

    const [annoArrLs, setAnnoArrLs] = useState(JSON.parse(localStorage.getItem('writeAnno')));
    const [annoArr, setAnnoArr] = useState(annoArrLs !== null ? annoArrLs : []);

    const [annoContent, setAnnoContent] = useState('')
    const [annoLengthState, setAnnoLengthState] = useState(annoArrLs !== null ? annoArrLs.length : 0);

    const [annoAddActive, setAnnoAddActive] = useState('');
    const [annoRemoveNumbering, setAnnoRemoveNumbering] = useState(-1);
    //// anno save

    // content and local storage change
    const [keywordArr, setKeywordArr] = useState([]);

    const [edTitle, setEdTitle] = useState(titleValue);
    localStorage.setItem('writeTitle', JSON.stringify(edTitle));

    const [edSubTitle, setEdSubTitle] = useState(subTitleValue);
    localStorage.setItem('writeSubTitle', JSON.stringify(edSubTitle));

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
        const id = 99999;

        const currentTime = new Date().toISOString();
        const updated_at = currentTime;
        const created_at = currentTime;

        localStorage.removeItem('writeAnno');
        const annoString = JSON.stringify(annoArr);
        const anno = annoString;

        dispatch(syncWriteListData({ id, title, subTitle, content, keywords, anno, updated_at, created_at }));
        dispatch(writeListDataPost({ title, subTitle, content, keywords, anno }));

        setEdTitle(contentPlaceholder);
        setEdSubTitle(contentPlaceholder);
        setEditorValue(contentPlaceholder);
        setAnnoArr([]);

    };

    // save and keep the last num of id
    const recentId = 99999;
    //// save content

    // toolbar
    const [toolbarActive, setToolbarActive] = useState(false);
    const [annoTextboxActive, setAnnoTextboxActive] = useState(false);
    const [onlyAnno, setOnlyAnno] = useState(false);

    const toolbarOpen = (e) => {
        e.preventDefault();

        setToolbarActive('active');
        setOnlyAnno('active');
        setAnnoTextboxActive('');

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const editorBtnPos = document.querySelector('.editor_btn');

        if (editorBtnPos) {
            editorBtnPos.style.top = mouseY + 'px';
            editorBtnPos.style.left = mouseX + 'px';
        }
    };
    //// toolbar

    const { annoSaveBtn, anno_numbering, annoRemove, toolbarClose, annoTextboxOpen, annoTextboxClose, onlyAnnoClose } = useAnno(
        editor,
        annoContent, setAnnoContent,
        setAnnoListBtn, setAnnoClick, annoArr, setAnnoArr, annoLengthState, setAnnoLengthState,
        annoAddActive, setAnnoAddActive,
        annoTextboxActive, setAnnoTextboxActive,
        toolbarActive, setToolbarActive,
        onlyAnno, setOnlyAnno,
        annoRemoveNumbering, setAnnoRemoveNumbering,

    );

    useEffect(() => {
        localStorage.setItem('writeAnno', JSON.stringify(annoArr));
    }, [annoArr])

    const writeKey = true;

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

                        var annoLengthCheck = document.querySelectorAll('.editor_anno');
                        setAnnoLengthState(annoLengthCheck.length);
                    }
                }}>

                <div className={`editor_btn ${toolbarActive ? toolbarActive : ""}`}>
                    <div className={`editor_btn_list ${onlyAnno ? onlyAnno : ""}`}>
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
                                event.preventDefault();
                                CustomEditor.toggleQuote(editor)
                                toolbarClose();
                            }}>
                        </button>
                        <button className='icon-list-bullet'
                            onMouseDown={event => {
                                event.preventDefault();
                                CustomEditor.toggleAnnotation(editor, annoTextboxOpen, onlyAnnoClose, annoRemove);
                            }}>
                        </button>
                    </div>
                    <div className={`anno_add ${annoTextboxActive ? annoTextboxActive : ""}`}>
                        <textarea className='scroll' placeholder='newAnnoComment'
                            value={annoContent}
                            onChange={e => setAnnoContent(e.target.value)}>
                        </textarea>

                        <div className='anno_add_btn flex-end'>
                            <button className='icon-ok' onClick={annoSaveBtn}></button>
                            <button className='icon-cancel' onClick={annoTextboxClose}></button>
                        </div>
                    </div>
                </div>

                <Editable className='write_content scroll' onContextMenu={toolbarOpen} onClick={toolbarClose}
                    placeholder="작은 것들도 허투로 생각하지 말지어다. 큰 것들도 최초에는 작았다."
                    editor={editor}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={event => {

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
                                    <CateListFac i={i} cateListArr={cateListArr} keywordArr={keywordArr} setKeywordArr={setKeywordArr}></CateListFac>
                                </li>
                            )
                        })
                    }
                </ul>

                <div className='page_btn'>
                    <button className="write_btn_back icon-reply" onClick={popupClick}></button>
                    <Link to={`/components/WriteView/${recentId}`} className='icon-ok-circled write_btn_save' onClick={() => { WriteSaveBtn(); }}></Link>
                </div>
            </div>

            <AnnoList annoArr={annoArr} setAnnoArr={setAnnoArr} annoListBtn={annoListBtn} setAnnoListBtn={setAnnoListBtn} annoClick={annoClick} setAnnoClick={setAnnoClick} setAnnoRemoveNumbering={setAnnoRemoveNumbering} writeKey={writeKey} />

        </div>
    )

}

function CateListFac({ i, keywordArr, cateListArr, setKeywordArr }) {

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

export default Write;