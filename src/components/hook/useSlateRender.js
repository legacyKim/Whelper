import React, { useCallback } from 'react'

const useSlateRender = (contentEditableFalse) => {

    const renderElement = useCallback(({ attributes, children, element }) => {
        switch (element.type) {
            case 'blockquote':
                return <blockquote {...attributes} className="editor_quote">{children}</blockquote>;
            case 'paragraph':
                return <p {...attributes}>{children}</p>;
            case 'link': {
                return (
                    <a
                        {...attributes}
                        href={element.url}
                        target="_blank"
                        className="editor_link"
                        contentEditable={contentEditableFalse !== true ? true : false}
                        suppressContentEditableWarning
                    >
                        {children}
                    </a>
                );
            }
            default:
                return <div {...attributes}>{children}</div>;
        }
    }, []);

    const renderLeaf = useCallback(({ attributes, children, leaf }) => {

        let classNames = '';
        let style = {};

        if (leaf.bold) {
            classNames = 'bold';
        }
        if (leaf.highlight) {
            style.backgroundColor = 'linear-gradient(to top, rgba(255, 243, 150, 0.6) 95%, transparent 100%)';
            classNames += ' editor_highlight';
        }
        if (leaf.underline) {
            style.textDecoration = 'underline';
            style.textUnderlinePosition = 'under';
            classNames += ' editor_underline';
        }

        if (leaf.annotation) {
            const anno_num = document.querySelectorAll('.editor_anno');
            anno_num.forEach((element, index) => {
                element.classList.remove('latest');
            });
            classNames += ' editor_anno';
        }
        if (leaf.quote) {
            classNames += ' editor_quote';
        }

        return (
            <span {...attributes} style={style} className={classNames.trim()}>
                {children}
            </span>
        );

    }, []);

    return { renderElement, renderLeaf };
};

export default useSlateRender;