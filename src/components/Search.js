
import { React, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useParams, Link } from 'react-router-dom';

import { searchListDataCorrect, searchListDataDelete } from "../store.js"

import '../css/style.css';

function Search() {

    let { searchInputValue } = useParams();
    const [searchFrist, setFirstSearch] = useState(searchInputValue);
    const [searchPageInput, setSearchPageInput] = useState(searchFrist);

    // about search
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
        setSearchPageInput(searchFrist);
    }
    //// about search

    // about search result filter
    let writeListState = useSelector((state) => state.WriteData);

    var searchFilter = writeListState.filter((a) => {
        var searchCompare = a.content;
        return searchCompare.includes(searchPageInput);
    });
    //// about search result filter

    return (

        <div className='content_area'>
            <div className='search_result'>
                <span className='search_input search_input_limit'>
                    <input type='text' ref={newSearch} value={searchFrist} onInput={(e) => setFirstSearch(e.target.value)}></input>
                    <button className='icon-search search_input_btn' onClick={newSearchBtn}></button>
                </span>
                <ul className='search_result_list'>
                    {
                        searchFilter.map((a, i) => {
                            return (
                                <li key={i}>
                                    <SearchResult i={i} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>

    )

    function SearchResult({ i }) {

        return(

            <div>
                <Link to={`/components/WriteView/${searchFilter[i].id}`}>{searchFilter[i].content}</Link>
            </div>

        )

    }

}

export default Search;