import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import cookieBox from '../components/hook/cookie'

// const API_URL = 'http://localhost:5000';
const API_URL = 'https://bambueong.net';

// get write data
export const writeListData = createAsyncThunk('writeData/getData', async () => {
    try {
        const response = await axios.get(`${API_URL}/api/WriteList`)
        return response.data;
    } catch (error) {
        console.error('Error fetching writeListData:', error);
        throw error;
    }
});

export const writeListPageData = createAsyncThunk('writeData/getPageData', async (page) => {
    try {
        const response = await axios.get(`${API_URL}/api/WriteListPage`, {
            params: { page, limit: 10 }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching writeListData:', error);
        throw error;
    }
});

export const writeListCateData = createAsyncThunk('writeData/getDataCate', async ({ page, cateArr }) => {
    try {
        const response = await axios.get(`${API_URL}/api/WriteListCate`, {
            params: { page, cateArr: JSON.stringify(cateArr), limit: 10 }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching writeListData:', error);
        throw error;
    }
});

export const writeListDateData = createAsyncThunk('writeData/getDateData', async () => {
    try {
        const response = await axios.get(`${API_URL}/api/date`);
        return response.data;
    } catch (error) {
        console.error('Error fetching writeListData:', error);
        throw error;
    }
});

export const writeListDataView = createAsyncThunk('writeData/getDataView', async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/WriteView/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching writeListData:', error);
        throw error;
    }
});

export const writeListDataCorrect = createAsyncThunk('writeData/getDataCorrect', async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/WriteCorrect/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching writeListData:', error);
        throw error;
    }
});

export const writeListDataAnnoLink = createAsyncThunk('writeData/getAnno', async () => {
    try {
        const response = await axios.get(`${API_URL}/api/AnnoLink`);
        return response.data;
    } catch (error) {
        console.error('Error fetching writeListData:', error);
        throw error;
    }
});

// post write data
export const writeListDataPost = createAsyncThunk('writeData/newData', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/api/Write`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// update write data
export const writeListDataUpdate = createAsyncThunk('writeData/updateData', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/api/WriteCorrect`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// get write data in search
export const writeListSearchData = createAsyncThunk('writeData/getData',
    async ({ page, searchPageInput }) => {
        try {
            const response = await axios.get(`${API_URL}/api/Search`, {
                params: { page, searchPageInput, limit: 10 }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching writeListData:', error);
            throw error;
        }
    },
);

export const writeListDataDel = createAsyncThunk('writeData/deleteWrite', async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/WriteView/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// get cate data
export const cateListData = createAsyncThunk('cateData/getCate',
    async () => {
        try {
            const response = await axios.get(`${API_URL}/api/WriteList`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cateListData:', error);
            throw error;
        }
    },
);

export const cateListData_cate = createAsyncThunk('cateData/getCate',
    async () => {
        try {
            const response = await axios.get(`${API_URL}/api/Category`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cateListData:', error);
            throw error;
        }
    },
);

export const cateListDataPost = createAsyncThunk('cateData/newCate', async ({ category, proCateLink }) => {
    try {
        const response = await axios.post(`${API_URL}/api/${proCateLink}`, { category });
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const cateListDataDelete = createAsyncThunk('cateData/cateDelete', async (category) => {
    try {
        const response = await axios.delete(`${API_URL}/api/Category`, { data: category });
        return response.data;
    } catch (error) {
        throw error;
    }
});

// get memodata
export const memoListData = createAsyncThunk('memoData/getMemo',
    async ({ page, bookTitle }) => {
        try {
            const response = await axios.get(`${API_URL}/api/Memo`, {
                params: { page, bookTitle, limit: 10 }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching memoListData:', error);
            throw error;
        }
    },
);

export const memoListDataPost = createAsyncThunk('memoData/postMemo', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/api/Memo`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// post memo data
export const memoListDataUpdate = createAsyncThunk('memoData/updateMemo', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/api/Memo/update`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const memoListDataDelete = createAsyncThunk('memoData/deleteMemo', async (memo_id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/Memo/${memo_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// post memo Anno data
export const memoListAnnoPost = createAsyncThunk('memoData/annoPost', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/api/Memo/anno`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const memoListAnnoUpdate = createAsyncThunk('memoData/annoUpdate', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/api/Memo/updateAnno`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const memoListAnnoDelete = createAsyncThunk('memoData/annoDelete', async (data) => {
    try {
        const response = await axios.delete(`${API_URL}/api/Memo/${data.id}/${data.corrAnnotationKeys}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const MemoListInWrite = createAsyncThunk('memoData/memoInWrite', async (data) => {
    try {
        const response = await axios.get(`${API_URL}/api/Write/memo`, {
            params: { selectValue: data.selectedValue }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
});

// get bookdata
export const bookListData = createAsyncThunk('bookData/getBook',
    async () => {
        try {
            const response = await axios.get(`${API_URL}/api/Memo`);
            return response.data;
        } catch (error) {
            console.error('Error fetching bookListData:', error);
            throw error;
        }
    },
);

export const bookListDataPost = createAsyncThunk('bookData/bookPost', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/api/Memo/book`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const bookListDataDelete = createAsyncThunk('bookData/bookDelete', async (data) => {
    try {
        const response = await axios.delete(`${API_URL}/api/Memo/${data.memoSource}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const bookDataInWrite = createAsyncThunk('bookData/bookInWrite',
    async () => {
        try {
            const response = await axios.get(`${API_URL}/api/Write`);
            return response.data;
        } catch (error) {
            console.error('Error fetching bookListData:', error);
            throw error;
        }
    },
);

export const userCheck = createAsyncThunk('user', async (data, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/api/Login`, data, { withCredentials: true });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const userCheckRefresh = createAsyncThunk('user', async (_, thunkAPI) => {
    try {
        const csrfToken = cookieBox.getCookie('csrf_access_token');
        const response = await axios.post(`${API_URL}/api/userCheckRefresh`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            cookieBox.deleteCookie('csrf_access_token');
            cookieBox.deleteCookie('access_token_cookie');
        }
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const userIdDuplicateCheck = createAsyncThunk('userDupliCheck', async (data) => {
    try {
        const response = await axios.post(`${API_URL}/api/duplicateId`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const emailSendCertifyNum = createAsyncThunk('emailCertifyNumSend', async (data) => {
    try {
        const response = await axios.post(`${API_URL}/api/sendCertifyNum`, { email: data.selectedEmail }, {
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.error || error.response.statusText}`);
        } else if (error.request) {
            throw new Error('No response received from the server.');
        } else {
            throw new Error(`Error: ${error.message}`);
        }
    }
});

export const signupComplete = createAsyncThunk('signup', async (data) => {
    try {
        const response = await axios.post(`${API_URL}/api/signup`, { id: data.newUsername, password: data.newUserPasswordConfirm });
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const login = createAsyncThunk('user', async (data) => {
    try {
        const response = await axios.get(`${API_URL}/login`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const logout = createAsyncThunk('user/logout', async (data) => {
    try {
        const response = await axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });
    } catch (error) {
        console.error('Logout error', error);
    }
});

export const useInfoData = async () => {
    const response = await axios.get(`${API_URL}/api/admin/Info`);
    return response.data;
};