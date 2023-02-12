import React, { useState } from 'react';
import MemoContentData from '../memoList'

import '../css/components.css';

function Memo() {

    let [MainMemoData, MainMemoCorrect] = useState(MemoContentData);

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

    // textarea 열고 닫기
    let [MainMemoActive, MainMemoDirect] = useState(false);

    // 새로 작성되는 글이 담기는 곳.
    let [AddMainMemo, AddMainMemoInput] = useState('');

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

                {/* 메모창의 경우 작은 인풋 박스를 만들어 놓고 저장만 하면 차례대로 기입되는 방식. */}

                <div className='memo_input'>

                    <textarea onInput={(e) => {
                        AddMainMemoInput(e.target.value);
                    }}>

                    </textarea>

                </div>

                {

                    MainMemoData.map(function (a, i) {

                        return (

                            <div className='memotext' key={i}>

                                {/* <div className='memo_annotation'>
                                    <a href='javascritp:void(0)'>
                                        주석
                                    </a>
                                </div> */}

                                {/* 내용이 들어오는 영역 */}

                                <div className='memo_text'>

                                    <div className='memo_box'>
                                        <ul className='content_memo_btn'>
                                            <li>
                                                <a href="#" onClick={(i) => {
                                                    MainMemoDirect(true, i);
                                                }}>
                                                    수정
                                                </a>
                                            </li>
                                            <li>
                                                <a href='#' onClick={(i) => {
                                                    let dataCorrect = [...MainMemoData];
                                                    dataCorrect.splice(i, 1);
                                                    MainMemoCorrect(dataCorrect);
                                                }}>
                                                    삭제
                                                </a>
                                            </li>
                                        </ul>

                                        {/* 주 내용이 들어오는 영역 // 데이터베이스에서 불러오는 영역 */}

                                        <p className='main_memo'>
                                            {MainMemoData[i].memo}
                                        </p>

                                        {/* 수정 클릭 시에 열리는 코드. */}

                                        {
                                            MainMemoActive == true ? <MainMemoSet MainMemoData={MainMemoData[i]} i={1} /> : null
                                        }
                                    </div>

                                    <div className='memo_box memo_box_annotaion'>
                                        <ul className='content_memo_btn'>
                                            <li>
                                                <a href="#">
                                                    수정
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">
                                                    삭제
                                                </a>
                                            </li>
                                        </ul>

                                        {/* 주석이 들어오는 영역 // 데이터베이스에서 불러오는 영역 */}

                                        <p className='sub_memo'>

                                        </p>

                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

                <div className='memo_wrap'>

                    {

                        MainMemoData.map(function (a, i) {

                            return (

                                <div className='memo_content'>

                                    <p className='font_text'>{MainMemoData[i].memo}</p>

                                </div>

                            )

                        })

                    }

                </div>

            </div>
        </div>
    )
}

// 데이터베이스에서 불러오는 컴포넌트

function AnnotationContent(props) {

    console.log(props);

    return (

        // memo 버튼 추가. 수정, 삭제, 주석 추가 등...

        <div className='annotation_content'>

            <div className='annotation_content_pos'>

                <div className='annotation_content_text'>
                    <title></title>
                </div>

            </div>

        </div>

    )

}

// 주석이 추가될 경우에 형성되는 컴포넌트
// 굳이 필요한가???

function Annotation() {

    return (

        <div className='Annotation'>

            <textarea></textarea>

        </div>

    )

}

export default Memo;
