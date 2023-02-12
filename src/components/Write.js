import React, { useState } from 'react';
import WriteContentData from '../data'

import '../css/components.css';
import { Link } from 'react-router-dom';

function Write(props) {

    let [WriteListData] = useState(WriteContentData);

    return (

        <div className='common_page'>
            <div className='content_area'>

                {
                    WriteListData.map(function (a, i) {

                        return (

                            <div className='WriteDiv' key={i}>
                                <WriteList WriteListData={WriteListData[i]} i={i} />
                            </div>

                        )
                    })
                }

                {/* <Routes>
                    <Route path="/components/View/:id" element={<View WriteListData={WriteListData}/>} />
                </Routes> */}

            </div>
        </div>

    )

}

function WriteList(props) {

    return (

        <Link to={`/components/View/${props.WriteListData.id}`}>
            <div className='write_list'>
                <div className='write_list_btn'>
                    <button></button>
                    <button></button>
                </div>
                <span>{props.WriteListData.title}</span>
                <strong>{props.WriteListData.subTitle}</strong>
                <p>{props.WriteListData.content}</p>
            </div>
        </Link>

    )

}

export default Write;