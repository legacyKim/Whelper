import React, { useState } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import axios from 'axios';

import { Route, Routes, useLocation } from "react-router-dom";
import history from './history.ts'

import './css/style.css';

import Memo from './components/Memo.js'

import Write from './components/Write.js'
import WriteList from './components/WriteList.js'
import WriteView from './components/WriteView.js'
import WriteCorrect from './components/WriteCorrect.js'

import Date from './components/Date.js'
import Category from './components/Category.js'
import Search from './components/Search.js'

function Menu() {

    const location = useLocation();
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

                        {/* <Route path="/components/Slate" element={<Slate />} /> */}
                        <Route path="/components/Write" element={<Write />} />
                        <Route path="/components/WriteList" element={<WriteList />} />
                        <Route path="/components/WriteView/:id" element={<WriteView />} />
                        <Route path="/components/WriteCorrect/:id" element={<WriteCorrect />} />

                        <Route path="/components/Date" element={<Date />} />

                        <Route path="/components/Category" element={<Category />} />
                        <Route path="/components/Category/:writeListKeyword" element={<Category />} />

                        <Route path="/components/Search/:searchInputValue" element={<Search />} />

                        <Route path="/components/Memo" element={<Memo MainMemoData={MainMemoData} />} />

                    </Routes>
                </CSSTransition>
            </TransitionGroup>

        </div>

    )

}

export default Menu;