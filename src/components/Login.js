
import { React, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom";

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

    if (logged.loggedIn !== '') {
        console.log(logged.loggedIn.username);
    }
    //// login

    return (
        <div className='login'>
            <div className='form'>
                <input ref={username}></input>
                <input type='password' ref={userPassword}></input>
                <Link to={`/${logged.loggedIn.username}`} onClick={() => {
                    loginCheck();
                }}></Link>
            </div>
            {/* <Link className='icon-cancel' onClick={navigate('/')}></Link> */}
            <Link className='icon-cancel' to={'/'}></Link>
        </div>
    )

}

export default Login;