import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function AnnoList({ id, annoArr, setAnnoArr, annoListBtn, setAnnoListBtn, setMemoInWriteBtn, setLinkListBtn, annoClick, setAnnoClick, setAnnoRemoveNumbering, annoString, setAnnoString, writeKey }) {

    const navigate = useNavigate();

    useEffect(() => {
        setAnnoListBtn(false);
    }, []);

    const annoListBtnActive = () => {
        if (annoListBtn === true) {
            setAnnoListBtn(false);
        } else {
            setAnnoListBtn(true);

            setMemoInWriteBtn(false);
            setLinkListBtn(false);
        }
    }

    useEffect(() => {
        document.querySelectorAll('.annoList li').forEach((ele, index) => {
            ele.classList.remove('active');
            if (annoClick === index + 1) {
                ele.classList.add('active');
            }
        });
        document.querySelectorAll('.editor_anno').forEach((ele, index) => {
            ele.classList.remove('active');
            if (index === annoClick - 1) {
                ele.classList.add('active');
            }
        });
    }, [annoClick]);

    const [annolistIndex, setAnnolistIndex] = useState();

    const annoBtn = (e) => {
        e.preventDefault();
        if (e._reactName === 'onContextMenu' && e.target.classList.contains('anno_content')) {

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const annoList = document.querySelector('.annotation_list');
            const btnPos = document.querySelector('.btn_wrap_pos');

            if (btnPos && annoList) {
                const parentRect = annoList.getBoundingClientRect();

                const relativeX = mouseX - parentRect.left;
                const relativeY = mouseY - parentRect.top;

                btnPos.style.top = relativeY + 'px';
                btnPos.style.left = relativeX + 'px';
            }

            const annoListCheck = e.target;
            const list = annoListCheck.closest('li');

            const annoListItems = Array.from(annoList.querySelectorAll('li'));
            const annolistIndex = annoListItems.indexOf(list);

            setAnnoString(e.target.innerHTML);
            setAnnolistIndex(annolistIndex);
            setAnnoBtnActive(true);
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
        const newAnnoArr = updatedArr.map((anno) =>
            anno.index > annolistIndex + 1
                ? { ...anno, index: anno.index - 1 }
                : anno
        );
        newAnnoArr.sort((a, b) => a.index - b.index);
        setAnnoArr(newAnnoArr);

        localStorage.setItem('writeAnno', JSON.stringify(newAnnoArr));
        setAnnoRemoveNumbering(annolistIndex);

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

    const annoLinkBtn = () => {
        if (Number(id) !== 99999) {
            navigate(`/components/annoLink`);
        }
    }

    useEffect(() => {
        document.querySelectorAll('.anno_content').forEach((ele, index) => {
            ele.addEventListener('click', () => {
                setAnnoClick(index + 1);
            });
            ele.addEventListener('contextmenu', () => {
                setAnnoClick(index + 1);
            });
        });
    }, []);

    useEffect(() => {
        document.querySelectorAll('.anno_content').forEach((ele, index) => {
            ele.closest('li').classList.remove('active');
            if (annoString === ele.innerHTML) {
                ele.closest('li').classList.add('active');
                setAnnoClick(index + 1);
            }
        });
    }, [annoString])

    const area = document.querySelector('.annotation_list');
    const [listWidth, setListWidth] = useState(266);

    let x = 0;

    const mouseDownHandler = function (e) {

        x = e.clientX;

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {

        const dx = e.clientX - x;
        const newAnnoListWidth = listWidth - dx;

        area.style.minWidth = `${newAnnoListWidth}px`;
        area.style.maxWidth = `${newAnnoListWidth}px`;
        area.style.right = `-${newAnnoListWidth}px`;
    };

    const mouseUpHandler = function () {
        setListWidth(area.getBoundingClientRect().width);
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    return (

        <div className={`annotation_list ${annoListBtn === true ? 'active' : ''} `} onClick={() => { setAnnoBtnActive(false) }}>
            <button className={`annotation_btn`} onClick={annoListBtnActive}>
                <i className='icon-list-bullet'></i>
            </button>

            {annoListBtn === true && (
                <button className="annotation_wide" onMouseDown={mouseDownHandler}>
                    <i className='icon-resize-horizontal'></i>
                </button>
            )}

            <ul className="annoList scroll" onContextMenu={annoBtn}>

                {
                    annoArr.map(function (a, i) {
                        return (
                            <li key={i}>
                                <div className="annoList_item">
                                    <span className="num">
                                        {annoArr[i].index})
                                    </span>
                                    <p className="anno_content">
                                        {annoArr[i].content}
                                    </p>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>

            <div className='btn_wrap_pos'>
                <div className={`btn_list ${annoBtnActive === true ? 'active' : ''} `}>

                    {writeKey === true ? (
                        <div className="btn_wrap">
                            <button className="icon-vector-pencil" onClick={annoArrCorrect}></button>
                            <button className="icon-trash" onClick={annoArrDelete}></button>
                        </div>
                    ) : (
                        <div className="btn_wrap">
                            <button className='icon-link' onClick={annoLinkBtn}></button>
                        </div>
                    )}

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