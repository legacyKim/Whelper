import { token_check } from '../../data/token_check.js'

const cateSaveBtn = async (navigate, prevPathname, cateInput, cateListArr, dispatch, syncCateListData, cateListDataPost, catePopupActive) => {

    const isTokenValid = await token_check(navigate);

    if (isTokenValid) {

        const cateLink = prevPathname;
        const category = cateInput.current.value;
        const cateCheck = cateListArr.filter((item) => item.category === category);

        if (cateCheck.length > 0 && category !== '') {

            alert('카테고리가 존재합니다.');
            cateInput.current.value = '';
            return;

        } else {
            dispatch(syncCateListData({ category }));
            dispatch(cateListDataPost({ category, cateLink }));

            catePopupActive('');

            cateInput.current.value = '';
        }
    }
}

export default cateSaveBtn;