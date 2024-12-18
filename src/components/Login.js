import { React, useEffect, useState, useRef, useContext } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link, NavLink } from "react-router-dom";
import MyContext from '../context'
import { userCheck, userIdDuplicateCheck, emailSendCertifyNum, signupComplete } from '../data/api.js'

function Login() {

    // login
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { setAuth, prevPathname } = useContext(MyContext);

    const username = useRef();
    const userPassword = useRef();

    const loginCheck = async () => {

        const username_v = username.current.value;
        const userpassword_v = userPassword.current.value;
        const result = await dispatch(userCheck({ username_v, userpassword_v }));

        if (username.current.value === '') {
            alert('아이디를 입력해 주세요.');
            return;
        } else if (userPassword.current.value === '') {
            alert('비밀번호를 입력해 주세요.');
            return;
        } else if (result.payload.message) {
            username.current.value = '';
            userPassword.current.value = '';
            alert('아이디 또는 비밀번호가 틀렸습니다.');
            return;
        } else {
            setAuth(result.payload?.info.authority);
            navigate(`${prevPathname}`);
        }
    };

    const LoginClick = (e) => {
        e.preventDefault();

        loginCheck().catch(error => {
            console.error(error);
        });
    };
    //// login

    const [loginOn, setLoginOn] = useState('on')
    const [account, setAccount] = useState(false);
    const [accountAnima, setAccountAnima] = useState('');

    const createAccount = () => {
        setAccount(true);
        setLoginOn('off');
        setAccountAnima('accountOn');
    }

    const [showPassword, setShowPassword] = useState('icon-eye-off');
    const showPasswordBtn = () => {
        const inputPassword = userPassword.current;

        if (inputPassword.type === 'password') {
            inputPassword.type = 'text';
            setShowPassword('icon-eye-1');
        } else {
            inputPassword.type = 'password';
            setShowPassword('icon-eye-off');
        }
    };

    return (
        <div className='login'>
            <form className={`form ${loginOn}`} onSubmit={LoginClick} noValidate>
                <strong>Login</strong>
                <p>My portfolio Sign in</p>

                <span>Admin ID</span>
                <input ref={username} required />

                <span>Password</span>
                <div className='input_box'>
                    <input type='password' ref={userPassword} required />
                    <button type="button" onClick={showPasswordBtn}><i className={`${showPassword}`}></i></button>
                </div>

                <div className='btn'>
                    <button type="submit" className=''>Sign in <i className='icon-rocket'></i></button>
                    <button type="button" onClick={createAccount}>Sign up <i className='icon-paper-plane'></i></button>
                    <NavLink to={'/'}>Close</NavLink>
                </div>
            </form>

            {account === true && (
                <Account />
            )}
        </div>
    )

    function Account() {

        const cancelAccount = () => {
            setAccount(false);
            setLoginOn('on');
            setAccountAnima('');
        }

        const newUsername = useRef();

        const newUserPasswordRef = useRef();
        const newUserPasswordConfirmRef = useRef();

        const [newUserPassword, setNewUserPassword] = useState('');
        const [newUserPasswordConfirm, setNewUserPasswordConfirm] = useState('');

        const email = useRef();
        const certify_num = useRef();

        const [showPwConfirm, setShowPwConfirm] = useState();
        const [showPasswordConfirm, setShowPasswordConfirm] = useState('icon-eye-off');
        const showPasswordBtnConfirm = () => {

            if (newUserPasswordRef.current.type === 'password' || newUserPasswordConfirmRef.current.type === 'password') {
                newUserPasswordRef.current.type = 'text';
                newUserPasswordConfirmRef.current.type = 'text';

                setShowPasswordConfirm('icon-eye-1');
                setShowPwConfirm('active');
            } else {
                newUserPasswordRef.current.type = 'password';
                newUserPasswordConfirmRef.current.type = 'password';

                setShowPasswordConfirm('icon-eye-off');
                setShowPwConfirm('');
            }

        };

        const [idCheck, setIdCheck] = useState();
        const idDuplicateCheckBtn = async () => {

            const newUsername_v = newUsername.current.value;
            const result = await dispatch(userIdDuplicateCheck({ newUsername_v }));

            if (newUsername_v === "") {
                alert("ID 를 입력해 주세요.");
                setIdCheck('');
                return;
            } else if (/admin/.test(newUsername_v)) {
                alert(`"admin" 은 사용할 수 없습니다.`);
                setIdCheck('');
                return;
            } else if (result.payload.message === 'ID already exists') {
                alert("ID 가 중복됩니다.");
                setIdCheck('');
                return;
            } else {
                alert("사용 가능한 ID 입니다.");
                setIdCheck('active');
            }
        }

        const [certifyNum, setCertifyNum] = useState();
        const selectRef = useRef();

        const getCertifyNum = async () => {

            if (!selectRef.current.value) {
                alert("도메인을 선택해주세요.");
                return;
            }

            const selectedEmail = `${email.current.value}@${selectRef.current.value}`;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(selectedEmail)) {
                alert('이메일 형식이 올바르지 않습니다.');
                return;
            }

            try {
                const result = await dispatch(emailSendCertifyNum({ selectedEmail }));
                if (result.error) {
                    throw new Error(result.error.message || "인증번호 발송에 실패했습니다.");
                }
                setCertifyNum(result.payload.certifyNum);
                alert("인증번호를 발행했습니다.");
            } catch (error) {
                alert(`에러 발생: ${error.message}`);
            }

        }

        const [certifyCheck, setCertifyCheck] = useState('');
        const checkCertifyNum = () => {
            if (certify_num.current.value === certifyNum) {
                alert('인증에 성공했습니다!');
                setCertifyCheck('active');
            } else {
                alert('인증번호가 일치하지 않습니다.');
                setCertifyCheck('')
                return;
            }
        }

        const [confirmActive, setConfirmActive] = useState('')
        var [notice, setNotice] = useState('Confirm');
        useEffect(() => {

            if (idCheck !== 'active') {
                setNotice("ID 중복을 확인해 주세요.");
            } else if (newUserPassword === '') {
                setNotice("비밀번호를 입력해 주세요.");
            } else if (newUserPassword.length < 6) {
                setNotice("비밀번호를 6자 이상 입력해 주세요.")
            } else if (newUserPasswordConfirm === '') {
                setNotice("확인 비밀번호를 입력해 주세요.");
            } else if (newUserPassword !== newUserPasswordConfirm) {
                setNotice("비밀번호가 일치하지 않습니다.");
            } else if (certifyCheck !== 'active') {
                setNotice("인증번호를 확인해 주세요.");
            } else {
                setNotice('Confirm!');
            }

            if (idCheck === 'active' && certifyCheck === 'active' && newUserPassword === newUserPasswordConfirm) {
                setConfirmActive('active');
            } else {
                setConfirmActive('');
            }

        }, [certifyCheck, idCheck, newUserPassword, newUserPasswordConfirm]);

        const confirm_complete = async (e) => {
            e.preventDefault();

            const newUsername_v = newUsername.current.value;
            const result = await dispatch(signupComplete({ newUsername: newUsername_v, newUserPasswordConfirm: newUserPasswordConfirm }));

            if (result.payload?.message === 'Success') {
                alert('회원가입이 완료되었습니다.');
                navigate('/');
            } else {
                alert('회원가입이 실패했습니다.');
                return;
            }
        }

        return (
            <form className={`form ${accountAnima}`} onSubmit={confirm_complete} noValidate>
                <strong>Account</strong>
                <p>Portfolio Sign up</p>

                <span>Admin ID</span>
                <div className="input_box">
                    <input ref={newUsername} required />
                    <button type="button" className={`${idCheck}`} onClick={idDuplicateCheckBtn}><i className='icon-ok-circled'></i></button>
                </div>

                <span>Password</span>
                <div className="input_box">
                    <input type='password' ref={newUserPasswordRef} onChange={(e) => { setNewUserPassword(e.target.value) }} required />
                    <button type="button" className={`${showPwConfirm}`} onClick={showPasswordBtnConfirm}><i className={`${showPasswordConfirm}`}></i></button>
                </div>

                <span>Password confirm</span>
                <div className="input_box">
                    <input type='password' ref={newUserPasswordConfirmRef} onChange={(e) => { setNewUserPasswordConfirm(e.target.value) }} required />
                    <button type="button" className={`${showPwConfirm}`} onClick={showPasswordBtnConfirm}><i className={`${showPasswordConfirm}`}></i></button>
                </div>

                <span>E-mail</span>
                <div className='input_box'>
                    <input type='email' ref={email} required />
                    <em>@</em>
                    <select ref={selectRef}>
                        <option>선택</option>
                        <option>naver.com</option>
                        <option>google.com</option>
                        <option>daum.net</option>
                    </select>
                    <button type="button" onClick={getCertifyNum} className='email_certify_btn'><i className='icon-ok-circled'></i></button>
                </div>
                <em className='notice'>(이메일 정보는 수집하지 않습니다.)</em>

                <span>Certification number</span>
                <div className="input_box">
                    <input type='password' ref={certify_num} required />
                    <button type="button" onClick={checkCertifyNum}><i className='icon-ok-circled'></i></button>
                </div>

                <div className="btn">
                    <button type="submit" className={`confirm_btn ${confirmActive}`} disabled={confirmActive !== 'active'}>{notice}
                        <i className='icon-paper-plane'></i>
                    </button>
                    <button type="button" onClick={cancelAccount}>Cancel</button>
                </div>
            </form>
        )
    }

}

export default Login;