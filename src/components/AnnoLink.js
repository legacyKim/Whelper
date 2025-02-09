import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MyContext from '../context'

import { useSelector, useDispatch } from 'react-redux';
import { writeListDataAnnoLink } from '../data/api.js';
import { syncWriteListDataAnnoLink } from '../data/reducers.js';

import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'

import deserialize from './hook/deserialize.js';
import writeNavi from './hook/writeNavi.js';

import Lock from './func/Lock.js';

function AnnoLink() {

    const { isAuth, annoString, setAnnoString, writeListCheckPwCorr } = useContext(MyContext);

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

                newArr.push({ title: ele.title, password: ele.password });

                const parsedAnno = ele.anno !== undefined ? JSON.parse(ele.anno) : [];
                const annoId = ele.id;

                parsedAnno.forEach((annoItem) => {
                    newArr.push({ anno: annoItem.content, id: annoId, password: ele.password });
                });
            }
        });

        setWriteListAnnoArr(newArr);
    }, [writeListArr]);

    const annoStringParams = () => {
        if (writePassword === null) {
            navigate(`/components/WriteView/${annoViewId}`)
        } else {
            setWriteListCheckPop(true);
        }
    }

    const [annoBtnActive, setAnnoBtnActive] = useState();
    const [annoViewId, setAnnoViewId] = useState();

    const [writePassword, setWritePassword] = useState('');
    const writePath = `/components/WriteView/${annoViewId}`;

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

            setWritePassword(writeListAnnoArr.find((ele) => ele.anno === e.target.innerHTML)?.password);

        }
    };
    //// toolbar

    // lock pop
    const [writeListCheckPop, setWriteListCheckPop] = useState(false);
    //// lock pop

    return (

        <div className='common_page'>
            <div className='content_area annolink_page' onClick={(e)=> {setAnnoBtnActive(false);}}>
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

                {writeListCheckPop && (
                    <Lock isAuth={isAuth} write_password={writePassword} writeContentId={annoViewId} writeListCheckPwCorr={writeListCheckPwCorr} writeNavi={writeNavi} writePath={writePath} writeListCheckPop={writeListCheckPop} setWriteListCheckPop={setWriteListCheckPop}></Lock>
                )}

            </div>
        </div>
    )

    function AnnoLinkShow({ contentArr }) {

        const [writeContent] = useState(contentArr);

        const titleDoc = writeContent.hasOwnProperty('title')
            ? writeContent.title
            : null;

        const annoContent = writeContent.hasOwnProperty('anno') ? writeContent.anno : null;
        const write_password = writeContent.password;

        useEffect(() => {
            const annoLinkObj = document.querySelectorAll('.annolink li');
            for (var i = 0; i < annoLinkObj.length; i++) {
                annoLinkObj[i].style.setProperty('--anno-link-num', `'${i + 1} )'`);
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
                    <div className="annolink">
                        <div className="icon-level-down annolink_dot"></div>
                        <title className="title">{titleDoc}</title>
                        {write_password != null && write_password !== '' && (
                            <i className="lock icon-lock-1"></i>
                        )}
                    </div>
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