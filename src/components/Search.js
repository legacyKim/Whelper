import '../css/style.css';

import { useSelector } from "react-redux"
import { useParams } from 'react-router-dom';

function Search () {

    let searchListState = useSelector((state) => state.SearchData);
    let { id } = useParams();

    return (

        <div className='search_result'>

            <span>검색어 :: <strong>{searchListState[id].searchContent}</strong></span>

        </div>

    )

}

export default Search;