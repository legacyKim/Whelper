import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

    const writeListState = useSelector((state) => state.WriteData);
    var writeListArr = writeListState.data.write || [];

    let { id } = useParams();
    localStorage.setItem('writeId', id);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(syncWriteListData());
        dispatch(syncWriteListDataUpdate());
    }, [dispatch]);

    useEffect(() => {
        if (writeListState.data.write.length === 0) {
            const refresh = async () => {
                const refresh_data = await dispatch(writeListDataView());
                setWriteContent(writeListCheck(refresh_data.payload.write, localStorage.getItem('writeId')));
            }
            refresh();
        }
    }, []);

    const writeListCheck = (writeListArr, id) => {
        for (var i = 0; i < writeListArr.length; i++) {
            if (writeListArr[i].id === Number(id)) {
                return writeListArr[i];
            }
        }
    };

    const [writeContent, setWriteContent] = useState(writeListCheck(writeListArr, id));

    const titleDoc = (writeContent !== undefined) ? new DOMParser().parseFromString(writeContent.title, 'text/html') : null;
    const subTitleDoc = (writeContent !== undefined) ? new DOMParser().parseFromString(writeContent.subTitle, 'text/html') : null;
    const contentDoc = (writeContent !== undefined) ? new DOMParser().parseFromString(writeContent.content, 'text/html') : null;

    const lsKeywords = JSON.parse(localStorage.getItem('view_keywords')) || [];
    const keywordsParse = (writeContent !== undefined) ? JSON.parse(writeContent.keywords) : lsKeywords;
    localStorage.setItem('view_keywords', JSON.stringify(keywordsParse));

    const [annoArr, setAnnoArr] = useState((writeContent !== undefined) ? JSON.parse(writeContent.anno) : []);
    console.log(writeContent);
    console.log(annoArr);

    useEffect((id) => {
        setTimeout(() => {
            const memoContentElements = document.querySelectorAll('.view_page');
            memoContentElements.forEach(element => {
                element.classList.remove('opacity');
            });
        }, 100);
    }, [writeListArr]);

    const delWriteList = async (e) => {

        e.preventDefault();
        const isTokenValid = await token_check(navigate);

        if (isTokenValid) {
            dispatch(writeListDataDel(writeContent.id));
            navigate('/components/WriteList');
        }
    }

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
                    e.preventDefault()
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

    useEffect(() => {
        if (writeContent !== undefined) {
            const parsedAnno = JSON.parse(writeContent.anno);
            setAnnoArr(parsedAnno);
        }
    }, [writeContent]);

    const annoCorrectKey = false;

    return (

        <div className='view_page opacity'>
            <div className='common_page'>
                <div className='content_area'>
                    <div className='view_content all'>

                        <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>

                        <div className='write_keyword_view'>
                            {keywordsParse.map((k, j) => (
                                <WriteKeyword key={j} writeListKeyword={k} />
                            ))}
                        </div>
                    </div>

                    <AnnoList annoArr={annoArr} annoListBtn={annoListBtn} setAnnoListBtn={setAnnoListBtn} annoClick={annoClick} setAnnoClick={setAnnoClick} annoCorrectKey={annoCorrectKey} />

                    <div className='page_btn'>
                        <Link className='icon-trash' onClick={delWriteList}></Link>
                        <Link className='icon-edit-alt' onClick={writeNavi}></Link>
                    </div>
                </div>
            </div>
        </div>
    );

    function WriteKeyword({ writeListKeyword }) {
        return <Link to={`/components/Category/${writeListKeyword}`}>#{writeListKeyword}</Link>
    }

}

export default WriteView;