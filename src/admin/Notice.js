import { React, useState, useEffect, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';

import { updateNotice, updateNoticePost, updateNoticePostUpdate } from '../data/api.js';

import '../css/admin.css';

function Notice() {

    const { data, isLoading, error } = useQuery({
        queryKey: ['notice'],
        queryFn: updateNotice,
    });

    const [updateInfo, setUpdateInfo] = useState([]);

    useEffect(() => {
        if (data) {
            setUpdateInfo(data);
        }
    }, [data]);

    const [savePopup, setSavePopup] = useState(false);
    const [correctPopup, setCorrectPopup] = useState(null);

    useEffect(() => {
        if (correctPopup !== null) {
            update_tit.current.value = correctPopup.title;
            update_notice.current.value = correctPopup.notice;
            setTextAreaHeight(correctPopup.height);
        }
    }, [correctPopup]);

    const update_tit = useRef();
    const update_notice = useRef();

    const noticeSaveBtn = () => {
        const title = update_tit.current.value;
        const notice = update_notice.current.value;
        const height = update_notice.current.scrollHeight;

        updateNoticePost({ title, notice, height });

        update_tit.current.value = '';
        update_notice.current.value = '';

        setSavePopup(false);
    }

    const noticeCorrectBtn = (item) => {
        const id = item.id;
        const title = update_tit.current.value;
        const notice = update_notice.current.value;
        const height = update_notice.current.scrollHeight;
        updateNoticePostUpdate({ id, title, notice, height });

        update_tit.current.value = '';
        update_notice.current.value = '';

        setCorrectPopup(null);
    }

    const [updateNoticeOpen, setUpdateNoticeOpen] = useState(null);

    const [textAreaHeight, setTextAreaHeight] = useState();
    useEffect(() => {
        if (textAreaHeight !== undefined) {
            update_notice.current.style.height = textAreaHeight + 'px';
        }
    }, [textAreaHeight]);

    const updateTextareaChange = (e) => {
        update_notice.current.style.height = 'auto';
        update_notice.current.style.height = update_notice.current.scrollHeight + 'px';
    }

    return (
        <div className="admin_update">

            <div className='admin_header admin_header_sb'>
                <h4 className='admin_tit'>공지사항</h4>
                <div className='admin_btn_wrap'>
                    <button className='admin_update_btn' onClick={() => { setSavePopup(true); }}>
                        <i className='icon-ok-circled'></i>
                    </button>
                </div>
            </div>

            <ul className="update_list">

                {updateInfo.map((u, i) => (
                    <li key={u.id}>
                        <div className="update_box" onClick={(i) => { setUpdateNoticeOpen(updateNoticeOpen === u.id ? null : u.id); }}>
                            <span className='update_id'>{i}</span>
                            <span className='update_tit'>{u.title}</span>
                            <b className='update_create_date'>{new Date(u.created_at).toLocaleDateString()} {new Date(u.created_at).toLocaleTimeString()}</b>
                            <i className={`icon-up-dir ${updateNoticeOpen === u.id ? 'active' : ''}`}></i>
                        </div>
                        <div
                            ref={(el) => {
                                if (el) {
                                    if (updateNoticeOpen === u.id) {
                                        el.style.height = `${el.scrollHeight}px`;
                                    } else {
                                        el.style.height = '0px';
                                    }
                                }
                            }}
                            className={`update_notice_box ${updateNoticeOpen === u.id ? 'active' : 'nonActive'}`}>
                            <span className='update_id'></span>
                            <p className="notice" style={{ height: u.height }}>
                                {u.notice}
                            </p>
                            <b className='update_create_date'>
                                <button onClick={() => { setCorrectPopup(u); }}><i className="icon-edit-alt"></i></button>
                            </b>
                            <i></i>
                        </div>
                    </li>
                ))}

                <li className="update_list_header">
                    <span className='update_id'>id 값</span>
                    <span className='update_tit'>제목</span>
                    <b className='update_create_date'>생성일</b>
                    <i></i>
                </li>

            </ul>

            {(savePopup === true || correctPopup !== null) && (
                <div className="update_post_bg">
                    <div className="update_post">
                        <input ref={update_tit} placeholder='제목을 입력해 주세요.' />
                        <textarea ref={update_notice}
                            style={{
                                height: correctPopup ? `${correctPopup.height}px` : 'auto',
                            }}
                            onChange={(e) => {
                                updateTextareaChange();
                            }}
                        ></textarea>

                        <div className='btn'>
                            {savePopup && (
                                <button onClick={() => { noticeSaveBtn() }}>
                                    Save
                                    <i className="icon-rocket"></i>
                                </button>
                            )}

                            {correctPopup && (
                                <button onClick={() => { noticeCorrectBtn(correctPopup) }}>
                                    Correct
                                    <i className="icon-rocket"></i>
                                </button>
                            )}

                            <button className='close' onClick={() => { setSavePopup(false); setCorrectPopup(null); }}>close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notice;