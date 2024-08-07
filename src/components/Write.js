import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom';

import { syncWriteListData } from "../data/reducers"
import { writeListData, writeListDataPost, cateListData } from '../data/api.js';

import { createEditor, Editor, Transforms, Text, Element as SlateElement, Node } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'
import escapeHtml from 'escape-html'

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

    isLatestAnno(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.latestAnno === true : false
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

    toggleAnnotation(editor, annoTextboxOpen, onlyAnnoClose, toolbarClose) {
        const isActive = CustomEditor.isAnnotation(editor);
        if (isActive) {
            Editor.removeMark(editor, 'annotation');
            toolbarClose();
        } else {
            Editor.addMark(editor, 'annotation', true);
            Editor.addMark(editor, 'latestAnno', true);
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
                string = `<span class="editor_anno">${string}</span>`
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
                return `<span class="editor_anno">${children}</span>`;
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

    const annoValue = useMemo(() => {
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
                className={`${leaf.highlight ? ' editor_highlight' : ''}${leaf.underline ? ' editor_underline' : ''}${leaf.annotation ? ' editor_anno' : ''}${leaf.latestAnno ? ' latest_anno' : ''}`}>
                {children}
            </span>
        );

    }, []);
    //// slate text editor

    // anno save
    const [annoArrLs, setAnnoArrLs] = useState(JSON.parse(localStorage.getItem('annoContent')));
    const [annoArr, setAnnoArr] = useState(annoArrLs !== null ? annoArrLs : []);

    const [annoContent, setAnnoContent] = useState('')
    const [annoLengthState, setAnnoLengthState] = useState();

    const [annoAddActive, setAnnoAddActive] = useState('');
    useEffect(() => {
        if (annoAddActive === 'active') {
            setAnnoAddActive('active')
        } else {
            setAnnoAddActive('');
        }
    }, [annoAddActive]);

    const anno_numbering = () => {

        const anno_num = document.querySelectorAll('.editor_anno');
        const anno_length = anno_num.length;

        let latest_index = -1;
        anno_num.forEach((element, index) => {

            element.setAttribute('anno-data-num', `${index}`)
            element.style.setProperty('--anno-num', `'${index + 1})'`);

            if (element.classList.contains('latest_anno')) {
                latest_index = index;
                element.classList.remove('latest_anno');
            }
        });

        return [latest_index, anno_length];
    };

    const annoSaveBtn = () => {

        const anno_number_arr = anno_numbering();
        const latestNum = anno_number_arr[0];
        const annoLength = anno_number_arr[1];
        console.log(annoLength, " 추가시 주석 길이")

        if (latestNum !== -1) {
            setAnnoArr(prevAnnoArr => {

                const updatedAnnoArr = prevAnnoArr.map(anno =>
                    anno.index >= latestNum ? { ...anno, index: anno.index + 1 } : anno
                );

                // 인덱싱 문제

                const newAnno = { index: latestNum, content: annoContent };
                const newAnnoArr = [...updatedAnnoArr, newAnno];
                newAnnoArr.sort((a, b) => a.index - b.index);
                localStorage.setItem('annoContent', JSON.stringify(newAnnoArr));
                return newAnnoArr;
            });
        }
        setAnnoContent('');
        setAnnoTextboxActive('');
        setAnnoLengthState(annoLength)
    }

    useEffect(() => {
        anno_numbering();
    }, []);
    //// anno save

    // 1. 데이터베이스에서 "주석" 관련 데이터를 가져온다.
    // - mysql 에서 주석 순번을 어떻게 정할 것인가?

    // 2. 주석 순번
    // 3. 주석에 대한 설명을 넣을 테이터 처리
    // 4. 주석 설명 기입을 취소할 경우 주석 해제

    // 5. 주석 삭제 시 mysql 순번에서의 문제.
    // - 삭제 시 id 값의 비는 경우 발생할 듯?

    // ** 주석 클릭시 UI
    // - id 값으로 처리하지 말고 페이지 내에 주석의 갯수에 따라 번호를 매기는 걸로

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
        const id = 99999;

        const currentTime = new Date().toISOString();
        const updated_at = currentTime;
        const created_at = currentTime;

        dispatch(syncWriteListData({ id, title, subTitle, content, keywords, updated_at, created_at }));
        dispatch(writeListDataPost({ title, subTitle, content, keywords }));

        setEdTitle(contentPlaceholder);
        setEdSubTitle(contentPlaceholder);
        setEditorValue(contentPlaceholder);

        localStorage.removeItem('annoContent');
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

    const toolbarClose = (e) => {
        setToolbarActive('');
    }
    //// toolbar

    const annoTextboxOpen = (e) => {
        setAnnoTextboxActive('active');
    };

    const annoTextboxClose = (e) => {
        if (annoContent === '') {
            Editor.removeMark(editor, 'annotation');
            Editor.removeMark(editor, 'latestAnno');
        }
        setAnnoTextboxActive('');
    }

    const onlyAnnoClose = () => {
        setOnlyAnno('');
    }

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
                        if (annoLengthCheck.length < annoLengthState) {

                            const currentAnnoNums = Array.from(annoLengthCheck).map(
                                (element) => element.getAttribute('anno-data-num')
                            );

                            const updatedAnnoArr = annoArr.filter((anno) =>
                                currentAnnoNums.includes(anno.index.toString())
                            );

                            anno_numbering();
                            setAnnoArr(updatedAnnoArr);
                            setAnnoLengthState(annoLengthCheck.length);
                        }
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
                                CustomEditor.toggleAnnotation(editor, annoTextboxOpen, onlyAnnoClose, toolbarClose);
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

                            case 'n': {
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

            <AnnoList annoArr={annoArr} />
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

function AnnoList({ annoArr }) {

    const annoArrList = annoArr;

    const [annoBtn, setAnnoBtn] = useState();
    const annoBtnActive = () => {
        if (annoBtn === true) {
            setAnnoBtn(false);
        } else {
            setAnnoBtn(true);
        }
    }

    return (
        <div className={`annotation_list ${annoBtn === true ? 'active' : ''}`}>
            <button className="annotation_btn" onClick={annoBtnActive}>
                <i className='icon-list-bullet'></i>
            </button>
            <ul className="annoList scroll">

                {
                    annoArrList.map(function (a, i) {
                        return (
                            <li key={i}>
                                <span className="num">
                                    {i + 1} )
                                </span>
                                <p className="anno_content">
                                    {annoArrList[i].content}
                                </p>
                            </li>
                        )

                    })
                }

            </ul>
        </div>
    )
}

export default Write;