import escapeHtml from 'escape-html'
import { Text } from 'slate';

const serialize = (nodes) => {

    console.log(nodes);

    return nodes.map(node => {
        if (Text.isText(node)) {
            let string = escapeHtml(node.text);

            if (node.bold) {
                string = `<strong>${string}</strong>`;
            }
            if (node.highlight) {
                string = `<span class="editor_highlight">${string}</span>`;
            }
            if (node.underline) {
                string = `<span class="editor_underline">${string}</span>`;
            }
            if (node.annotation) {
                string = `<span class="editor_anno editing">${string}</span>`;
            }

            return string;
        }

        const children = serialize(node.children);

        switch (node.type) {
            case 'bold':
                return `<strong>${children}</strong>`;
            case 'underline':
                return `<span class="editor_underline">${children}</span>`;
            case 'highlight':
                return `<span class="editor_highlight">${children}</span>`;
            case 'blockquote':
                return `<blockquote class="editor_quote">${children}</blockquote>`;
            case 'annotation':
                return `<span class="editor_anno editing">${children}</span>`;
            case 'paragraph':
                return `<p>${children}</p>`;
            case 'link':
                return `<a href="${node.url}" data-url-explain="${node.url_explain}" class="editor_link">${children}</a>`;
            case 'annotation':
                return `<span class="editor_anno editing">${children}</span>`;
            default:
                return children;
        }

    }).join('');

};

export default serialize;