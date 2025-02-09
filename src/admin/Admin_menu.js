import { React, useState } from 'react';

import { NavLink } from "react-router-dom";

function Admin_menu() {

    const [adminMenuBtn, setAdminMenuBtn] = useState('left');

    const adminMenuBtnActive = () => {
        if (adminMenuBtn === 'left') {
            setAdminMenuBtn('right');
        } else {
            setAdminMenuBtn('left');
        }
    }


    return (
        <div className='admin_left'>

            <button className='admin_menu_btn' onClick={adminMenuBtnActive}>
                {adminMenuBtn === 'right' ? (
                    <i className='icon-right-dir'></i>
                ) : (
                    <i className='icon-left-dir'></i>
                )}
            </button>

            <div className={`admin_menu ${adminMenuBtn}`}>
                <NavLink to="/admin/Admin">
                    <i className="icon-home"></i>
                    <span>관리자홈</span>
                </NavLink>
                <NavLink to="/admin/Admin/User">
                    <i className="icon-info"></i>
                    <span>정보관리</span>
                </NavLink>
                <NavLink to="/admin/Admin/Stats">
                    <i className="icon-chart-line"></i>
                    <span>통계확인</span>
                </NavLink>
                {/* <NavLink to="/admin/Admin/Log"> */}
                <NavLink onClick={() => { alert("준비 중 입니다.") }}>
                    <i className="icon-flag-1"></i>
                    <span>접속로그</span>
                </NavLink>
                <NavLink to="/admin/Admin/Notice">
                    <i className="icon-wrench"></i>
                    <span>공지사항</span>
                </NavLink>
            </div>
        </div>
    )
}

export default Admin_menu;