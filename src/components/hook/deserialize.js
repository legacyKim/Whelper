const deserialize = (el, markAttributes = {}) => {

    if (el.nodeType === 3) {
        return { text: el.textContent, ...markAttributes };
    } else if (el.nodeType !== 1) {
        return null;
    }

    const nodeAttributes = { ...markAttributes };

    switch (el.nodeName) {
        case 'STRONG':
            nodeAttributes.bold = true
            break;
        case 'SPAN':
            if (el.classList.contains('editor_highlight')) {
                nodeAttributes.highlight = true;
            }
            if (el.classList.contains('editor_underline')) {    
                nodeAttributes.underline = true;
            }
            if (el.classList.contains('editor_anno')) {
                nodeAttributes.annotation = true;
            }
            break;
    }

    const children = Array.from(el.childNodes)
        .map(child => deserialize(child, { ...nodeAttributes }))
        .flat();

    if (children.length === 0) {
        children.push({ text: '', ...nodeAttributes });
    }

    switch (el.nodeName) {
        case 'P':
            return { type: 'paragraph', children };
        case 'BLOCKQUOTE':
            return { type: 'blockquote', children };
        case 'A': {
            return {
                type: 'link',
                url: el.getAttribute('href'),
                url_explain: el.getAttribute('data-url-explain'),
                children: children.length > 0 ? children : [{ text: '' }],
            };
        }
        default:
            return children;
    }
};

export default deserialize;