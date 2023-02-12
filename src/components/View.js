import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/components.css';

function View(props) {

    let { id } = useParams();

    return (

        <div className='view_page'>
            <div className='common_page'>
                <div className='content_area'>
                    <div className='view_content'>
                        <title>{props.WriteListData[id].title}</title>
                        <span>{props.WriteListData[id].subTitle}</span>
                        <p>{props.WriteListData[id].content}</p>
                    </div>
                </div>
            </div>
        </div>

    )

}

export default View;
