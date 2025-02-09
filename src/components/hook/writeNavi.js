import { token_check } from '../../data/token_check.js'
import { useDispatch } from 'react-redux';

const writeNavi = async (e, path, navigate, isAuth) => {

    e.preventDefault();
    
    if (typeof isAuth === 'number') {
        navigate(`${path}`);
        return;
    }

    const isTokenValid = await token_check(navigate);
    if (isTokenValid) {
        navigate(`${path}`);
    }
    
};

export default writeNavi;