import { React, useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import '../css/admin.css';

import { useInfoData } from '../data/api.js';

function Info() {

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
    };

    return (
        <div className="admin_info">

            <li className='tb_header'>
                <span className='num'>No</span>
                <span className='name'>ID</span>
                <span className='auth'>Authority</span>
            </li>

            {userInfo.map((user, i) => {
                return (
                    <li key={i}>

                        <span className='num'>{i}</span>
                        <span className='name'>{user.username}</span>

                        {[0, 1, 2, 3].map((authLevel) => {
                            const inputId = `radio_auth_${user.id}_${authLevel}`;
                            return (
                                <div>
                                    <input
                                        id={`${inputId}`}
                                        type="radio"
                                        name={`authority_${user.id}`}
                                        value={authLevel}
                                        checked={user.authority === authLevel ? 'checked' : ''}
                                        onChange={() => authChange(user.id, authLevel)}
                                    />
                                    <label key={authLevel} htmlFor={`${inputId}`}></label>
                                </div>
                            )
                        })}
                    </li>
                )
            })}
        </div>
    )
}

export default Info;