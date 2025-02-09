import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { writeListDataViewIncrement } from '../../data/api.js'

function Lock({ isAuth, write_password, writeContentId, writeListCheckPwCorr, writeNavi, writePath, writeListCheckPop, setWriteListCheckPop }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const writeListCheck = () => {

        if (isAuth === 0 || write_password === '' || write_password === null) {
            dispatch(writeListDataViewIncrement(writeContentId));
            navigate(`/components/WriteView/${writeContentId}`);
        } else if (writeListCheckPop === true) {
            setWriteListCheckPop(false);
        } else {
            setWriteListCheckPop(true);
        }
    }

    const [writeListCheckPw, setWriteListCheckPw] = useState('');
    useEffect(() => {
        if (writeListCheckPw !== '' && writeListCheckPw === write_password) {
            if (writeListCheckPwCorr === true) {
                dispatch(writeListDataViewIncrement(writeContentId));
                const mockEvent = { preventDefault: () => { } };
                writeNavi(mockEvent, writePath, navigate, isAuth);
            } else {
                dispatch(writeListDataViewIncrement(writeContentId));
                navigate(`/components/WriteView/${writeContentId}`);
            }
        }
    }, [writeListCheckPw]);

    return (
        <div className='write_list_check' onClick={writeListCheck}>
            <div className={`writeList_modal ${writeListCheckPop === true ? 'active' : ''}`} onClick={(e) => { e.stopPropagation() }}>
                <div className='writeList_modal_box_bg'></div>
                <form className="writeList_modal_box">
                    <span>비밀번호를 입력해 주세요.</span>
                    <input type='password' autoComplete="off" onChange={(e) => {
                        setWriteListCheckPw(e.target.value);
                    }} />
                </form>
                <button ></button>
            </div>
        </div>
    )
}

export default Lock;