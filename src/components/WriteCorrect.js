import React, { useRef, useState, useEffect, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { useParams, Link, useNavigate } from 'react-router-dom';

import { syncWriteListPageDataUpdate, syncWriteListPageData, syncCateListData } from "../data/reducers"
import { cateListData, writeListDataUpdate, cateListDataPost, writeListDataCorrect } from '../data/api.js';

import { createEditor, Editor, Element as SlateElement, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'

import MyContext from '../context'
import LinkPopup from './LinkPopup.js';

import AnnoList from './func/Anno.js'
import MemoInWrite from './func/MemoInWrite.js';
import LinkList from './func/LinkList.js'

import useAnno from './hook/useAnno.js';
import serialize from './hook/serialize.js';
import deserialize from './hook/deserialize.js';
import useSlateRender from './hook/useSlateRender.js'
import CustomEditor from './hook/customEditor.js'
import LinksWith from './hook/LinksWith.js';
import cateSaveBtn from './hook/cateSaveBtn.js'

function WriteCorrect() {

    let { id } = useParams();
    localStorage.setItem('writeId', id);

    const navigate = useNavigate();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(cateListData());
        dispatch(syncWriteListPageData());
    }, [dispatch]);

    const writeListState = useSelector((state) => {
        if (state.WriteListPageDataOn.data.write.length === 0) {
            return state.WriteListDateDataOn;
        } else {
            return state.WriteListPageDataOn;
        }
    });
    const cateListState = useSelector((state) => state.cateData);

    const writeListArr = writeListState.data.write || [];

    const writeListCheck = (id) => {
        for (var i = 0; i < writeListArr.length; i++) {
            if (writeListArr[i].id === Number(id ? id : localStorage.getItem('writeCorrectId'))) {
                return writeListArr[i];
            }
        }
    };
    const cateListArr = cateListState.data.cate || []

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

    const [titleEditor] = useState(() => withReact(createEditor()))
    const [subTitleEditor] = useState(() => withReact(createEditor()))
    const [editor] = useState(() => LinksWith(withReact(createEditor())));

    const [writeContent, setWriteContent] = useState(writeListCheck(id));

    const correctTitleLs = localStorage.getItem('correctTitle');
    const correctSubtitleLs = localStorage.getItem('correctSubTitle');
    const correctContentLs = localStorage.getItem('correctContent');
    const correctAnnoLs = localStorage.getItem('correctAnno');

    const titleValue = (writeContent !== undefined) ? deserialize(new DOMParser().parseFromString(writeContent.title, 'text/html').body) : JSON.parse(correctTitleLs);
    const subTitleValue = (writeContent !== undefined) ? deserialize(new DOMParser().parseFromString(writeContent.subTitle, 'text/html').body) : JSON.parse(correctSubtitleLs);
    const contentValue = (writeContent !== undefined) ? deserialize(new DOMParser().parseFromString(writeContent.content, 'text/html').body) : JSON.parse(correctContentLs);
    const keywordsParse = (writeContent !== undefined) ? JSON.parse(writeContent.keywords) : [];

    const contentPlaceholder = [
        {
            type: 'paragraph',
            children: [{ text: '' }],
        },
    ];
    //// initial value....

    var contentEditableFalse = false;
    const { renderElement, renderLeaf } = useSlateRender(contentEditableFalse);

    // anno save
    const { annoListBtn, setAnnoListBtn, annoClick, setAnnoClick, annoString, setAnnoString,
        memoInWriteBtn, setMemoInWriteBtn,
        linkListBtn, setLinkListBtn,
        linkList, setLinkList,
        memoText, setMemoText,
        memoCopyActiveOn, setMemoCopyActiveOn,
        currentPathname,
        setWriteListCheckPwCorr,
    } = useContext(MyContext);
    const [annoArr, setAnnoArr] = useState((writeContent !== undefined) ? JSON.parse(writeContent.anno) : JSON.parse(correctAnnoLs));

    const [annoContent, setAnnoContent] = useState('');
    const [annoLengthState, setAnnoLengthState] = useState(writeContent !== undefined ? writeContent.anno.length : JSON.parse(correctAnnoLs).length);

    const [annoAddActive, setAnnoAddActive] = useState('');
    const [annoRemoveNumbering, setAnnoRemoveNumbering] = useState(-1);
    //// anno save

    // content and local storage change
    const [keywordArr, setKeywordArr] = useState(keywordsParse);
    const [edTitle, setEdTitle] = useState(titleValue);
    const [edSubTitle, setEdSubTitle] = useState(subTitleValue);
    const [editorValue, setEditorValue] = useState(contentValue);

    localStorage.setItem('correctTitle', JSON.stringify(edTitle));
    localStorage.setItem('correctSubTitle', JSON.stringify(edSubTitle));
    localStorage.setItem('correctContent', JSON.stringify(editorValue));
    localStorage.setItem('correctAnno', JSON.stringify(annoArr));
    //// content and local storage change

    // write Correct
    const WriteCorrectBtn = async () => {

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

        const annoString = JSON.stringify(annoArr);
        const anno = annoString;

        var password;
        if (lockInput !== '') {
            password = lockInput;
        } else {
            password = null;
        }

        // dispatch(syncWriteListDataUpdate({ id, title, subTitle, content, keywords, anno, update_time }));
        dispatch(syncWriteListPageDataUpdate({ id, title, subTitle, content, keywords, anno, update_time, password }));
        dispatch(writeListDataUpdate({ id, title, subTitle, content, keywords, update_time, anno, password }))

        setEdTitle(contentPlaceholder);
        setEdSubTitle(contentPlaceholder);
        setEditorValue(contentPlaceholder);
        setAnnoArr([]);
        setWriteListCheckPwCorr(true);

    };
    //// write correct

    // cate Add Btn
    const [catePopup, catePopupActive] = useState("");
    const cateInput = useRef();
    //// cate Add Btn

    // lock add
    const [lockPopup, lockPopupActive] = useState("");
    const [lockDelPopup, lockDelPopupActive] = useState("");
    const [lockInput, setLockInput] = useState(writeContent?.password);

    const refresh = async (id) => {
        const num_id = Number(id);
        const refresh_data = await dispatch(writeListDataCorrect(num_id));
        setWriteContent(refresh_data.payload.write);
    }

    useEffect(() => {
        if (writeListState.data.write.length === 0) {
            const refreshId = localStorage.getItem('writeId');
            refresh(refreshId);
        }
    }, []);
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

    const writeKey = true;

    // memo copy 
    useEffect(() => {
        CustomEditor.toggleQuote(editor);
    }, [memoCopyActiveOn]);
    //// memo copy

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
                        setEdTitle(value);
                    }
                }}>
                <Editable className='write_title' placeholder="Title" />
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
                <Editable className='write_subtitle' placeholder="Sub Title" />
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
                <Link to={`/components/WriteView/${writeContent !== undefined ? writeContent.id : localStorage.getItem('writeId')}`} onClick={() => { navigate(`/components/WriteView/${writeContent !== undefined ? writeContent.id : localStorage.getItem('writeId')}`) }} className='icon-reply'></Link>
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
                            <span>변경할 비밀번호를 입력해 주세요.</span>
                            <input type="password" placeholder="password" onChange={(e) => {
                                setLockInput(e.target.value);
                            }} />
                            <div className="btn_wrap">
                                <button onClick={() => { lockPopupActive(''); }}>저장</button>
                                <button onClick={() => { lockPopupActive(''); }}>취소</button>
                            </div>
                        </div>
                    </div>
                )}

                {lockDelPopup === 'active' && (
                    <div className="modal">
                        <div className="modal_box">
                            <span>비밀번호를 해제하시겠습니까?</span>
                            <div className="btn_wrap">
                                <button onClick={() => { lockDelPopupActive(''); setLockInput(null); }}>확인</button>
                                <button onClick={() => { lockDelPopupActive('') }}>취소</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className='page_btn'>
                    <button className="write_btn_back icon-reply" onClick={popupClick}></button>
                    {lockInput !== null && (
                        <button className="icon-lock-open-1" onClick={() => { lockDelPopupActive("active") }}></button>
                    )}
                    <button className="icon-lock-1" onClick={() => { lockPopupActive("active") }}></button>
                    <button className="icon-tag" onClick={() => { catePopupActive('active'); }}></button>
                    <Link className='icon-ok-circled write_btn_save' to={`/components/WriteView/${writeContent !== undefined ? writeContent.id : localStorage.getItem('writeId')}`} onClick={() => { navigate(`/components/WriteView/${writeContent !== undefined ? writeContent.id : localStorage.getItem('writeId')}`); WriteCorrectBtn(); }}></Link>
                </div>
            </div>

            {linkActive === true && (
                <LinkPopup linkList={linkList} setLinkList={setLinkList} linkActive={linkActive} setLinkActive={setLinkActive} editor={editor} CustomEditor={CustomEditor} />
            )}

        </div>
    )

}

function CateListFac({ i, cateListArr, keywordArr, setKeywordArr }) {

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

export default WriteCorrect;