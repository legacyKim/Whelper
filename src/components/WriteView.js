import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { syncWriteListData, syncWriteListDataUpdate } from '../data/reducers.js';
import { writeListDataDel } from '../data/api.js'
import { useParams } from 'react-router-dom';

import ViewEdit from './SlateView.js'

import { token_check } from '../data/token_check.js'

function WriteView() {

    const writeListState = useSelector((state) => state.WriteData);

    let { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(syncWriteListData());
        dispatch(syncWriteListDataUpdate());
    }, [dispatch]);

    const writeListArr = writeListState.data.write || [];
    const writeListCheck = (id) => {
        for (var i = 0; i < writeListArr.length; i++) {
            if (writeListArr[i].id === Number(id)) {
                return writeListArr[i];
            }
        }
    };

    const [writeContent, setWriteContent] = useState(() => writeListCheck(id));

    const titleDoc = (writeContent !== undefined) ? new DOMParser().parseFromString(writeContent.title, 'text/html') : null;
    const subTitleDoc = (writeContent !== undefined) ? new DOMParser().parseFromString(writeContent.subTitle, 'text/html') : null;
    const contentDoc = (writeContent !== undefined) ? new DOMParser().parseFromString(writeContent.content, 'text/html') : null;

    const lsKeywords = JSON.parse(localStorage.getItem('view_keywords')) || [];
    const keywordsParse = (writeContent !== undefined) ? JSON.parse(writeContent.keywords) : lsKeywords;

    localStorage.setItem('view_keywords', JSON.stringify(keywordsParse));

    useEffect((id) => {
        setTimeout(() => {
            const memoContentElements = document.querySelectorAll('.view_page');
            memoContentElements.forEach(element => {
                element.classList.remove('opacity');
            });
        }, 100)
    }, [writeListArr])

    const delWriteList = async (e) => {
        e.preventDefault();
        const isTokenValid = await token_check(navigate);

        if (isTokenValid) {
            dispatch(writeListDataDel(writeContent.id))
            navigate('/components/WriteList');
        }
    }

    const [annoBtn, setAnnoBtn] = useState();
    const [annoClick, setAnnoClick] = useState();

    const [annoArr] = useState([])

    const anno_numbering = () => {

        const anno_num = document.querySelectorAll('.editor_anno');
        const anno_length = anno_num.length;

        var latest_index;
        anno_num.forEach((element, index) => {

            element.setAttribute('anno-data-num', `${index + 1}`)
            element.style.setProperty('--anno-num', `'${index + 1})'`);

            if (element.dataset.eventRegistered !== true) {
                element.addEventListener('click', (e) => {
                    e.preventDefault()
                    setAnnoBtn(true);
                    setAnnoClick(Number(element.getAttribute('anno-data-num')));
                });
                element.dataset.eventRegistered = true;
            }

        });

        return [latest_index, anno_length];
    };

    useEffect(() => {
        anno_numbering();
        document.querySelectorAll('.editor_anno').forEach((ele) => {
            ele.classList.add('editing');
        })
    }, []);

    const writeNavi = async (e) => {
        e.preventDefault();
        const isTokenValid = await token_check(navigate);

        if (isTokenValid) {
            navigate(`/components/WriteCorrect/${writeContent.id}`)
        }
    }

    return (

        <div className='view_page opacity'>
            <div className='common_page'>
                <div className='content_area'>
                    <div className='view_content all'>

                        <ViewEdit titleDoc={titleDoc} subTitleDoc={subTitleDoc} contentDoc={contentDoc}></ViewEdit>

                        <div className='write_keyword_view'>
                            {keywordsParse.map((k, j) => (
                                <WriteKeyword key={j} writeListKeyword={k} />
                            ))}
                        </div>
                    </div>

                    <AnnoList annoArr={annoArr} annoBtn={annoBtn} setAnnoBtn={setAnnoBtn} annoClick={annoClick} setAnnoClick={setAnnoClick} />

                    <div className='page_btn'>
                        <Link className='icon-trash' onClick={delWriteList}></Link>
                        <Link className='icon-edit-alt' onClick={writeNavi}></Link>
                    </div>
                </div>
            </div>
        </div>
    );

    function WriteKeyword({ writeListKeyword }) {
        return <Link to={`/components/Category/${writeListKeyword}`}>#{writeListKeyword}</Link>
    }

}

function AnnoList({ annoArr, annoBtn, setAnnoBtn, annoClick }) {

    const annoArrList = annoArr;

    const annoBtnActive = () => {
        if (annoBtn === true) {
            setAnnoBtn(false);
        } else {
            setAnnoBtn(true);
        }
    }

    useEffect(() => {
        document.querySelectorAll('.annoList li').forEach((ele, index) => {
            ele.classList.remove('active');
            if (annoClick === index + 1) {
                ele.classList.add('active')
            }
        })
    }, [annoClick])

    return (
        <div className={`annotation_list ${annoBtn === true ? 'active' : ''}`}>
            <button className="annotation_btn" onClick={annoBtnActive}>
                <i className='icon-list-bullet'></i>
            </button>
            <ul className="annoList scroll">

                {
                    annoArrList.map(function (a, i) {
                        return (
                            <li key={i}>
                                <span className="num">
                                    {annoArrList[i].index})
                                </span>
                                <p className="anno_content">
                                    {annoArrList[i].content}
                                </p>
                            </li>
                        )

                    })
                }

            </ul>
        </div>
    )
}


export default WriteView;