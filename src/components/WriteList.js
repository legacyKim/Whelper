import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux"
// import { writeListDataDelete } from "../store"

import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { createEditor, Transforms, Node } from 'slate';

import '../css/style.css';
import { Link } from 'react-router-dom';

const deserialize = string => {
    return [
        {
            type: 'paragraph',
            children: [{ text: string }],
        },
    ];
};

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
        const [writeContent, setWriteContent] = useState(writeListState[i]);
        /*
        const dispatch = useDispatch();
        const delWriteList = () => {
            dispatch(writeListDataDelete({ id: writeListState[i].id }))
        }
        */

        // function writeDateFomatt(date) {
        //     const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        //     return date.toLocaleDateString('en-US', options).replace(/\//g, '.');
        // }

        // const writeDate = writeDateFomatt(writeListState[i].date);

        const titleValue = JSON.parse(writeContent.title)
        const subTitleValue = JSON.parse(writeContent.subTitle)
        const contentValue = JSON.parse(writeContent.content)

        return (

            <div>
                <div className='write_btn'>
                    <Link className='icon-edit-alt' to={`/components/WriteCorrect/${writeListState[i].id}`}></Link>
                    {/* <button className='icon-trash' onClick={delWriteList}></button> */}
                </div>
                <div className='write_list' >
                    <Link to={`/components/WriteView/${writeListState[i].id}`}>
                        <span>{titleValue}</span>
                        <strong>{subTitleValue}</strong>
                        <p>{contentValue}</p>
                    </Link>
                    <div className='write_keyword'>
                        <ul className='write_keyword_list'>
                            {
                                writeListState[i].keyword.map((k, i) => (
                                    <li key={i}>
                                        <WriteKeyword writeListKeyword={k} />
                                    </li>
                                ))
                            }
                        </ul>

                        {/* <b className='write_date'>{writeDate}</b> */}

                    </div>
                </div>
            </div>

        )
    }

    function WriteKeyword({ writeListKeyword }) {

        return (
            <Link to={`/components/Category/${writeListKeyword}`}>#{writeListKeyword}</Link>
        );

    }

}

export default WriteList;