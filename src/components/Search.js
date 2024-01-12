
import { React, useEffect, useState, useRef, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useParams, Link } from 'react-router-dom';
import MyContext from '../context'

import '../css/style.css';
import ViewEdit from './SlateView.js'

function Search() {

    let { searchInputValue } = useParams();
    const [searchFrist, setFirstSearch] = useState(searchInputValue);
    const [searchPageInput, setSearchPageInput] = useState(searchFrist);

    // about search
    const { searchArr, setSearchArr } = useContext(MyContext);

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

        return (

            <div>
                <Link to={`/components/WriteView/${searchFilter[i].id}`}>
                    <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>
                </Link>
                <div className='write_keyword'>
                    <ul className='write_keyword_list'>
                        {
                            searchFilter[i].keyword.map((k, i) => (
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