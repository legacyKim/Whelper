import React, { useState, useContext } from 'react';

import { TransitionGroup, CSSTransition } from "react-transition-group";

import axios from 'axios';
import MyContext from './context'

import { Route, Routes, useLocation } from "react-router-dom";
import history from './history.ts'

// import App from './App.js'
import Date from './components/Date.js'
import Login from './components/Login.js'

import Memo from './components/Memo.js'

import Write from './components/Write.js'
import WriteList from './components/WriteList.js'
import WriteView from './components/WriteView.js'
import WriteCorrect from './components/WriteCorrect.js'
import AnnoLink from './components/AnnoLink.js'

import Category from './components/Category.js'
import Search from './components/Search.js'
import Admin from './admin/Admin.js'

import Work from './components/Work.js'

function Menu() {

    const { showHeader } = useContext(MyContext);
    const location = useLocation();

    return (

        <div className={`menuWrap ${showHeader === true ? "active" : ""}`}>

            <TransitionGroup component={null}>
                <CSSTransition key={location.key} classNames="fade" timeout={300}>
                    <Routes location={location} history={history}>

                        <Route exact path="/" element={<Date />} />

                        {/* <Route path="/components/Slate" element={<Slate />} /> */}
                        <Route path="/components/Login" element={<Login />} />

                        <Route path="/components/Write" element={<Write />} />
                        <Route path="/components/WriteList" element={<WriteList />} />
                        <Route path="/components/WriteView/:id" element={<WriteView />} />
                        <Route path="/components/WriteCorrect/:id" element={<WriteCorrect />} />

                        <Route path="/components/Category" element={<Category />} />
                        <Route path="/components/Category/:writeListKeyword" element={<Category />} />
                        <Route path="/components/AnnoLink" element={<AnnoLink />} />

                        <Route path="/components/Search/:searchInputValue" element={<Search />} />

                        <Route path="/components/Memo" element={<Memo />} />
                        <Route path="/components/Work" element={<Work />} />
                        <Route path="/admin/Admin" element={<Admin />} />

                    </Routes>
                </CSSTransition>
            </TransitionGroup>

        </div>

    )

}

export default Menu;