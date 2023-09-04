import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux"

import '../css/style.css';
import { Link } from 'react-router-dom';

function WriteList() {

    let writeListState = useSelector((state) => state.WriteData)

    const [isWriteOn, setIsWriteOn] = useState(false);

    const WriteOn = () => {
        setIsWriteOn(!isWriteOn);
    }

    return (

        <div className='common_page'>
            <div className='content_area'>

                <div className='content_write'>
                    <button onClick={WriteOn} className='content_write_save'>글쓰기</button>
                </div>

                {
                    writeListState.map(function (a, i) {
                        return (
                            <div className='WriteDiv' key={i}>
                                <WriteShowContents i={i} />
                            </div>
                        )
                    })
                }

                {/* {isWriteOn ? <Write /> : null} */}

            </div>
        </div>

    )

    function WriteShowContents({ i }) {

        const writeListState = useSelector((state) => state.WriteData);

        return (
            <Link to={`/components/WriteView/${writeListState[i].id}`}>
                <div className='write_list'>
                    <div className='write_list_btn'>
                        <button></button>
                        <button></button>
                    </div>
                    <span>{writeListState[i].title}</span>
                    <strong>{writeListState[i].subTitle}</strong>
                    <p>{writeListState[i].content}</p>
                </div>
            </Link>
        )
    }
}

export default WriteList;