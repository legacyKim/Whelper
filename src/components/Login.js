
import { React, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useNavigate, Link } from "react-router-dom";

import { userCheck } from '../data/api.js'

function Login() {

    const navigate = useNavigate();

    // login
    const logged = useSelector(state => state.loginData);

    const username = useRef();
    const userPassword = useRef();

    const dispatch = useDispatch();
    const loginCheck = () => {
        const username_v = username.current.value;
        const userpassword_v = userPassword.current.value;
        dispatch(userCheck({ username_v, userpassword_v }));
    }

    var login_info = useState(logged.loggedIn);
    //// login

    return (
        <div className='login'>
            <div className='form'>
                <input ref={username}></input>
                <input type='password' ref={userPassword}></input>
                <button onClick={loginCheck}></button>
            </div>
            <Link className='icon-cancel' to="/" onClick={() => { navigate('/') }}></Link>
        </div>
    )

}

export default Login;