import { React, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link, NavLink } from "react-router-dom";

import { userCheck } from '../data/api.js'

function Login() {

    // login
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const username = useRef();
    const userPassword = useRef();

    const loginCheck = async () => {
        const username_v = username.current.value;
        const userpassword_v = userPassword.current.value;
        const result = await dispatch(userCheck({ username_v, userpassword_v }));

        if (!result.payload.message) {
            navigate('/');
        } else {
            username.current.value = '';
            userPassword.current.value = '';
            alert('아이디 또는 비밀번호가 틀렸습니다.');
        }
    };

    const LoginClick = () => {
        loginCheck().catch(error => {
            console.error(error);
        });
    };
    //// login

    const [loginOn, setLoginOn] = useState('on')
    
    return (
        <div className='login'>
            <div className={`form ${loginOn}`}>
                <strong>Login</strong>
                <p>My portfolio login</p>
                <span>Admin ID</span>
                <input ref={username}></input>
                <span>password</span>
                <input type='password' ref={userPassword}></input>
                <div className='btn'>
                    <button onClick={LoginClick} className=''>Login <i className='icon-rocket'></i></button>
                    <NavLink to={'/'}>Close</NavLink>
                </div>
            </div>
        </div>
    )

}

export default Login;