// import React, { } from 'react';
import { useSelector, useDispatch } from "react-redux"
// import { writeListDataDelete } from "../store"

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

        /*
        const dispatch = useDispatch();
        const delWriteList = () => {
            dispatch(writeListDataDelete({ id: writeListState[i].id }))
        }
        */

        function writeDateFomatt(date) {
            const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
            return date.toLocaleDateString('en-US', options).replace(/\//g, '.');
        }
    
        const writeDate = writeDateFomatt(writeListState[i].date);

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
                        <ul className='write_keyword_list'>
                            {
                                writeListState[i].keyword.map((k, index) => (
                                    <WriteKeyword writeListKeyword={k} />
                                ))
                            }
                        </ul>

                        <b className='write_date'>{writeDate}</b>

                    </div>
                </div>
            </div>

        )
    }

    function WriteKeyword({ writeListKeyword }) {

        return (
            <li>
                <Link to={`/components/Category/${writeListKeyword}`}>#{writeListKeyword}</Link>
            </li>
        );

    }

}

export default WriteList;