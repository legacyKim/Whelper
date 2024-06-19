import { React, useRef } from 'react';
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

        if (result.payload) {
            const token = result.payload.access_token;
            localStorage.setItem('access_token', token);
            navigate('/');
        } else {
            alert('돌아가');
        }
    };

    const handleLogin = () => {
        loginCheck().catch(error => {
            console.error(error);
        });
    };
    //// login

    return (
        <div className='login'>
            <div className='form'>
                <input ref={username}></input>
                <input type='password' ref={userPassword}></input>
                <div className='btn'>
                    <button onClick={handleLogin} className='icon-ok'></button>
                    <Link className='icon-cancel' to={'/'}></Link>
                </div>
            </div>
        </div>
    )

}

export default Login;