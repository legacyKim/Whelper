import { Transforms, Editor } from 'slate';

const LinksWith = (editor) => {

    const { isInline } = editor;

    editor.isInline = (element) => {
        return element.type === 'link' ? true : isInline(element);
    };

    const { onKeyDown } = editor;

    editor.onKeyDown = (event) => {

        if (event.key === 'Backspace') {
            const { selection } = editor;

            if (selection) {
                const [linkNode] = Editor.nodes(editor, {
                    match: n => n.type === 'link',
                });

                if (linkNode) {
                    Transforms.unwrapNodes(editor, {
                        match: n => n.type === 'link',
                    });
                    event.preventDefault();
                    return;
                }
            }
        }

        if (onKeyDown) {
            onKeyDown(event);
        }
    };

    return editor;
};

export default LinksWith;