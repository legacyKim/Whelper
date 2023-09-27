
import { React, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useParams } from 'react-router-dom';

import { searchListDataCorrect, searchListDataDelete } from "../store.js"

import '../css/style.css';

function Search() {

    let { searchInputValue } = useParams();
    const [searchPageInput, setSearchPageInput] = useState(searchInputValue);

    let searchListState = useSelector((state) => state.SearchData);
    const dispatch = useDispatch();
    const newSearch = useRef();

    let newSearchBtn = () => {
        const searchContent = newSearch.current.value;
        const searchContentDupli = searchListState.filter(item => item.searchContent === searchContent);

        if (searchContentDupli.length !== 0) {
            dispatch(searchListDataDelete({ searchContent: searchContentDupli[0].searchContent }));
        }

        dispatch(searchListDataCorrect({ searchContent }));
    }

    useEffect(() => {
        console.log(searchPageInput);
    }, [searchListState]);

    return (

        <div className='content_area'>
            <div className='search_result'>
                <span className='search_input search_input_limit'>
                    <input type='text' ref={newSearch} value={searchPageInput} onChange={(e) => setSearchPageInput(e.target.value)}></input>
                    <button className='icon-search search_input_btn' onClick={newSearchBtn}></button>
                </span>
            </div>
        </div>

    )

}

export default Search;