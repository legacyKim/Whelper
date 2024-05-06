
import { React, useEffect, useState, useRef, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { useParams, Link } from 'react-router-dom';
import MyContext from '../context'

import ViewEdit from './SlateView.js'
import { writeListData_search } from '../data/api.js';

const deserialize = (el, markAttributes = {}) => {

    if (el.nodeType === 3) {
        return { text: el.textContent, ...markAttributes };
    } else if (el.nodeType !== 1) {
        return null
    }

    const nodeAttributes = { ...markAttributes }

    switch (el.nodeName) {
        case 'STRONG':
            nodeAttributes.bold = true
            break;
        case 'SPAN':
            if (el.classList.contains('editor_highlight')) {
                nodeAttributes.highlight = true;
            }
            break;
    }

    const children = Array.from(el.childNodes)
        .map(node => deserialize(node, { ...nodeAttributes }))
        .flat()

    if (children.length === 0) {
        children.push({ text: '', ...nodeAttributes });
    }

    switch (el.nodeName) {
        case 'BODY':
            return children;
        case 'P':
            return { type: 'paragraph', children };
        default:
            return children;
    }

}

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
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(writeListData_search())
    }, [dispatch]);

    const writeListState = useSelector((state) => state.WriteData);
    const writeListArr = writeListState.data.write.filter(item => item !== null) || [];

    var searchFilter = writeListArr.filter((a) => {
        const contentDoc = new DOMParser().parseFromString(a.content, 'text/html');
        const contentValue = deserialize(contentDoc.body);
        var searchCompare = contentValue !== null ? contentValue[0].children[0].text : '';
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