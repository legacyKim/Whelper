import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import '../css/components.css';

function Memo() {

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

                <textarea onInput={(e) => {
                    correctMainMemoInput(e.target.value);
                }}>
                    {props.MainMemoData.memo}
                </textarea>

                <ul className='main_textarea_correct'>
                    <li>
                        <button
                            onClick={(i) => {
                                let dataCorrect = [...MainMemoData];
                                dataCorrect[i].unshift(correctMainMemo);
                                correctMainMemoInput(dataCorrect)

                            }}>확인
                        </button>
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

    return (

        <div className='common_page'>

            <div className='content_area'>

                {/* 추후에 추가될 내용. : 범주화가 가능해야 한다. */}

                <div className='memo_btn'>
                    <button href='#' onClick={() => {
                        let dataCorrect = [...MainMemoData];
                        dataCorrect.unshift(AddMainMemo);
                        MainMemoCorrect(dataCorrect)
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
                        MainMemoData.map(function (a, id, i) {

                            return (
                                <div className='memo_content' key={i} onClick={() => { setShowComponent(a, a.id) }}>
                                    <p className='font_text'>{MainMemoData[i].memo}</p>
                                </div>
                            )

                        })

                    }

                    {showComponent && <AnnotationContent MainMemoData={MainMemoData} id={showComponent} />}

                </div>
            </div>
        </div>

    )

    function AnnotationContent(props) {

        return (

            // memo 버튼 추가. 수정, 삭제, 주석 추가 등...

            <div className={`annotation_content ${props.id ? "showThis" : ""}`}>

                <div className='annotation_content_pos'>
                    <title className='font_text color_w'>{props.id.memo}</title>
                </div>

                <button className='color_w' onClick={() => setShowComponent()}>임시 닫기 버튼</button>

            </div>

        )

    }


}

// 데이터베이스에서 불러오는 컴포넌트

function Annotation() {

    return (

        <div className='Annotation'>

            <textarea></textarea>

        </div>

    )

}

export default Memo;
