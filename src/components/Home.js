import { React, useEffect, useState, useRef, } from 'react';
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"

import Date from './Date.js'

function Home() {

    return (
        <div>
            <Date />
        </div>
    )

}

export default Home;