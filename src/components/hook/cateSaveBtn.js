import { token_check } from '../../data/token_check.js'

const cateSaveBtn = async (navigate, currentPathname, cateInput, cateListArr, dispatch, syncCateListData, cateListDataPost, catePopupActive) => {

    const isTokenValid = await token_check(navigate);

    if (isTokenValid) {

        const cateLink = currentPathname;
        const category = cateInput.current.value;
        const cateCheck = cateListArr.filter((item) => item.category === category);

        if (cateCheck.length > 0 && category !== '') {

            alert('카테고리가 존재합니다.');
            cateInput.current.value = '';
            return;

        } else {

            const proCateLink = cateLink.replace('/components/', '');

            dispatch(syncCateListData({ category }));
            dispatch(cateListDataPost({ category, proCateLink }));

            catePopupActive('');
            cateInput.current.value = '';
        }
    }
}

export default cateSaveBtn;