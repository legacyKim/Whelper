import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useSelector } from "react-redux"
import { useParams } from 'react-router-dom';

import '../css/style.css';
import axios from 'axios';

function WriteView() {

    const writeListState = useSelector((state) => state.WriteData);
    let { id } = useParams();

    /*
    function writeDateFomatt(date) {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        return date.toLocaleDateString('en-US', options).replace(/\//g, '.');
    }

    const writeDate = writeDateFomatt(writeListState[id].date);
    */

    const [writeContent, setWriteContent] = useState(writeListState[id]);
    console.log(writeContent)

    useEffect(() => {
        const storedValue = writeContent.content;
        let copy = writeContent;
        copy[0] = JSON.parse(storedValue);
        setWriteContent(copy);
    }, []);

    return (

        <div className='view_page'>
            <div className='common_page'>
                <div className='content_area'>
                    <div className='view_content'>
                        {/* <b>{writeDate}</b> */}
                        <title>{writeContent.title}</title>
                        <span>{writeContent.subTitle}</span>
                        <p>{writeContent.content}</p>
                        <div className='write_keyword_view'>
                            {
                                writeContent.keyword.map((k, j) => (
                                    <WriteKeyword key={j} writeListKeyword={k} />
                                ))
                            }
                        </div>

                    </div>

                    <button className='page_btn'>
                        <Link className='icon-edit-alt' to={`/components/WriteCorrect/${id}`}></Link>
                    </button>
                </div>
            </div>
        </div>

    )

    function WriteKeyword({ writeListKeyword }) {

        return (
            <Link to={`/components/Category/${writeListKeyword}`}>#{writeListKeyword}</Link>
        );

    }

}

export default WriteView;
