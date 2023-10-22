
import { React, useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"

import '../css/style.css';

function Date() {

    let writeListState = useSelector((state) => state.WriteData);

    return (

        <div className='content_area'>
            <ul className='date_list'>
                <WriteDate></WriteDate>
            </ul>
        </div>

    )

    function WriteDate() {

        return (
            <li>
                <Link to={`/components/`}>
                    <strong>제목</strong>
                    <span>23.10.22</span>
                </Link>
            </li>
        )

    }

}

export default Date;