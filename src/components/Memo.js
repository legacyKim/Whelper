import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import '../css/components.css';

function Memo(props) {

    // textarea 열고 닫기
    let [MainMemoActive, MainMemoDirect] = useState(false);

    // 새로 작성되는 글이 담기는 곳.
    let [AddMainMemo, AddMainMemoInput] = useState('');

    const [showComponent, setShowComponent] = useState();

    function MainMemoSet(props) {

        // 메모 수정
        let [correctMainMemo, correctMainMemoInput] = useState('');

        return (

            <div className='Main_memo_textarea'>

                {/* <textarea onInput={(e) => {
                    correctMainMemoInput(e.target.value);
                }}>
                    {props.MainMemoData.memo}
                </textarea> */}

                <ul className='main_textarea_correct'>
                    <li>
                        {/* <button
                            onClick={(i) => {
                                let dataCorrect = [...props.MainMemoData];
                                dataCorrect[i].unshift(correctMainMemo);
                                correctMainMemoInput(dataCorrect)

                            }}>확인
                        </button> */}
                    </li>
                    <li>
                        <button onClick={(i) => {
                            MainMemoDirect(false, i);
                        }}>취소</button>
                    </li>
                </ul>

                <div></div>
            </div>

        )

    }

    if(props) {
        
        return (

            <div className='common_page'>
    
                <div className='content_area'>
    
                    {/* 추후에 추가될 내용. : 범주화가 가능해야 한다. */}
    
                    <div className='memo_btn'>
                        <button href='#' onClick={() => {
    
                            console.log(props);
                            let dataCorrect = [...props.MainMemoData];
                            dataCorrect.unshift(AddMainMemo);
                            props.MainMemoCorrect(dataCorrect);
                        }}>메모 추가하는 버튼</button>
                    </div>
    
                    <div className='memo_input'>
    
                        <textarea onInput={(e) => {
                            AddMainMemoInput(e.target.value);
                        }}>
    
                        </textarea>
    
                    </div>
    
                    <div className='memo_wrap'>
    
                        {
                            props.MainMemoData.map(function (a, i) {
                                return (
                                    <div className='memo_content' key={i} onClick={() => { setShowComponent(a, a.id) }}>
                                        <p className='font_text'>{props.MainMemoData[i].memo}</p>
                                    </div>
                                )
                            })
                        }
    
                        {showComponent && <AnnotationContent props={props.MainMemoData} id={showComponent} />}
    
                    </div>
                </div>
            </div>
    
        )

    }

    function AnnotationContent(props) {

        let [fade, setFade] = useState('')

        useEffect(() => {
            const fadeTimer = setTimeout(() => { setFade('showThis') }, 100)
            return () => {
                clearTimeout(fadeTimer);
                setFade('')
            }
        }, props)

        return (

            <div className={`annotation_content ${props.id ? fade : ""}`}>

                <div className='annotation_content_pos'>
                    <title className='font_text color_w'>{props.id.memo}</title>
                </div>

                <button className='color_w' onClick={() => setShowComponent()}>임시 닫기 버튼</button>

            </div>

        )

    }

}

export default Memo;
