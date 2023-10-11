import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useSelector } from "react-redux"
import { useParams } from 'react-router-dom';

import '../css/style.css';
import axios from 'axios';

function WriteView() {

    const writeListState = useSelector((state) => state.WriteData);
    let { id } = useParams();

    return (

        <div className='view_page'>
            <div className='common_page'>
                <div className='content_area'>
                    <div className='view_content'>
                        <title>{writeListState[id].title}</title>
                        <span>{writeListState[id].subTitle}</span>
                        <p>{writeListState[id].content}</p>
                        <div className='write_keyword_view'>
                            {
                                writeListState[id].keyword.map((k, index) => (
                                    <WriteKeyword writeListKeyword={k} />
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

        var writekeywordClick = (e) => {
            e.stopPropagation();
        }

        return (
            <Link to={`/components/Search/${writeListKeyword}`} onClick={writekeywordClick}>#{writeListKeyword}</Link>
        );

    }

}

export default WriteView;
