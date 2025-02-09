import React, { useRef, useState, useMemo, useCallback, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';

import { syncWriteListData, syncCateListData } from "../data/reducers";
import { writeListDataPost, cateListData, cateListDataPost } from '../data/api.js';

import { createEditor, Editor, Element as SlateElement, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import MyContext from '../context';
import LinkPopup from './LinkPopup.js';

import AnnoList from './func/Anno.js';
import MemoInWrite from './func/MemoInWrite.js';
import LinkList from './func/LinkList.js';

import useAnno from './hook/useAnno.js';
import serialize from './hook/serialize.js';
import useSlateRender from './hook/useSlateRender.js';
import CustomEditor from './hook/customEditor.js';
import LinksWith from './hook/LinksWith.js';
import cateSaveBtn from './hook/cateSaveBtn.js'

function Write() {

    const { isAuth, isUser } = useContext(MyContext);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(cateListData());
    }, [dispatch]);

    const cateListState = useSelector((state) => state.cateData);
    const cateListArr = cateListState.data.cate || [];
    // category popup
    const [popupActive, popupActiveStyle] = useState(false);
    const popupClick = () => {

        if (edTitle === '') {
            alert("제목을 입력해 주세요.")
            return;
        }

        if (edSubTitle === '') {
            alert("부제를 입력해 주세요.")
            return;
        }

        popupActiveStyle(!popupActive);
        if (!popupActive) {
            popupActiveStyle('active');
        } else {
            popupActiveStyle('');
        }
    };
    //// category popup

    // slate text editor    
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
        currentPathname
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

    const [edTitle, setEdTitle] = useState(writeTitleLocal !== null ? JSON.parse(writeTitleLocal) : '');
    const [edSubTitle, setEdSubTitle] = useState(writeSubTitleLocal !== null ? JSON.parse(writeSubTitleLocal) : '');
    const [editorValue, setEditorValue] = useState(contentValue);

    localStorage.setItem('writeTitle', JSON.stringify(edTitle));
    localStorage.setItem('writeSubTitle', JSON.stringify(edSubTitle));
    localStorage.setItem('writeContent', JSON.stringify(editorValue));
    //// content and local storage change

    // save content
    const WriteSaveBtn = () => {

        localStorage.removeItem('writeTitle');
        const title = edTitle;

        localStorage.removeItem('writeSubTitle');
        const subTitle = edSubTitle;

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

        var password = lockInput;
        var views = 0;
        var username = isUser;

        dispatch(syncWriteListData({ id, title, subTitle, content, keywords, anno, updated_at, created_at, password, views, username }));
        dispatch(writeListDataPost({ title, subTitle, content, keywords, anno, password, views, username }));

        setEdTitle('');
        setEdSubTitle('');
        setEditorValue(contentPlaceholder);
        setAnnoArr([]);

    };

    // cate Add Btn
    const [catePopup, catePopupActive] = useState("");
    const cateInput = useRef();
    //// cate Add Btn

    // lock add
    const [lockPopup, lockPopupActive] = useState("");
    const [lockInput, setLockInput] = useState('');

    useEffect(() => {
        if (lockInput !== '' && /\s/.test(lockInput)) {
            const updatedInput = lockInput.replace(/\s+/g, '');
            setLockInput(updatedInput);
            alert("띄어쓰기는 불가합니다.");
            return;
        }

        if (lockInput.length > 12) {
            setLockInput(lockInput.slice(0, 12));
            alert("12자리 이하로 입력해 주세요.");
            return;
        }
    }, [lockInput]);

    const passwordCheck = () => {
        if (lockInput.length < 4) {
            alert("비밀번호는 4자리 이상으로 입력해 주세요.");
            return;
        }

        lockPopupActive('')
    }
    //// lock add

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

            <input className='write_title' placeholder="Title" value={edTitle} onChange={(e) => {
                setEdTitle(e.target.value);
            }} />

            {/* <Slate
                editor={titleEditor}
                initialValue={titleValue}

            >
                <Editable />
            </Slate> */}

            <input className='write_subtitle' placeholder="Sub Title" value={edSubTitle} onChange={(e) => {
                setEdSubTitle(e.target.value);
            }} />

            {/* <Slate
                editor={subTitleEditor}
                initialValue={subTitleValue}
                onChange={value => {
                  
                    if (isAstChange) {
                        setEdSubTitle(value)
                    }
                }}>
                <Editable className='write_subtitle' placeholder="Sub Title" />
            </Slate> */}

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

                {catePopup === 'active' && (
                    <div className="modal">
                        <div className="modal_box">
                            <span>카테고리를 입력해 주세요.</span>
                            <input type="text" placeholder="category" ref={cateInput} />
                            <div className="btn_wrap">
                                <button onClick={() => cateSaveBtn(navigate, currentPathname, cateInput, cateListArr, dispatch, syncCateListData, cateListDataPost, catePopupActive)}>저장</button>
                                <button onClick={() => { catePopupActive('') }}>취소</button>
                            </div>
                        </div>
                    </div>
                )}

                {lockPopup === 'active' && (
                    <div className="modal">
                        <div className="modal_box">
                            <span>비밀번호를 입력해 주세요.</span>
                            <input type="password" value={lockInput} placeholder="password"
                                onChange={(e) => {
                                    let inputValue = e.target.value;

                                    if (!/^\d+$/.test(inputValue)) {
                                        inputValue = inputValue.slice(0, -1);
                                        alert("숫자만 입력해 주세요.")
                                    }
                                    setLockInput(inputValue);
                                }}
                            />
                            <div className="btn_wrap">
                                <button onClick={passwordCheck}>저장</button>
                                <button onClick={() => { lockPopupActive('') }}>취소</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className='page_btn'>
                    <button className="write_btn_back icon-reply" onClick={popupClick}></button>
                    <button className="icon-lock-1" onClick={() => { lockPopupActive("active") }}></button>
                    <button className="icon-tag" onClick={() => { catePopupActive("active") }}></button>
                    {(isAuth === 1 || isAuth === 0) && (
                        <Link to={`/components/WriteList`} className='icon-ok-circled write_btn_save' onClick={() => { WriteSaveBtn(); }}></Link>
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