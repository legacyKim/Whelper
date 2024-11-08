import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { syncWriteListData, syncWriteListDataUpdate } from '../data/reducers.js';
import { writeListDataDel } from '../data/api.js'
import { useParams } from 'react-router-dom';

import MyContext from '../context'
import AnnoList from './Anno.js'

import ViewEdit from './SlateView.js'
import { writeListDataView } from '../data/api.js';

import { token_check } from '../data/token_check.js'

function WriteView() {

    const { isAuth, annoString, setAnnoString, prevPathname } = useContext(MyContext);

    const writeListState = useSelector((state) => {
        if (prevPathname === "/") {
            return state.WriteListDateDataOn;
        } else if (prevPathname === "/components/AnnoLink") {
            return state.WriteListDataAnnoLinkOn;
        } else if (prevPathname === "/components/Write") {
            return state.WriteListView;
        } else {
            return state.WriteListPageDataOn;
        }
    });
    var writeListArr = writeListState.data.write || [];

    let { id } = useParams();
    localStorage.setItem('writeId', id);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const refresh = async (id) => {
        const num_id = Number(id);
        const refresh_data = await dispatch(writeListDataView(num_id));
        setWriteContent(refresh_data.payload.write);
    }

    useEffect(() => {
        if (writeListState.data.write.length === 0) {
            const refreshId = localStorage.getItem('writeId');
            refresh(refreshId);
        }
    }, []);

    const writeListCheck = (writeListArr, id) => {
        if (id !== '9999') {
            for (var i = 0; i < writeListArr.length; i++) {
                if (writeListArr[i].id === Number(id)) {
                    return writeListArr[i];
                }
            }
        } else {
            return writeListArr;
        }
    };

    const [writeContent, setWriteContent] = useState(writeListCheck(writeListArr, id));

    const [titleDoc, setTitleDoc] = useState(() => {
        if (writeContent?.title) {
            return new DOMParser().parseFromString(writeContent.title, 'text/html');
        } else {
            return null;
        }
    });
    const [subTitleDoc, setSubTitleDoc] = useState(() => {
        if (writeContent?.subTitle) {
            return new DOMParser().parseFromString(writeContent.subTitle, 'text/html');
        } else {
            return null;
        }
    });
    const [contentDoc, setContentDoc] = useState(() => {
        if (writeContent?.content) {
            return new DOMParser().parseFromString(writeContent.content, 'text/html');
        } else {
            return null;
        }
    });

    const lsKeywords = JSON.parse(localStorage.getItem('view_keywords')) || [];
    const [keywordsParse, setKeywordsParse] = useState(() => {
        if (writeContent?.keywords) {
            return JSON.parse(writeContent.keywords);
        } else {
            return lsKeywords;
        }
    });
    localStorage.setItem('view_keywords', JSON.stringify(keywordsParse));

    const [annoArr, setAnnoArr] = useState(() => {
        if (writeContent !== undefined && writeContent.anno) {
            return JSON.parse(writeContent.anno);
        } else {
            return [];
        }
    });

    useEffect((id) => {
        setTimeout(() => {
            const memoContentElements = document.querySelectorAll('.view_page');
            memoContentElements.forEach(element => {
                element.classList.remove('opacity');
            });
        }, 100);
    }, [writeListArr]);

    // write delete
    const [modalDeleteWrite, setModalDeleteWrite] = useState(false);

    const { annoListBtn, setAnnoListBtn, annoClick, setAnnoClick } = useContext(MyContext);

    const anno_numbering = () => {

        const anno_num = document.querySelectorAll('.editor_anno');
        const anno_length = anno_num.length;

        var latest_index;
        anno_num.forEach((element, index) => {

            element.setAttribute('anno-data-num', `${index + 1}`)
            element.style.setProperty('--anno-num', `'${index + 1})'`);

            if (element.dataset.eventRegistered !== true) {
                element.addEventListener('click', (e) => {

                    for (var i = 0; i < anno_num.length; i++) {
                        anno_num[i].classList.remove('active');
                    }

                    e.preventDefault()
                    element.classList.add('active');

                    setAnnoListBtn(true);
                    setAnnoClick(Number(element.getAttribute('anno-data-num')));
                });
                element.dataset.eventRegistered = true;
            }

        });

        return [latest_index, anno_length];
    };

    useEffect(() => {
        anno_numbering();
        document.querySelectorAll('.editor_anno').forEach((ele) => {
            ele.classList.add('editing');
        });
    }, []);

    const writeNavi = async (e) => {
        e.preventDefault();
        const isTokenValid = await token_check(navigate);
        if (isTokenValid) {
            navigate(`/components/WriteCorrect/${writeContent !== undefined ? writeContent.id : localStorage.getItem('writeId')}`)
        }
    }

    const writeKey = false;

    return (

        <div className='view_page opacity'>
            <div className='common_page ofX-hidden'>
                <div className='content_area'>
                    <div className='view_content all'>

                        <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>

                        <div className='write_keyword_view'>
                            {keywordsParse.map((k, j) => (
                                <WriteKeyword key={j} writeListKeyword={k} />
                            ))}
                        </div>
                    </div>

                    <AnnoList id={id} annoArr={annoArr} annoListBtn={annoListBtn} setAnnoListBtn={setAnnoListBtn} annoClick={annoClick} setAnnoClick={setAnnoClick} annoString={annoString} setAnnoString={setAnnoString} writeKey={writeKey} />

                    {(isAuth === 1 || isAuth === 0) && id !== '9999' && (
                        <div className='page_btn'>
                            {isAuth === 0 && (
                                <Link className='icon-trash' onClick={(e) => {
                                    e.preventDefault();
                                    setModalDeleteWrite(true);
                                }}></Link>
                            )}
                            <Link className='icon-edit-alt' onClick={writeNavi}></Link>
                        </div>
                    )}

                </div>

                {modalDeleteWrite === true && (
                    <ModalDeleteWrite writeContent={writeContent} writeListDataDel={writeListDataDel} />
                )}
            </div>
        </div>
    );

    function WriteKeyword({ writeListKeyword }) {
        return <Link to={`/components/Category/${writeListKeyword}`}>#{writeListKeyword}</Link>
    }

    function ModalDeleteWrite({ writeContent }) {

        const deleteWriteInModal = async (writeContent) => {

            const isTokenValid = await token_check(navigate);
            if (isTokenValid) {
                dispatch(writeListDataDel(writeContent.id));
                navigate('/components/WriteList');
            }
            setModalDeleteWrite(false);
        }

        return (
            <div className="modal">
                <div className="modal_box">
                    <span>글을 삭제하시겠습니까?</span>
                    <div className="btn_wrap">
                        <button onClick={() => setModalDeleteWrite(false)}>취소</button>
                        <button onClick={() => deleteWriteInModal(writeContent)}>삭제</button>
                    </div>
                </div>
            </div>
        )
    }

}

export default WriteView;