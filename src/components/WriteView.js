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
                    </div>

                    <button className='view_correct_btn'>
                        <Link to={`/components/WriteCorrect/${id}`}></Link>
                    </button>
                </div>
            </div>
        </div>

    )

}

export default WriteView;