// const API_URL = 'http://localhost:5000';
const API_URL = 'https://bambueong.net';

export const token_check = async (navigate) => {

    try {
        const response = await fetch(`${API_URL}/protected`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('토큰 검증에 실패했습니다.');
        }

        return true;

    } catch (error) {
        alert('토큰이 유효하지 않습니다. 로그인이 필요합니다.');
        navigate('/components/Login');
        return false;
    }
};
//// 토큰 검증