import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';
// const API_URL = 'http://bambueong.net';

// get write data
export const writeListData = createAsyncThunk('writeData/getData', async () => {
    try {
        const response = await axios.get(`${API_URL}/components/WriteList`);
        return response.data;
    } catch (error) {
        console.error('Error fetching writeListData:', error);
        throw error;
    }
});

// post write data
export const writeListDataPost = createAsyncThunk('writeData/newData', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/components/Write`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// update write data
export const writeListDataUpdate = createAsyncThunk('writeData/updateData', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/components/WriteCorrect`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// get write data in search
export const writeListData_search = createAsyncThunk('writeData/getData',
    async () => {
        try {
            const response = await axios.get(`${API_URL}/components/Search`);
            return response.data;
        } catch (error) {
            console.error('Error fetching writeListData:', error);
            throw error;
        }
    },
);

export const writeListDataDel = createAsyncThunk('writeData/deleteWrite', async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/components/WriteView/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// get cate data
export const cateListData = createAsyncThunk('cateData/getCate',
    async () => {
        try {
            const response = await axios.get(`${API_URL}/components/WriteList`);
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
            const response = await axios.get(`${API_URL}/components/Category`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cateListData:', error);
            throw error;
        }
    },
);

export const cateListDataPost = createAsyncThunk('writeData/newData', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/components/Category`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// get memodata
export const memoListData = createAsyncThunk('memoData/getMemo',
    async () => {
        try {
            const response = await axios.get(`${API_URL}/components/Memo`);
            return response.data;
        } catch (error) {
            console.error('Error fetching memoListData:', error);
            throw error;
        }
    },
);

export const memoListDataPost = createAsyncThunk('memoData/postMemo', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/components/Memo`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// post memo data
export const memoListDataUpdate = createAsyncThunk('memoData/updateMemo', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/components/Memo/update`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const memoListDataDelete = createAsyncThunk('memoData/deleteMemo', async (memo_id) => {
    try {
        const response = await axios.delete(`${API_URL}/components/Memo/${memo_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// post memo Anno data
export const memoListAnnoPost = createAsyncThunk('memoData/annoPost', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/components/Memo/anno`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const memoListAnnoUpdate = createAsyncThunk('memoData/annoUpdate', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/components/Memo/updateAnno`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const memoListAnnoDelete = createAsyncThunk('memoData/annoDelete', async (data) => {
    try {
        const response = await axios.delete(`${API_URL}/components/Memo/${data.id}/${data.corrAnnotationKeys}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// get bookdata
export const bookListData = createAsyncThunk('bookData/getBook',
    async () => {
        try {
            const response = await axios.get(`${API_URL}/components/Memo`);
            return response.data;
        } catch (error) {
            console.error('Error fetching bookListData:', error);
            throw error;
        }
    },
);

export const bookListDataPost = createAsyncThunk('bookData/bookPost', async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/components/Memo/book`, newData);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const bookListDataDelete = createAsyncThunk('bookData/bookDelete', async (data) => {
    try {
        const response = await axios.delete(`${API_URL}/components/Memo/${data.memoSource}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

export const userCheck = createAsyncThunk('user', async (data) => {
    try {
        const response = await axios.post(`${API_URL}/components/Login`, data);
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

export const logout = createAsyncThunk('user', async (data) => {
    try {
        const response = await axios.get(`${API_URL}/logout`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
});