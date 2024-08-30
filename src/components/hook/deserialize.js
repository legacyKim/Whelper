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
            } else if (el.classList.contains('editor_underline')) {
                nodeAttributes.underline = true;
            } else if (el.classList.contains('editor_quote')) {
                nodeAttributes.quote = true;
            } else if (el.classList.contains('editor_anno')) {
                nodeAttributes.annotation = true;
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

export default deserialize;