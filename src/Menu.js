import React, { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import axios from 'axios';

import { Route, Routes, useLocation, useParams } from "react-router-dom";
import history from './history.ts'

import './css/App.css';
import './css/header.css';

import List from './components/List'
import Memo from './components/Memo'
import WriteList from './components/WriteList'
import Side from './components/Side'
import Search from './components/Search'
import View from './components/View'

function Menu() {

    const location = useLocation();
    const [WriteListData, setWriteListData] = useState([]);
    const [MainMemoData, MainMemoCorrect] = useState([]);

    // useEffect(async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:3000/api/WriteList`);
    //         setWriteListData(response.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }, []);

    // useEffect(async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:3000/api/Memo`);
    //         MainMemoCorrect(response.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }, []);

    return (

        <div className='menuWrap'>

            <TransitionGroup component={null}>
                <CSSTransition key={location.key} classNames="fade" timeout={300}>
                    <Routes location={location} history={history}>

                        <Route exact path="/" />

                        <Route path="/components/Side" element={<Side />} />
                        <Route path="/components/Search" element={<Search />} />
                        <Route path="/components/List" element={<List />} />
                        <Route path="/components/Memo" element={<Memo MainMemoData={MainMemoData} />} />
                        <Route path="/components/WriteList" element={<WriteList />} />
                        <Route path="/components/View/:id" element={<View />} />

                    </Routes>
                </CSSTransition>
            </TransitionGroup>

        </div>

    )

}

export default Menu;