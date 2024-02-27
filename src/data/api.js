import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const writeListData = createAsyncThunk('writeData/FetchData',
    async () => {
        const response = await axios.get(`${API_URL}/components/WriteList`);
        return response.data
    },
)

export const memoListData = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/components/Memo`);
            dispatch({ type: 'FETCH_DATA_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'FETCH_DATA_FAILURE', payload: error.message });
        }
    };
};

export const cateListData = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/components/Category`);
            dispatch({ type: 'FETCH_DATA_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'FETCH_DATA_FAILURE', payload: error.message });
        }
    };
};

export const bookListData = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/components/Category`);
            dispatch({ type: 'FETCH_DATA_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'FETCH_DATA_FAILURE', payload: error.message });
        }
    };
};
