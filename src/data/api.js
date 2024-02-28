import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const writeListData = createAsyncThunk('writeData/FetchData',
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

export const cateListData = createAsyncThunk('cataData/FetchData',
    async () => {
        try {
            const response = await axios.get(`${API_URL}/components/Category`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cataListData:', error);
            throw error;
        }
    },
)

export const memoListData = createAsyncThunk('memoData/FetchData',
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

export const bookListData = createAsyncThunk('bookData/FetchData',
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
