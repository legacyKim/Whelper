import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { writeListData } from '../data/api.js';
import { useParams } from 'react-router-dom';
import { Slate, Editable } from 'slate-react';

import ViewEdit from './SlateView.js'

function WriteView() {

    const writeListState = useSelector((state) => state.WriteData);
    let { id } = useParams();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(writeListData())
    }, [dispatch]);

    const writeListArr = writeListState.data.write || [];
    const writeContent = useState(writeListArr[id]);
    const keywordsParse = JSON.parse(writeListArr[id].keywords)

    const titleDoc = new DOMParser().parseFromString(writeContent[0].title, 'text/html');
    const subTitleDoc = new DOMParser().parseFromString(writeContent[0].subTitle, 'text/html');
    const contentDoc = new DOMParser().parseFromString(writeContent[0].content, 'text/html');

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