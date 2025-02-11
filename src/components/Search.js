
import { React, useEffect, useState, useRef, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useParams, Link } from 'react-router-dom';

import { writeListSearchData } from '../data/api.js';
import { resetWriteSearch } from "../data/reducers.js"

import MyContext from '../context'
import ViewEdit from './ViewEdit.js'

import writeNavi from './hook/writeNavi.js';

import Lock from './func/Lock.js';
import deserialize from './hook/deserialize.js';


import { FixedSizeList as List } from "react-window";

function Search() {

    let { searchInputValue } = useParams();

    const [searchFrist, setFirstSearch] = useState(searchInputValue !== 'undefined' ? searchInputValue : '');
    const [searchPageInput, setSearchPageInput] = useState(searchFrist);

    // about search
    const { isAuth, searchArr, setSearchArr, rootHeight, writeListCheckPwCorr } = useContext(MyContext);

    const newSearch = useRef('');
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

    const writeListState = useSelector((state) => state.WriteListSearchDataOn);
    const searchFilter = writeListState.data.write || [];

    useEffect(() => {
        dispatch(resetWriteSearch());
        dispatch(writeListSearchData({ searchPageInput }))
    }, [searchPageInput]);

    const SearchRow = ({ index, style, data }) => {
        const { searchFilter } = data;

        return (
            <li style={style} key={index}>
                <SearchResult searchFilter={searchFilter[index]} />
            </li>
        );
    };

    const content_area_search = useRef(null);
    const [listHeight, setListHeight] = useState(0);

    let contentBoxHeight;

    if (isAuth === false) {
        contentBoxHeight = 225;
    } else {
        contentBoxHeight = 225;
    }

    useEffect(() => {
        if (content_area_search.current) {
            setListHeight(content_area_search.current.clientHeight);
        }

        const handleResize = () => {
            if (content_area_search.current) {
                setListHeight(content_area_search.current.clientHeight);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (

        <div className='content_area content_area_search'>
            <div className='search_result'>
                <span className='search_input search_input_limit'>
                    <input type='text' ref={newSearch} value={searchFrist} placeholder='검색어를 입력해 주세요' onInput={(e) => setFirstSearch(e.target.value)}></input>
                    <button className='icon-search search_input_btn' onClick={newSearchBtn}></button>
                </span>
                <ul className='search_result_list' ref={content_area_search}>
                    {content_area_search && searchFilter && (
                        <List className={`write_virtualize virtualize ${isAuth !== false ? 'auth' : ''}`}
                            height={listHeight}
                            itemCount={searchFilter.length}
                            itemSize={contentBoxHeight}
                            width="100%"
                            itemData={{ searchFilter, isAuth }}
                        >
                            {SearchRow}
                        </List>
                    )}
                </ul>
            </div>
        </div>
    )

    function SearchResult({ i, searchFilter }) {

        console.log(searchFilter);

        const titleDoc = searchFilter.title;
        const subTitleDoc = searchFilter.subTitle;
        const contentDoc = deserialize(new DOMParser().parseFromString(searchFilter.content, 'text/html').body);
        const keywordsParse = JSON.parse(searchFilter.keywords)

        const write_password = searchFilter.password;
        const writeContentId = searchFilter.id;

        const writePath = `/components/WriteView/${writeContentId}`;

        // lock pop
        const [writeListCheckPop, setWriteListCheckPop] = useState(false);
        //// lock pop

        return (

            <div className='write_list'>
                <div className="fake_div">
                    <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
                    {write_password != null && write_password !== '' && (
                        <i className="lock icon-lock-1"></i>
                    )}
                </div>

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
                </div>

                <Lock isAuth={isAuth} write_password={write_password} writeContentId={writeContentId} writeListCheckPwCorr={writeListCheckPwCorr} writeNavi={writeNavi} writePath={writePath} writeListCheckPop={writeListCheckPop} setWriteListCheckPop={setWriteListCheckPop}></Lock>
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