import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { userCheck } from '../data/api.js'

function Login() {

    // login
    const username = useRef();
    const userPassword = useRef();

    const dispatch = useDispatch();
    const loginCheck = () => {
        const username_v = username.current.value;
        const userpassword_v = userPassword.current.value;
        dispatch(userCheck({ username_v, userpassword_v }))
    }

    const loggedIn = useSelector(state => state.loginData);
    console.log(loggedIn)
    //// login

    return (
        <div className='login'>
            <div className='form'>
                <input ref={username}></input>
                <input ref={userPassword}></input>
                <button onClick={loginCheck}></button>
            </div>
        </div>
    )

}

export default Login;