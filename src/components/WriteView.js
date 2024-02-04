import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Slate, Editable } from 'slate-react';

import '../css/style.css';
import ViewEdit from './SlateView.js'

function WriteView() {

    const writeListState = useSelector((state) => state.WriteData);
    let { id } = useParams();

    const [writeContent, setWriteContent] = useState(writeListState[id]);

    const titleDoc = new DOMParser().parseFromString(writeContent.title, 'text/html');
    const subTitleDoc = new DOMParser().parseFromString(writeContent.subTitle, 'text/html');
    const contentDoc = new DOMParser().parseFromString(writeContent.content, 'text/html');

    return (

        <div className='view_page'>
            <div className='common_page'>
                <div className='content_area'>
                    <div className='view_content all'>

                        <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>

                        <div className='write_keyword_view'>
                            {writeContent.keyword.map((k, j) => (
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