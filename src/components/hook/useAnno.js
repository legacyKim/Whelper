import { useEffect } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react'

const useAnno = (
    editor,
    annoContent, setAnnoContent,
    setAnnoListBtn, setAnnoClick, annoArr, setAnnoArr, setAnnoLengthState,
    annoAddActive, setAnnoAddActive,
    annoTextboxActive, setAnnoTextboxActive,
    toolbarActive, setToolbarActive,
    onlyAnno, setOnlyAnno
) => {

    useEffect(() => {
        if (annoAddActive === 'active') {
            setAnnoAddActive('active');
        } else {
            setAnnoAddActive('');
        }
    }, [annoAddActive, setAnnoAddActive]);

    const anno_numbering = () => {

        const anno_num = document.querySelectorAll('.editor_anno');
        const anno_length = anno_num.length;

        var latest_index;
        anno_num.forEach((element, index) => {
            element.setAttribute('anno-data-num', `${index + 1}`);
            element.style.setProperty('--anno-num', `'${index + 1})'`);

            if (element.classList.contains('latest')) {
                latest_index = index + 1;
            }

            if (!element.dataset.eventRegistered) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    setAnnoListBtn(true);
                    setAnnoClick(Number(element.getAttribute('anno-data-num')));
                });
                element.dataset.eventRegistered = true;
            }
        });

        return [latest_index, anno_length];
    };

    const anno_set = () => {

        const anno_number_arr = anno_numbering();
        const latestNum = anno_number_arr[0];
        const annoLength = anno_number_arr[1];

        setAnnoArr((prevAnnoArr) => {
            const updatedAnnoArr = prevAnnoArr.map((anno) =>
                anno.index >= latestNum
                    ? { ...anno, index: anno.index + 1 }
                    : { ...anno, index: anno.index }
            );

            const newAnno = { index: latestNum, content: annoContent };
            const newAnnoArr = [...updatedAnnoArr, newAnno];
            newAnnoArr.sort((a, b) => a.index - b.index);

            return newAnnoArr;
        });
        setAnnoLengthState(annoLength);
    };

    const anno_selection = () => {
        const { selection } = editor;
        if (!selection) {
            return;
        }

        const [currentNode] = Editor.node(editor, selection);
        const element = ReactEditor.toDOMNode(editor, currentNode);

        if (element) {
            element.childNodes.forEach((child) => {
                if (child.classList.contains('editor_anno')) {
                    child.classList.add('latest');
                    child.classList.add('editing');
                }
            });
        }
        anno_set();
    };

    const annoSaveBtn = () => {
        if (annoContent !== '') {
            anno_selection();
            setAnnoListBtn(true);
        }
        toolbarClose();
    };

    useEffect(() => {
        anno_numbering();
        document.querySelectorAll('.editor_anno').forEach((ele) => {
            ele.classList.add('editing');
        });
    }, []);

    const annoRemove = () => {

        Editor.removeMark(editor, 'annotation');

        const { selection } = editor;
        if (!selection) {
            return;
        }

        const [currentNode] = Editor.node(editor, selection);
        const element = ReactEditor.toDOMNode(editor, currentNode);

        if (element) {
            element.childNodes.forEach(child => {
                if (child.nodeType === 1) {
                    if (child.hasAttribute('anno-data-num')) {
                        child.removeAttribute('anno-data-num');
                    }

                    const annoNumStyle = child.style.getPropertyValue('--anno-num');
                    if (annoNumStyle) {
                        child.style.removeProperty('--anno-num');
                    }

                    child.dataset.eventRegistered = false;
                }
            });
        }
    }

    const toolbarClose = (e) => {

        if (annoTextboxActive === 'active' && annoContent === '') {
            document.querySelectorAll('.editor_anno').forEach((ele) => {
                if (!ele.classList.contains('editing')) {
                    const slatePath = ReactEditor.findPath(editor, ReactEditor.toSlateNode(editor, ele));

                    Transforms.select(editor, slatePath);
                    Editor.removeMark(editor, 'annotation');

                    ele.classList.remove('editor_anno');
                }
            });
        }

        setAnnoContent('')
        setAnnoTextboxActive('')
        setToolbarActive('');
    }

    const annoTextboxOpen = (e) => {
        setAnnoTextboxActive('active');
    };

    const annoTextboxClose = (e) => {
        annoRemove();
        setAnnoTextboxActive('');
    }

    const onlyAnnoClose = () => {
        setOnlyAnno('');
    }

    return { annoSaveBtn, anno_numbering, annoRemove, toolbarClose, annoTextboxOpen, annoTextboxClose, onlyAnnoClose, annoArr };
};

export default useAnno;