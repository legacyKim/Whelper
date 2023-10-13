import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { writeListDataDelete, searchListDataCorrect, searchListDataDelete } from "../store"

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
            dispatch(writeListDataDelete({ id: writeListState[i].id }))
        }

        return (

            <div>
                <div className='write_btn'>
                    <Link className='icon-edit-alt' to={`/components/WriteCorrect/${writeListState[i].id}`}></Link>
                    {/* <button className='icon-trash' onClick={delWriteList}></button> */}
                </div>
                <div className='write_list' >
                    <Link to={`/components/WriteView/${writeListState[i].id}`}>
                        <span>{writeListState[i].title}</span>
                        <strong>{writeListState[i].subTitle}</strong>
                        <p>{writeListState[i].content}</p>
                    </Link>
                    <div className='write_keyword'>
                        {
                            writeListState[i].keyword.map((k, index) => (
                                <WriteKeyword writeListKeyword={k} />
                            ))
                        }
                    </div>
                </div>
            </div>

        )
    }

    function WriteKeyword({ writeListKeyword }) {

        const dispatch = useDispatch();
        let searchListState = useSelector((state) => state.SearchData);
        
        var writekeywordClick = (e) => {
            e.stopPropagation();

            const searchContent = writeListKeyword;
            const searchContentDupli = searchListState.filter(item => item.searchContent === searchContent);

            if (searchContentDupli.length !== 0) {
                dispatch(searchListDataDelete({ searchContent: searchContentDupli[0].searchContent }));
            }

            dispatch(searchListDataCorrect({ searchContent }));
        }

        return (
            <Link to={`/components/Search/${writeListKeyword}`} onClick={writekeywordClick}>#{writeListKeyword}</Link>
        );

    }

}

export default WriteList;