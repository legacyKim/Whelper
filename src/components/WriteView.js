import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { createEditor, Transforms, Node } from 'slate';

import '../css/style.css';

const deserialize = string => {
    return [
        {
            type: 'paragraph',
            children: [{ text: string }],
        },
    ];
};

function WriteView() {

    const writeListState = useSelector((state) => state.WriteData);
    let { id } = useParams();

    const [writeContent, setWriteContent] = useState(writeListState[id]);

    const [titleEditor] = useState(() => withReact(createEditor()))
    const [subTitleEditor] = useState(() => withReact(createEditor()))
    const [editor] = useState(() => withReact(createEditor()))
    
    const titleValue = useMemo(() => deserialize(JSON.parse(writeContent.title)))
    const subTitleValue = useMemo(() => deserialize(JSON.parse(writeContent.subTitle)))
    const contentValue = useMemo(() => deserialize(JSON.parse(writeContent.content)))

    return (
        <div className='view_page'>
            <div className='common_page'>
                <div className='content_area'>
                    <div className='view_content'>

                        <Slate editor={titleEditor} initialValue={titleValue}>
                            <Editable className="title" readOnly />
                        </Slate>

                        <Slate editor={subTitleEditor} initialValue={subTitleValue}>
                            <Editable className="subtitle" readOnly />
                        </Slate>

                        <Slate editor={editor} initialValue={contentValue}>
                            <Editable className="content" readOnly />
                        </Slate>

                        <div className='write_keyword_view'>
                            {writeContent.keyword.map((k, j) => (
                                <WriteKeyword key={j} writeListKeyword={k} />
                            ))}
                        </div>
                    </div>
                    <button className='page_btn'>
                        <Link className='icon-edit-alt' to={`/components/WriteCorrect/${id}`} />
                    </button>
                </div>
            </div>
        </div>
    );

    function WriteKeyword({ writeListKeyword }) {
        return <Link to={`/components/Category/${writeListKeyword}`}>#{writeListKeyword}</Link>
    }
}

export default WriteView;