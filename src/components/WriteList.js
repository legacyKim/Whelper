import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { writeListDataDelete } from "../store"

import '../css/style.css';
import { Link } from 'react-router-dom';

function WriteList() {

    let writeListState = useSelector((state) => state.WriteData);

    return (

        <div className='common_page'>
            <div className='content_area'>

                {
                    writeListState.map(function (a, i) {
                        return (
                            <div className='WriteDiv' key={i}>
                                <WriteShowContents i={i} />
                            </div>
                        )
                    })
                }

            </div>
        </div>

    )

    function WriteShowContents({ i }) {

        const writeListState = useSelector((state) => state.WriteData);
        const dispatch = useDispatch();
        const delWriteList = () => {
            dispatch(writeListDataDelete({id : writeListState[i].id}))
        }

        return (

            <div>
                <div className='write_btn'>
                    <Link className='icon-edit-alt' to={`/components/WriteCorrect/${writeListState[i].id}`}></Link>
                    <button className='icon-trash' onClick={delWriteList}></button>
                </div>
                <Link to={`/components/WriteView/${writeListState[i].id}`}>
                    <div className='write_list'>
                        <span>{writeListState[i].title}</span>
                        <strong>{writeListState[i].subTitle}</strong>
                        <p>{writeListState[i].content}</p>
                    </div>
                </Link>
            </div>

        )
    }
}

export default WriteList;