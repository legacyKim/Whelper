import React, { useState, useEffect } from 'react';

import '../css/components.css';
import { useNavigate } from 'react-router-dom';

// import { getWriteList } from '../Api';

function WriteList(props) {

    const [showComponent, setShowComponent] = useState();

    /*

    const [write, setWrite] = useState(props);

    const memoSubmit = async (event) => {

        try {
            const response = await axios.post('http://localhost:3000/api/Write', { memo: newMemo });
            setMemo([...props, response.data]);
            setNewMemo('');
        } catch (err) {
            console.error(err);
        }
    }

    const memoDelete = async (a) => {

        try {
            const response = await axios.delete(`http://localhost:3000/api/Write`, { data: { memo: a.memo } });
            const updatedMemoList = props.MainMemoData.filter(memo => memo.memo !== a.memo);
            setMemo(updatedMemoList);
        } catch (err) {
            console.error(err);
        }
    }

     */

    return (

        <div className='common_page'>
            <div className='content_area'>

                {
                    props.WriteListData.map(function (a, i) {
                        return (
                            <div className='WriteDiv' key={i} onClick={() => { setShowComponent(a, a.id) }}>
                                <WriteList props={props.WriteListData[i]} i={i} />
                            </div>
                        )
                    })
                }

                {showComponent && <View props={props.WriteListData} id={showComponent} />}

                {/* <Routes>
                        <Route path="/components/View/:id" element={<View WriteListData={WriteListData}/>} />
                    </Routes> */}

            </div>
        </div>

    )

    function WriteList(props) {

        const navigate = useNavigate();

        return (

            <div className='write_list'>
                <div className='write_list_btn'>
                    <button></button>
                    <button></button>
                </div>
                <span>{props.props.title}</span>
                <strong>{props.props.subTitle}</strong>
                <p>{props.props.content}</p>
            </div>

        )

    }

    function View(props) {

        let [fade, setFade] = useState('')

        useEffect(() => {
            const fadeTimer = setTimeout(() => { setFade('showThis') }, 100)
            return () => {
                clearTimeout(fadeTimer);
                setFade('')
            }
        }, props)

        return (

            <div className={`view_page ${props.id ? fade : ""}`}>
                <div className='view_content'>
                    <title>{props.id.title}</title>
                    <span>{props.id.subTitle}</span>
                    <p>{props.id.content}</p>
                </div>

                <button className='color_w' onClick={() => setShowComponent()}>임시 닫기 버튼</button>
            </div>

        )

    }


}

export default WriteList;