import escapeHtml from 'escape-html'
import { Text } from 'slate';

const serialize = (nodes) => {

    return nodes.map(node => {
        if (Text.isText(node)) {
            let string = escapeHtml(node.text);

            if (node.bold) {
                string = `<strong>${string}</strong>`;
            }
            if (node.highlight) {
                string = `<span className="editor_highlight">${string}</span>`;
            }
            if (node.underline) {
                string = `<span className="editor_underline">${string}</span>`;
            }
            if (node.annotation) {
                string = `<span className="editor_anno editing">${string}</span>`;
            }

            return string;
        }

        const children = serialize(node.children);

        switch (node.type) {
            case 'bold':
                return `<strong>${children}</strong>`;
            case 'underline':
                return `<span className="editor_underline">${children}</span>`;
            case 'highlight':
                return `<span className="editor_highlight">${children}</span>`;
            case 'blockquote':
                return `<blockquote className="editor_quote">${children}</blockquote>`;
            case 'annotation':
                return `<span className="editor_anno editing">${children}</span>`;
            case 'paragraph':
                return `<p>${children}</p>`;
            case 'link':
                return `<a href="${node.url}" data-url-explain="${node.url_explain}" className="editor_link">${children}</a>`;
            default:
                return children;
        }

    }).join('');

};

export default serialize;