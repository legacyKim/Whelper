import { Editor, Transforms } from 'slate';

const CustomEditor = {

    isBoldMarkActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.bold === true : false
    },

    isUnderlineActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.underline === true : false
    },

    isHighlightActive(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.highlight === true : false
    },

    isQuote(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === 'blockquote',
            mode: 'block',
        });
        return !!match;
    },

    isAnnotation(editor) {
        const marks = Editor.marks(editor)
        return marks ? marks.annotation === true : false
    },

    isLink(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.type === 'link',
            mode: 'all',
        });
        return !!match;
    },

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (_) {
            const regex = /^(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/;
            return regex.test(url);
        }
    },

    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'bold')
        } else {
            Editor.addMark(editor, 'bold', true)
        }
    },

    toggleUnderline(editor) {
        const isActive = CustomEditor.isUnderlineActive(editor)
        if (isActive) {
            Editor.removeMark(editor, 'underline')
        } else {
            Editor.addMark(editor, 'underline', true)
        }
    },

    toggleHighlight(editor) {
        const isActive = CustomEditor.isHighlightActive(editor);
        if (isActive) {
            Editor.removeMark(editor, 'highlight');
        } else {
            Editor.addMark(editor, 'highlight', true);
        }
    },

    toggleQuote(editor) {
        const isActive = CustomEditor.isQuote(editor);

        if (isActive) {
            Transforms.unwrapNodes(editor, {
                match: n => n.type === 'blockquote',
                split: true,
            });
        } else {
            Transforms.wrapNodes(editor, { type: 'blockquote', children: [] }, { split: true });
        }
    },

    toggleAnnotation(editor, annoTextboxOpen, onlyAnnoClose, annoRemove) {
        const isActive = CustomEditor.isAnnotation(editor);

        if (isActive) {
            annoRemove();
        } else {
            Editor.addMark(editor, 'annotation', true);
            annoTextboxOpen();
            onlyAnnoClose();
        }
    },

    toggleLink(editor, url, explain, mode) {

        const isActive = CustomEditor.isLink(editor);
        const isUrlCheck = CustomEditor.isValidUrl(url);

        if (isActive) {
            Transforms.unwrapNodes(editor, {
                match: n => n.type === 'link',
            });
        } else {

            if (!isUrlCheck) {
                alert('유효하지 않은 URL입니다.');
                return false;
            }

            const { selection } = editor;
            const selectedText = Editor.string(editor, selection);

            if (selection && selectedText !== '') {

                Transforms.wrapNodes(
                    editor,
                    {
                        type: 'link',
                        url,
                        url_explain: explain,
                        children: [{ text: selectedText }],
                    },
                    { split: true }
                );

                Transforms.insertNodes(
                    editor,
                    { type: 'paragraph', children: [] },
                    { at: Editor.end(editor, []), select: false }
                );
            }
        }

        return true;
    },

    toggleCopy(editor, memoText, setMemoText) {
        Transforms.insertNodes(editor, {
            type: 'paragraph',
            children: [{ text: memoText }],
        });
        setMemoText('');
    }
}

export default CustomEditor;