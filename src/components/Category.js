
import { React, useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"

import '../css/style.css';

function Category() {

    let cateListData = useSelector((state) => state.cateData);

    return (

        <div className='content_area'>

            {
                cateListData.map(function (a, i) {
                    return (
                        <div key={i}>
                            test123123
                            <CategoryList cate={a}></CategoryList>
                        </div>
                    )
                })
            }

        </div>

    )

    function CategoryList({cate}) {

        return (
            <div>{cate}</div>
        )
    }


}

export default Category;