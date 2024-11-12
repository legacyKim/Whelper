import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MyContext from '../context'

import { useSelector, useDispatch } from 'react-redux';
import { writeListDataAnnoLink } from '../data/api.js';
import { syncWriteListDataAnnoLink } from '../data/reducers.js';

import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'

import deserialize from './hook/deserialize.js';

function AnnoLink() {

    const writeListState = useSelector((state) => state.WriteListDataAnnoLinkOn);
    var writeListArr = writeListState.data.write || [];

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!writeListArr.length) {
            dispatch(writeListDataAnnoLink());
            dispatch(syncWriteListDataAnnoLink());
        }
    }, [dispatch]);

    const [writeListAnnoArr, setWriteListAnnoArr] = useState([]);
    useEffect(() => {
        const newArr = [];
        writeListArr.forEach((ele) => {
            if (ele !== null) {
                newArr.push({ title: ele.title });

                const parsedAnno = ele.anno !== undefined ? JSON.parse(ele.anno) : [];
                const annoId = ele.id;

                parsedAnno.forEach((annoItem) => {
                    newArr.push({ anno: annoItem.content, id: annoId });
                });
            }
        });

        setWriteListAnnoArr(newArr);
    }, [writeListArr]);

    const { annoString, setAnnoString } = useContext(MyContext);
    const annoStringParams = () => {
        navigate(`/components/WriteView/${annoViewId}`)
    }

    const [annoBtnActive, setAnnoBtnActive] = useState();
    const [annoViewId, setAnnoViewId] = useState();

    // toolbar
    const annoBtn = (e) => {
        e.preventDefault();

        if (e._reactName === 'onContextMenu' && e.target.dataset.slateString !== 'true') {

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const annoList = document.querySelector('.annolink_wrap');
            const btnPos = document.querySelector('.btn_wrap_pos');

            if (btnPos && annoList) {
                const parentRect = annoList.getBoundingClientRect();

                const relativeX = mouseX - parentRect.left;
                const relativeY = mouseY - parentRect.top;

                btnPos.style.top = relativeY + 'px';
                btnPos.style.left = relativeX + 'px';
            }

            setAnnoViewId(writeListAnnoArr.find((ele) => ele.anno === e.target.innerHTML)?.id);
            setAnnoString(e.target.innerHTML);
            setAnnoBtnActive(true);
        }
    };
    //// toolbar

    return (
        <div className='common_page'>
            <div className='content_area'>
                <div className="annolink_wrap" onContextMenu={(e) => annoBtn(e)} >

                    {writeListAnnoArr.map((a, i) => (
                        <AnnoLinkShow contentArr={a} key={i} />
                    ))}

                    <div className='btn_wrap_pos'>
                        <div className={`btn_list ${annoBtnActive === true ? 'active' : ''} `}>
                            <div className="btn_wrap">
                                <button className='icon-link' onClick={(e) => annoStringParams(e)}></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    function AnnoLinkShow({ contentArr }) {

        const [writeContent] = useState(contentArr);

        const [titleEditor] = useState(() => withReact(createEditor()));
        const titleDoc = writeContent.hasOwnProperty('title')
            ? new DOMParser().parseFromString(writeContent.title, 'text/html')
            : null;
        const titleValue = titleDoc ? deserialize(titleDoc.body) : [{ text: '' }];

        const annoContent = writeContent.hasOwnProperty('anno') ? writeContent.anno : null;

        useEffect(() => {
            const annoLinkObj = document.querySelectorAll('.annolink li');
            for (var i = 0; i < annoLinkObj.length; i++) {
                annoLinkObj[i].style.setProperty('--anno-link-num', `'${i + 1} )'`);
                annoLinkObj[i].classList.add("anima");
            }
        }, []);

        useEffect(() => {
            document.querySelectorAll('.annolink li span').forEach((ele, index) => {
                if (ele.innerHTML === annoString) {
                    ele.closest('li').classList.add('active');
                }
            })
        }, [annoString]);

        return (
            <ul className={`annolink ${writeContent.hasOwnProperty('title') ? 'annolink_title' : ''}`}>

                {writeContent.hasOwnProperty('title') && (
                    <Slate editor={titleEditor} initialValue={titleValue}>
                        <div className="icon-level-down annolink_dot"></div>
                        <Editable className="title" readOnly />
                    </Slate>
                )}

                {annoContent && (
                    <li>
                        <span>{annoContent}</span>
                    </li>
                )}

            </ul>
        );
    }
}

export default AnnoLink;