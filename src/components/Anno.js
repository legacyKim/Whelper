import React, { useState, useEffect, useRef } from 'react';

function AnnoList({ annoArr, annoBtn, setAnnoBtn, annoClick }) {

    const annoArrList = annoArr;

    const annoBtnActive = () => {
        if (annoBtn === true) {
            setAnnoBtn(false);
        } else {
            setAnnoBtn(true);
        }
    }

    useEffect(() => {
        document.querySelectorAll('.annoList li').forEach((ele, index) => {
            ele.classList.remove('active');
            if (annoClick === index + 1) {
                ele.classList.add('active')
            }
        })
    }, [annoClick])

    return (
        <div className={`annotation_list ${annoBtn === true ? 'active' : ''}`}>
            <button className="annotation_btn" onClick={annoBtnActive}>
                <i className='icon-list-bullet'></i>
            </button>
            <ul className="annoList scroll">

                {
                    annoArrList.map(function (a, i) {
                        return (
                            <li key={i}>
                                <span className="num">
                                    {annoArrList[i].index})
                                </span>
                                <p className="anno_content">
                                    {annoArrList[i].content}
                                </p>
                            </li>
                        )

                    })
                }
            </ul>

            <div className="anno_btn_list">
                <button className="icon-vector-pencil"></button>
                <button className="icon-link-1"></button>
            </div>
        </div>
    )
}

export default AnnoList;