import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { writeListDataAdd } from '../data/reducers.js';
import { useParams } from 'react-router-dom';
import { Slate, Editable } from 'slate-react';

import ViewEdit from './SlateView.js'

function WriteView() {

    const writeListState = useSelector((state) => state.WriteData);
    let { id } = useParams();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(writeListDataAdd());
    }, [dispatch]);

    const writeListArr = writeListState.data.write || [];
    const writeContent = useState(writeListArr[id] || undefined);

    const titleDoc = (writeContent[0] !== undefined && writeContent.length > 0) ? new DOMParser().parseFromString(writeContent[0].title, 'text/html') : null;
    const subTitleDoc = (writeContent[0] !== undefined && writeContent.length > 0) ? new DOMParser().parseFromString(writeContent[0].subTitle, 'text/html') : null;
    const contentDoc = (writeContent[0] !== undefined && writeContent.length > 0) ? new DOMParser().parseFromString(writeContent[0].content, 'text/html') : null;    
    const keywordsParse = (writeContent[0] !== undefined && writeContent.length > 0) ? JSON.parse(writeListArr[id].keywords) : [];

    useEffect(() => {
        setTimeout(() => {
            const memoContentElements = document.querySelectorAll('.view_page');
            memoContentElements.forEach(element => {
                element.classList.remove('opacity');
            });
        }, 100)
    }, [writeListArr])

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
                    <button className='page_btn'>
                        <Link className='icon-edit-alt' to={`/components/WriteCorrect/${id}`} />
                    </button>
                </div>
            </div>
        </div>
    );

    function WriteKeyword({ writeListKeyword }) {
        return <Link to={`/components/Category/${writeListKeyword}`}>#{writeListKeyword}</Link>
    }

}

export default WriteView;