import '../css/style.css';

import { useSelector } from "react-redux"
import { useParams } from 'react-router-dom';

function Search () {

    let searchListState = useSelector((state) => state.SearchData);
    let { searchInputValue } = useParams();

    return (

        <div className='search_result'>

            <span>검색어 :: <strong>{searchInputValue}</strong></span>

        </div>

    )

}

export default Search;