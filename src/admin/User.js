import { React, useState, useEffect, useRef, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import '../css/admin.css';

import MyContext from '../context.js';
import { useStore } from '../store';

import { useInfoData, userInfoDataChange, userInfoDataDelete } from '../data/api.js';

import Modal from '../components/func/Modal';

function User() {

    const { isAuth } = useContext(MyContext)
    const { isModalText, setModalText, isModalOpen, setModalOpen, setModalClose, isModalFunc, setModalFuncActive, setModalFuncInActive } = useStore();

    useEffect(() => {
        setModalText("계정을 삭제하시겠습니까?");
    }, []);

    const [userId, setUserId] = useState();

    useEffect(() => {
        if (isModalFunc === true && userId) {
            userInfoDataDelete(userId).then(() => {
                setModalFuncInActive()
            });
        }
    }, [isModalFunc]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['userInfo'],
        queryFn: useInfoData,
    });

    const [userInfo, setUserInfo] = useState([]);

    useEffect(() => {
        if (data) {
            setUserInfo(data);
        }
    }, [data]);

    const authChange = (id, value) => {
        setUserInfo((prev) =>
            prev.map((user) =>
                user.id === id ? { ...user, authority: value } : user
            )
        );

        userInfoDataChange(id, value);
    };

    useEffect(() => {
        setTimeout(() => {
            userInfo.forEach((user, i) => {
                var inputs = document.querySelectorAll(`input[name="authority_${user.id}"]`);
                inputs.forEach((input, j) => {
                    if (String(input.value) === String(user.authority)) {
                        input.checked = true;
                    }
                });
            });
        }, 500)
    }, [userInfo]);

    return (

        <div className="admin_info">

            <h4 className='admin_tit'>권한설정</h4>

            <ul className='admin_info_list scroll'>

                <li className='tb_header'>
                    <span className='num'>No</span>
                    <span className='name'>ID</span>
                    <span className='auth'>Authority</span>
                </li>

                {userInfo.filter((user) => user.username !== 'admin').map((user, i) => {
                    return (
                        <li key={i}>

                            <span className='num'>{i}</span>
                            <span className='name'>{user.username}</span>

                            {[0, 1, 2, 3].map((authLevel) => {
                                const inputId = `radio_auth_${user.id}_${authLevel}`;
                                return (
                                    <div className='input_radio_box' key={authLevel}>
                                        <input
                                            id={`${inputId}`}
                                            type="radio"
                                            name={`authority_${user.id}`}
                                            value={authLevel}
                                            onChange={(e) => {
                                                if (isAuth === 0) {
                                                    authChange(user.id, authLevel)
                                                } else {
                                                    e.preventDefault();
                                                }
                                            }
                                            }
                                        />
                                        <label htmlFor={`${inputId}`} onClick={() => {
                                            if (isAuth !== 0) {
                                                alert("권한이 없습니다.")
                                                return;
                                            }
                                        }}>
                                            <div className="mark"></div>
                                            <span>
                                                {authLevel === 0 ? (
                                                    "Admin"
                                                ) : authLevel === 1 ? (
                                                    "Del"
                                                ) : authLevel === 2 ? (
                                                    "Write, Corr"
                                                ) : (
                                                    "Only View"
                                                )}
                                            </span>
                                        </label>
                                    </div>
                                )
                            })}

                            {user.username !== 'admin' && (
                                <button className="user_del" onClick={() => {

                                    if (isAuth !== 0) {
                                        alert("계정 삭제 권한이 없습니다.");
                                        return;
                                    }

                                    setModalOpen();
                                    setUserId(user.id);
                                }}>
                                    <i className='icon-trash-2'></i>
                                </button>
                            )}
                        </li>
                    )
                })}

                {isModalOpen === true && (
                    <Modal isModalText={isModalText} setModalClose={setModalClose} setModalFuncActive={setModalFuncActive}></Modal>
                )}
                
            </ul>
        </div>
    )
}

export default User;