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
        // const marks = Editor.marks(editor)
        // return marks ? marks.quote === true : false

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

}

export default CustomEditor;