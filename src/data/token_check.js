const API_URL = 'http://localhost:5000';
// const API_URL = 'http://bambueong.net';

export const token_check = async (navigate) => {

    const token = localStorage.getItem('access_token');
    if (!token) {
        alert('로그인이 필요합니다.')
        navigate('/components/Login');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/protected`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('토큰 검증에 실패했습니다.');
        }

        const data = await response.json();
        return true;
    } catch (error) {
        console.error('Token check failed', error);
        alert('토큰이 유효하지 않습니다.');
        return false;
    }
};
//// 토큰 검증