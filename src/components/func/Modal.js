import { React, useState } from "react"

function Modal({ isModalText, setModalClose, setModalFuncActive }) {

    return (
        <div className="modal">
            <div className="modal_box">
                <span>{isModalText}</span>
                <div className="btn_wrap">
                    <button onClick={setModalClose}>취소</button>
                    <button onClick={()=>{
                        setModalFuncActive();
                        setModalClose();
                    }}>삭제</button>
                </div>
            </div>
        </div>
    )

}

export default Modal;