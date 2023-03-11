import React from 'react';
// import type { FC } from "react";

import {
  NavLink, useNavigate
} from "react-router-dom";

import './css/App.css';
import './css/header.css';

import Menu from './Menu'

function App() {

  const navigate = useNavigate();

  // const Page: FC<{ to: string }> = (props) => <main><Link {...props} /></main>; // prettier-ignore

  return (

    <div className="App">
      <div className='header'>
        <div className='Header_area'>
          <div className='header_pos'>

            <div className='logo'>
              <NavLink to="/" onClick={()=>{navigate('/')}}>
                React Project
              </NavLink>
            </div>

            <div className='header_btn'>
              <div className='write_btn'>
                <NavLink to="/components/WriteList" onClick={()=>{navigate('/components/WriteList')}}>
                  WRITE
                </NavLink>
              </div>
              <div className='write_btn'>
                <NavLink to="/components/Memo" onClick={()=>{navigate('/components/Memo')}}>
                  MEMO
                </NavLink>
              </div>
              <div className='search_bar'>
                <NavLink to="/components/Search" onClick={()=>{navigate('/components/Search')}}>
                  SEARCH
                </NavLink>
              </div>
              <div className='index_btn'>
                <NavLink to="" onClick={()=>{navigate('/components/Side')}}>
                  SIDE
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Menu></Menu>

    </div>

  );

}

export default App;
