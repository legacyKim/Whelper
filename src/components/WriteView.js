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

    const [editor] = useState(() => withReact(createEditor()))
    const initialValue = useMemo(() => deserialize(JSON.parse(writeContent.content)))

    console.log(initialValue);

    return (
        <div className='view_page'>
            <div className='common_page'>
                <div className='content_area'>
                    <div className='view_content'>
                        <title>{writeContent.title}</title>
                        <span>{writeContent.subTitle}</span>

                        {/* writeListState => writeContent.content */}
                        <Slate className="test" editor={editor} initialValue={initialValue}>
                            <Editable readOnly />
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