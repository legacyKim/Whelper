import { token_check } from './token_check.js'

const onlyTokenCheck = async (navigate) => {
    await token_check(navigate);
};

export default onlyTokenCheck;