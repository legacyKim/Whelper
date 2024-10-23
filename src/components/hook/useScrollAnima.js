import { useEffect } from 'react';

const useScrollAnima = (
    objClassName, scrollPosition, rootHeight
) => {

    useEffect(() => {
        const obj = document.querySelectorAll(`${objClassName}`);

        obj.forEach((ele) => {
            if (scrollPosition + rootHeight - ele.offsetHeight * 2 > ele.offsetTop - ele.offsetHeight) {
                ele.classList.add("anima");
            }
        });
    }, [objClassName, scrollPosition, rootHeight]);
}

export default useScrollAnima;