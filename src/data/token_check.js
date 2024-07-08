const API_URL = 'http://localhost:5000';
// const API_URL = 'http://bambueong.net';

export const token_check = async (navigate) => {
    try {
        const response = await fetch(`${API_URL}/protected`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'  // HTTP-only 쿠키를 포함시킵니다
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