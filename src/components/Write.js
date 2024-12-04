import React, { useRef, useState, useMemo, useCallback, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';

import { syncWriteListData } from "../data/reducers";
import { writeListDataPost, cateListData } from '../data/api.js';

import { createEditor, Editor, Element as SlateElement, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import MyContext from '../context';
import LinkPopup from './LinkPopup.js';

import AnnoList from './sideInWrite/Anno.js';
import MemoInWrite from './sideInWrite/MemoInWrite.js';
import LinkList from './sideInWrite/LinkList.js';

import useAnno from './hook/useAnno.js';
import serialize from './hook/serialize.js';
import useSlateRender from './hook/useSlateRender.js';
import CustomEditor from './hook/customEditor.js';
import LinksWith from './hook/LinksWith.js';

function Write() {

    const { isAuth } = useContext(MyContext);

    const dispatch = useDispatch();
    useEffect(() => {
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
    const [editor] = useState(() => LinksWith(withReact(createEditor())));

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

    const { renderElement, renderLeaf } = useSlateRender();

    // anno save
    const { annoListBtn, setAnnoListBtn, annoClick, setAnnoClick, annoString, setAnnoString,
        memoInWriteBtn, setMemoInWriteBtn,
        linkListBtn, setLinkListBtn,
        linkList, setLinkList,
        memoText, setMemoText,
        memoCopyActiveOn, setMemoCopyActiveOn,
    } = useContext(MyContext);

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
    const [edSubTitle, setEdSubTitle] = useState(subTitleValue);
    const [editorValue, setEditorValue] = useState(contentValue);

    localStorage.setItem('writeTitle', JSON.stringify(edTitle));
    localStorage.setItem('writeSubTitle', JSON.stringify(edSubTitle));
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

        const keywords = JSON.stringify(keywordArr);
        const id = '9999';

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
    const recentId = '9999';
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

    const annoAddWrite = useRef();
    // const [annoTextBox, setAnnoTextBox] = useState();
    const { annoSaveBtn, anno_numbering, annoRemove, toolbarClose, annoTextboxOpen, annoTextboxClose, onlyAnnoClose, annoTextBoxChange } = useAnno(
        editor,
        annoContent, setAnnoContent,
        setAnnoListBtn, setAnnoClick, annoArr, setAnnoArr, annoLengthState, setAnnoLengthState,
        annoAddActive, setAnnoAddActive,
        annoTextboxActive, setAnnoTextboxActive,
        toolbarActive, setToolbarActive,
        onlyAnno, setOnlyAnno,
        annoRemoveNumbering, setAnnoRemoveNumbering,
        annoAddWrite
    );

    // link popup open
    const [linkActive, setLinkActive] = useState(false);
    //// link popup open

    // memo copy 
    useEffect(() => {
        CustomEditor.toggleQuote(editor);
    }, [memoCopyActiveOn]);
    //// memo copy

    const writeKey = true;
    useEffect(() => {
        localStorage.setItem('writeAnno', JSON.stringify(annoArr));
    }, [annoArr])

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
                                CustomEditor.toggleBoldMark(editor);
                                toolbarClose();
                            }}>
                        </button>
                        <button className='icon-underline'
                            onMouseDown={event => {
                                event.preventDefault()
                                CustomEditor.toggleUnderline(editor);
                                toolbarClose();
                            }}>
                        </button>
                        <button className='icon-quote'
                            onMouseDown={event => {
                                event.preventDefault();
                                CustomEditor.toggleQuote(editor);
                                toolbarClose();
                            }}>
                        </button>
                        <button className='icon-list-bullet'
                            onMouseDown={event => {
                                event.preventDefault();
                                CustomEditor.toggleAnnotation(editor, annoTextboxOpen, onlyAnnoClose, annoRemove);
                            }}>
                        </button>
                        <button className='icon-link'
                            onMouseDown={event => {
                                event.preventDefault();

                                if (CustomEditor.isLink(editor) === false) {
                                    setLinkActive(true);
                                    toolbarClose();
                                } else {
                                    CustomEditor.toggleLink(editor);
                                    toolbarClose();
                                }
                            }}>
                        </button>
                        {memoText && (
                            <button className='icon-popup'
                                onMouseDown={event => {
                                    event.preventDefault();

                                    CustomEditor.toggleCopy(editor, memoText, setMemoText);
                                    toolbarClose();
                                }}>
                            </button>
                        )}
                    </div>
                    <div className={`anno_add ${annoTextboxActive ? annoTextboxActive : ""}`}>
                        <textarea ref={annoAddWrite} placeholder='newAnnoComment'
                            value={annoContent}
                            onChange={e => {
                                setAnnoContent(e.target.value);
                                annoTextBoxChange();
                            }}>
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
                        if (event.shiftKey && event.code === 'Space') {
                            event.preventDefault();
                            Transforms.insertText(editor, '    ');
                        }
                    }}
                />
            </Slate>

            <div className='page_btn'>
                <button className='icon-ok-circled write_btn_save' onClick={() => { popupClick(); }}></button>
            </div>

            <AnnoList annoArr={annoArr} setAnnoArr={setAnnoArr} annoListBtn={annoListBtn} setAnnoListBtn={setAnnoListBtn} annoClick={annoClick} setAnnoClick={setAnnoClick} setAnnoRemoveNumbering={setAnnoRemoveNumbering} annoString={annoString} setAnnoString={setAnnoString} writeKey={writeKey} setMemoInWriteBtn={setMemoInWriteBtn} setLinkListBtn={setLinkListBtn} />
            <LinkList editor={editor} linkList={linkList} setLinkList={setLinkList} linkListBtn={linkListBtn} setAnnoListBtn={setAnnoListBtn} setMemoInWriteBtn={setMemoInWriteBtn} setLinkListBtn={setLinkListBtn} />
            <MemoInWrite memoInWriteBtn={memoInWriteBtn} setMemoInWriteBtn={setMemoInWriteBtn} setAnnoListBtn={setAnnoListBtn} setLinkListBtn={setLinkListBtn} setMemoText={setMemoText} setMemoCopyActiveOn={setMemoCopyActiveOn} />

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
                    {(isAuth === 1 || isAuth === 0) && (
                        <Link to={`/components/WriteView/${recentId}`} className='icon-ok-circled write_btn_save' onClick={() => { WriteSaveBtn(); }}></Link>
                    )}
                </div>
            </div>

            {linkActive === true && (
                <LinkPopup linkList={linkList} setLinkList={setLinkList} linkActive={linkActive} setLinkActive={setLinkActive} editor={editor} CustomEditor={CustomEditor} />
            )}

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