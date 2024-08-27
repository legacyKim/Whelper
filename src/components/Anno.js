import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";

function AnnoList({ annoArr, setAnnoArr, annoListBtn, setAnnoListBtn, annoClick, annoCorrectKey }) {

    const navigate = useNavigate();

    useEffect(() => {
        setAnnoListBtn(false);
    }, [])

    const annoListBtnActive = () => {
        if (annoListBtn === true) {
            setAnnoListBtn(false);
        } else {
            setAnnoListBtn(true);
        }
    }

    useEffect(() => {
        document.querySelectorAll('.annoList li').forEach((ele, index) => {
            ele.classList.remove('active');
            if (annoClick === index + 1) {
                ele.classList.add('active');
            }
        })
    }, [annoClick]);

    const [annolistIndex, setAnnolistIndex] = useState();;

    const annoBtn = (e) => {
        e.preventDefault();
        if (annoCorrectKey === true) {
            if (e._reactName === 'onContextMenu' && e.target.classList.contains('anno_content')) {

                const mouseX = e.clientX;
                const mouseY = e.clientY;

                const annoList = document.querySelector('.annotation_list');
                const annoListBtnPos = document.querySelector('.annoWrap');

                if (annoListBtnPos && annoList) {
                    const parentRect = annoList.getBoundingClientRect();

                    const relativeX = mouseX - parentRect.left;
                    const relativeY = mouseY - parentRect.top;

                    annoListBtnPos.style.top = relativeY + 'px';
                    annoListBtnPos.style.left = relativeX + 'px';
                }

                const annoListCheck = e.target;
                const list = annoListCheck.closest('li');

                const annoListItems = Array.from(annoList.querySelectorAll('li'));
                const annolistIndex = annoListItems.indexOf(list);

                setAnnolistIndex(annolistIndex);
                setAnnoBtnActive(true);
            }
        }
    };

    function annoArrComplete() {
        const annoListFac = document.querySelectorAll('.annotation_list li');
        for (var i = 0; i < annoListFac.length; i++) {
            annoListFac[i].classList.remove('correct');
        }
        return annoListFac;
    }

    function annoHeightCheck() {

        const annoList = document.querySelector('.annotation_list');
        const annoListFac = annoList.querySelectorAll('li');
        const annoListItems = Array.from(annoListFac);

        const paragraph = annoListItems[annolistIndex].querySelector('p');
        const currentHeight = paragraph.getBoundingClientRect().height;

        return [annoList, annoListItems, paragraph, currentHeight, annoListFac]
    }

    const [annoBtnActive, setAnnoBtnActive] = useState();

    const annoListCorrect = useRef();
    const [annoCorrectBoxOpen, setAnnoCorrectBoxOpen] = useState(false);

    const annoArrCorrect = (e) => {
        e.preventDefault();

        annoArrComplete();
        setAnnoBtnActive(false);

        const annoHeightArr = annoHeightCheck();

        if (annolistIndex !== null && annolistIndex >= 0 && annolistIndex < annoHeightArr[1].length) {

            const selectedItem = annoHeightArr[1][annolistIndex];
            selectedItem.classList.add('correct')

            annoListCorrect.current.value = `${annoArr[annolistIndex].content}`;

            setTextAreaHeight(annoHeightArr[3]);
            setAnnoCorrectBoxOpen(true);
        }
    }

    const annoCorrectSave = () => {
        annoArrComplete();
        const updatedArr = [...annoArr];
        if (annolistIndex >= 0 && annolistIndex < updatedArr.length) {
            updatedArr[annolistIndex].content = annoListCorrect.current.value;
        }
        setAnnoCorrectBoxOpen(false);
        localStorage.setItem('writeAnno', JSON.stringify(updatedArr));
    }

    const annoCorrectCancel = () => {
        annoArrComplete();
        setAnnoBtnActive(false);
        setAnnoCorrectBoxOpen(false);
        setTextAreaHeight('0')
    }

    const annoArrDelete = (e) => {

        e.preventDefault();

        annoArrComplete();
        setAnnoBtnActive(false);
        setAnnoCorrectBoxOpen(false);

        const updatedArr = annoArr.filter((_, index) => index !== annolistIndex);
        setAnnoArr(updatedArr);

        localStorage.setItem('writeAnno', JSON.stringify(updatedArr));

    }

    const [textAreaHeight, setTextAreaHeight] = useState();

    useEffect(() => {
        if (textAreaHeight !== undefined) {
            annoListCorrect.current.style.height = textAreaHeight + 'px';
        }
    }, [textAreaHeight]);

    const annoTextareaChangeCorr = (e) => {
        annoListCorrect.current.style.height = 'auto';
        annoListCorrect.current.style.height = annoListCorrect.current.scrollHeight + 'px';
    }

    const annoLink = (e) => {
        if (annoCorrectKey === false) {
            navigate('/components/AnnoLink');
        } else {
            e.preventDefault();
        }
    }

    return (

        <div className={`annotation_list ${annoListBtn === true ? 'active' : ''} `} onClick={()=>{setAnnoBtnActive(false)}}>
            <button className="annotation_btn" onClick={annoListBtnActive}>
                <i className='icon-list-bullet'></i>
            </button>
            <ul className="annoList scroll" onContextMenu={annoBtn}>

                {
                    annoArr.map(function (a, i) {
                        return (
                            <li key={i}>
                                <Link to={`/components/AnnoLink`} onClick={(e)=>{annoLink(e)}}>
                                    <span className="num">
                                        {annoArr[i].index})
                                    </span>
                                    <p className="anno_content">
                                        {annoArr[i].content}
                                    </p>
                                </Link>
                            </li>
                        )

                    })
                }
            </ul>

            <div className='annoWrap'>
                <div className={`anno_btn_list ${annoBtnActive === true ? 'active' : ''} `}>
                    <button className="icon-vector-pencil" onClick={annoArrCorrect}></button>
                    <button className="icon-trash" onClick={annoArrDelete}></button>
                </div>
            </div>

            <div className={`annoCorrectBox_pos ${annoCorrectBoxOpen === true ? 'active' : ''} `}>
                <div className='annoCorrectBox'>
                    <textarea ref={annoListCorrect} onChange={(e) => {
                        annoTextareaChangeCorr();
                    }}></textarea>
                    <div className="annoBtnWrap">
                        <button className='icon-ok' onClick={annoCorrectSave}></button>
                        <button className='icon-cancel' onClick={annoCorrectCancel}></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnnoList;