import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { useSelector, useDispatch } from "react-redux"
import { writeListData } from '../data/api.js';
import ViewEdit from './SlateView.js'

function WriteList() {

    const [someCondition, setSomeCondition] = useState(true);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(writeListData())
    }, [dispatch]);

    const writeListState = useSelector((state) => state.WriteData);
    const writeListArr = writeListState.data.write || [];

    return (
        <TransitionGroup>
            <div className='common_page'>
                <div className='content_area'>

                    {
                        writeListArr.map(function (a, i) {
                            return (
                                <CSSTransition in={someCondition} key={i} timeout={500} classNames="WriteDiv fade">
                                    <WriteShowContents i={i} writeListArr={writeListArr} />
                                </CSSTransition>
                            )
                        })
                    }

                </div>
            </div>
        </TransitionGroup>

    )

    function WriteShowContents({ i, writeListArr }) {

        const [writeContent, setWriteContent] = useState(writeListArr[i]);

        const titleDoc = new DOMParser().parseFromString(writeContent.title, 'text/html');
        const subTitleDoc = new DOMParser().parseFromString(writeContent.subTitle, 'text/html');
        const contentDoc = new DOMParser().parseFromString(writeContent.content, 'text/html');

        /*
        const dispatch = useDispatch();
        const delWriteList = () => {
            dispatch(writeListDataDelete({ id: writeListArr[i].id }))
        }
        */

        // function writeDateFomatt(date) {
        //     const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        //     return date.toLocaleDateString('en-US', options).replace(/\//g, '.');
        // }

        // const writeDate = writeDateFomatt(writeListArr[i].date);

        const keywordsParse = JSON.parse(writeListArr[i].keywords)

        return (

            <div>
                <div className='write_btn'>
                    <Link className='icon-edit-alt' to={`/components/WriteCorrect/${writeListArr[i].id}`}></Link>
                    {/* <button className='icon-trash' onClick={delWriteList}></button> */}
                </div>
                <div className='write_list' >
                    <Link to={`/components/WriteView/${writeListArr[i].id}`}>
                        <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
                    </Link>
                    <div className='write_keyword'>
                        <ul className='write_keyword_list'>
                            {
                                keywordsParse.map((k, i) => (
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