import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom';

import { writeListDataAdd } from "../store.js"
import '../css/style.css';

import { createEditor, Editor, Transforms, Element, Node } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'

// slate editor
const CustomEditor = {
    isBoldMarkActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.bold === true : false
    },

    isCodeBlockActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === 'code',
        })

        return !!match
    },

    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'bold')
        } else {
            Editor.addMark(editor, 'bold', true)
        }
    },

    toggleCodeBlock(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor)
        Transforms.setNodes(
            editor,
            { type: isActive ? null : 'code' },
            { match: n => Editor.isBlock(editor, n) }
        )
    },
}
//// slate editor

// serial, deserial
const serialize = value => {
    return (
        value
            // Return the string content of each paragraph in the value's children.
            .map(n => Node.string(n))
            // Join them all with line breaks denoting paragraphs.
            .join('\n')
    )
}
// Define a deserializing function that takes a string and returns a value.
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
    const [editor] = useState(() => withReact(createEditor()))

    const contentArrLocalString = localStorage.getItem('writeContent');

    // initial value...
    const initialValue = useMemo(() => {

        const contentPlaceholder = [
            {
                type: 'paragraph',
                children: [{ text: '' }],
            },
        ];

        const parsedContent = contentArrLocalString !== null ? JSON.parse(contentArrLocalString) : contentPlaceholder;
        return parsedContent;

    }, []);
    //// initial value....

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, []);

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, []);
    //// slate text editor

    const newTitle = useRef();
    const newSubTitle = useRef();

    let cateListData = useSelector((state) => state.cateData);
    const [keywordArr, setKeywordArr] = useState([]);

    // content and local storage change
    const [editorValue, setEditorValue] = useState(initialValue);
    localStorage.setItem('writeContent', editorValue);
    //// content and local storage change

    // save content
    const dispatch = useDispatch();
    const WriteSaveBtn = () => {

        const id = writeListState.length;
        const title = newTitle.current.value;
        const subTitle = newSubTitle.current.value;

        // slate data store
        localStorage.removeItem('writeContent', editorValue);
        const contentParse = JSON.parse(editorValue);
        const contentString = JSON.stringify(serialize(contentParse));
        const content = contentString;

        const keyword = keywordArr;

        dispatch(writeListDataAdd({ id, title, subTitle, content, keyword }));
    };

    // save and keep the last num of id
    const recentId = writeListState.length;
    //// save content

    return (
        <div className='Write'>
            <input type="text" placeholder="TITLE" className="write_title" ref={newTitle}></input>
            <input type="text" placeholder="SUBTITLE" className="write_subtitle" ref={newSubTitle}></input>

            <Slate
                editor={editor}
                initialValue={initialValue}
                onChange={value => {
                    const isAstChange = editor.operations.some(
                        op => 'set_selection' !== op.type
                    )
                    if (isAstChange) {
                        // Save the value to Local Storage.
                        const writeContent = JSON.stringify(value)
                        setEditorValue(writeContent)
                    }
                }}>

                <div className='editor_btn'>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleBoldMark(editor)
                        }}
                    >
                        Bold
                    </button>
                    <button
                        onMouseDown={event => {
                            event.preventDefault()
                            CustomEditor.toggleCodeBlock(editor)
                        }}
                    >
                        Code Block
                    </button>
                </div>

                <Editable
                    placeholder="작은 것들도 허투로 생각하지 말지어다. 큰 것들도 최초에는 작았다."
                    editor={editor}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={event => {
                        // if (!event.ctrlKey) {
                        //     return
                        // }

                        switch (event.key) {
                            case '`': {
                                event.preventDefault()
                                CustomEditor.toggleCodeBlock(editor)
                                break
                            }

                            case 'b': {
                                event.preventDefault()
                                CustomEditor.toggleBoldMark(editor)
                                break
                            }

                            case 'enter': {
                                console.log('enter');
                                event.preventDefault();
                                Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] });
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

}

const CodeElement = props => {
    return (
        <pre {...props.attributes}>
            <code>{props.children}</code>
        </pre>
    )
}

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
}

const Leaf = props => {
    return (
        <span
            {...props.attributes}
            style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}>
            {props.children}
        </span>
    )
}

export default Write;