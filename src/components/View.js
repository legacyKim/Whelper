import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/components.css';

import axios from 'axios';

function View(props) {


    return (

        <div className='view_page'>
            <div className='common_page'>
                <div className='content_area'>
                    <div className='view_content'>
                        <title>{props.viewData.title}</title>
                        <span>{props.viewData.subTitle}</span>
                        <p>{props.viewData.content}</p>
                    </div>
                </div>
            </div>
        </div>

    )

}

export default View;
