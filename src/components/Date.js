
import { React, useEffect, useState, useRef } from 'react';

import '../css/style.css';

function Date() {

    return (

        <div className='content_area'>
            <ul className='date_list'>
                <li>
                    <Link to={`/components/`}>
                        내용
                    </Link>
                </li>
            </ul>
        </div>

    )

}

export default Date;