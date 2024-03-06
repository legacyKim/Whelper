import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// get write dadta
export const writeListData = createAsyncThunk('writeData/getData',
    async () => {
        try {
            const response = await axios.get(`${API_URL}/components/WriteList`);
            return response.data;
        } catch (error) {
            console.error('Error fetching writeListData:', error);
            throw error;
        }
    },
)

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
        console.log(response)
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
)

// get memo data
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
)

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
)
