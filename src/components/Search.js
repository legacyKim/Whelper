
import { React, useEffect, useState, useRef, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useParams, Link } from 'react-router-dom';

import { debounce } from 'lodash';
import MyContext from '../context'

import ViewEdit from './SlateView.js'
import { writeListSearchData } from '../data/api.js';
import { resetWriteSearch } from "../data/reducers.js"

function Search() {

    let { searchInputValue } = useParams();

    const [searchFrist, setFirstSearch] = useState(searchInputValue);
    const [searchPageInput, setSearchPageInput] = useState(searchFrist);

    // about search
    const { searchArr, setSearchArr, rootHeight, searchScrollPosition, setSearchScrollPosition } = useContext(MyContext);

    const newSearch = useRef();
    let newSearchBtn = () => {
        setSearchPageInput(searchFrist);
        setSearchArr((prevKeywordArr) =>
            searchArr.includes(searchFrist)
                ? [...new Set(prevKeywordArr.filter((item) => item !== searchFrist)), searchFrist]
                : [...prevKeywordArr, searchFrist]
        );
    }

    useEffect(() => {
        // local storage
        localStorage.setItem('searchHistory', JSON.stringify(searchArr));
    }, [searchArr]);
    //// about search

    // about search result filter
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);

    const writeListState = useSelector((state) => state.WriteListSearchDataOn);
    const searchFilter = writeListState.data.write || [];

    const [totalPages, setTotalPages] = useState(writeListState.data.totalPages);

    useEffect(() => {
        dispatch(resetWriteSearch());
        dispatch(writeListSearchData({ page: 1, searchPageInput })).then(() => {
            setTotalPages(writeListState.data.totalPages);
            setPage(1);
        });
    }, [searchPageInput])

    const updateScroll = useCallback(
        debounce(() => {
            setSearchScrollPosition(window.scrollY || document.documentElement.scrollTop);
        }, 100),
        []
    );

    useEffect(() => {
        window.addEventListener('scroll', updateScroll);
        return () => {
            window.removeEventListener('scroll', updateScroll);
        };
    }, []);

    useEffect(() => {
        const searchAreaHeight = document.querySelector('.content_area_search').offsetHeight

        if (page <= totalPages) {
            if (searchAreaHeight <= Math.ceil(searchScrollPosition + rootHeight)) {
                setPage((prevPage) => prevPage + 1);
            }
        }
    }, [searchScrollPosition]);

    useEffect(() => {
        if (page <= totalPages) {
            dispatch(writeListSearchData({ page, searchPageInput }));
        }
    }, [page]);
    //// about search result filter

    return (

        <div className='content_area content_area_search'>
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
                                    <SearchResult i={i} searchFilter={searchFilter} />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )

    function SearchResult({ i, searchFilter }) {

        const titleDoc = new DOMParser().parseFromString(searchFilter[i].title, 'text/html');
        const subTitleDoc = new DOMParser().parseFromString(searchFilter[i].subTitle, 'text/html');
        const contentDoc = new DOMParser().parseFromString(searchFilter[i].content, 'text/html');
        const keywordsParse = JSON.parse(searchFilter[i].keywords)

        return (

            <div>
                <Link to={`/components/WriteView/${searchFilter[i].id}`}>
                    <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
                </Link>
                <div className='write_keyword'>
                    <ul className='write_keyword_list'>
                        {
                            keywordsParse.map((k, i) => (
                                <li key={i}>
                                    <WriteKeyword writeListKeyword={k} />
                                </li>
                            ))
                        }
                    </ul>

                    {/* <b className='write_date'>{writeDate}</b> */}

                </div>
            </div>

        )

    }

    function WriteKeyword({ writeListKeyword }) {

        return (
            <Link to={`/components/Category/${writeListKeyword}`}>#{writeListKeyword}</Link>
        );

    }

}

export default Search;