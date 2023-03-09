import React, { useState, useEffect } from 'react';

import '../css/components.css';
import { NavLink, useNavigate } from 'react-router-dom';

// import { getWriteList } from '../Api';

function Write(props) {

    const [showComponent, setShowComponent] = useState();

    console.log(props);

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

        console.log(props);
    
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

export default Write;