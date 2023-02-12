import React, {useState} from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import {
    Route,
    Routes,
    useLocation
} from "react-router-dom";

import './css/App.css';
import './css/header.css';

import List from './components/List'
import Memo from './components/Memo'
import Write from './components/Write'
import Side from './components/Side'
import Search from './components/Search'
import View from './components/View'

import WriteContentData from './data'

function Menu() {

    let [WriteListData] = useState(WriteContentData);
    const location = useLocation();

    return (

        <div className='menuWrap'>

            <TransitionGroup component={null}>
                <CSSTransition key={location.key} classNames="fade" timeout={300}>
                    <Routes location={location}>

                        <Route exact path="/" />

                        <Route exact path="/components/Side" element={<Side />} />
                        <Route exact path="/components/Search" element={<Search />} />

                        <Route exact path="/components/List" element={<List />} />
                        <Route path="/components/Memo" element={<Memo />} />

                        <Route path="/components/Write" element={<Write WriteListData={WriteListData}/>} />
                        <Route path="/components/View/:id" element={<View WriteListData={WriteListData}/>} />
                        {/* <Route path="/components/Correct" element={<Correct />} /> */}

                    </Routes>
                </CSSTransition>
            </TransitionGroup>

        </div>

    )

}

export default Menu;