function LinkCheck(editor) {
    const linkArr = [];

    function extractText(children) {
        if (!Array.isArray(children)) return '';
        return children
            .map(child => {
                if (child.text) {
                    return child.text;
                } else if (Array.isArray(child.children)) {
                    return extractText(child.children);
                }
                return '';
            })
            .join('');
    }

    function processLinks(nodes) {

        nodes.forEach(node => {
            if (node.type === 'paragraph' && Array.isArray(node.children)) {
                node.children.forEach(child => {
                    if (child.type === 'link' && child.url) {
                        const url = child.url;
                        const text = extractText(child.children) || '텍스트 없음';
                        const explain = child.url_explain || '';
                        linkArr.push({ url, text, explain });
                    }
                });
            }
        });
    }

    if (Array.isArray(editor)) {

        processLinks(editor);
    } else if (editor?.children && Array.isArray(editor.children)) {

        processLinks(editor.children);
    } else if (editor instanceof Document) {
        
        const links = editor.querySelectorAll('.editor_link');

        links.forEach(linkElement => {
            const url = linkElement.getAttribute('href');
            const text = linkElement.textContent.trim();
            const explain = linkElement.getAttribute('data-url-explain');

            const isDuplicate = linkArr.some(link => link.url === url);
            if (!isDuplicate) {
                linkArr.push({ url, text, explain });
            }
        });
    }

    return linkArr;
}

export default LinkCheck;
