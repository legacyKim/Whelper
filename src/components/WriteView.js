import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { syncWriteListData, syncWriteListDataUpdate } from '../data/reducers.js';
import { writeListDataDel } from '../data/api.js'
import { useParams } from 'react-router-dom';

import ViewEdit from './SlateView.js'

function WriteView() {

    const writeListState = useSelector((state) => state.WriteData);
    let { id } = useParams();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(syncWriteListData());
        dispatch(syncWriteListDataUpdate());
    }, [dispatch]);

    const writeListArr = writeListState.data.write || [];
    const writeListCheck = (id) => {
        for (var i = 0; i < writeListArr.length; i++) {
            if (writeListArr[i].id === Number(id)) {
                return writeListArr[i];
            }
        }
    };

    const [writeContent, setWriteContent] = useState(() => writeListCheck(id));

    const titleDoc = (writeContent !== undefined ) ? new DOMParser().parseFromString(writeContent.title, 'text/html') : null;
    const subTitleDoc = (writeContent !== undefined ) ? new DOMParser().parseFromString(writeContent.subTitle, 'text/html') : null;
    const contentDoc = (writeContent !== undefined ) ? new DOMParser().parseFromString(writeContent.content, 'text/html') : null;

    const lsKeywords = JSON.parse(localStorage.getItem('view_keywords')) || [];
    const keywordsParse = (writeContent !== undefined ) ? JSON.parse(writeContent.keywords) : lsKeywords;

    localStorage.setItem('view_keywords', JSON.stringify(keywordsParse));

    useEffect((id) => {
        setTimeout(() => {
            const memoContentElements = document.querySelectorAll('.view_page');
            memoContentElements.forEach(element => {
                element.classList.remove('opacity');
            });
        }, 100)
    }, [writeListArr])

    const delWriteList = () => {
        dispatch(writeListDataDel(writeContent.id))
    }

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
                    <div className='page_btn'>
                        <Link className='icon-trash' onClick={delWriteList} to={`/components/WriteList`}></Link>
                        <Link className='icon-edit-alt' to={`/components/WriteCorrect/${writeContent.id}`}></Link>
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