import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const writeListData = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/components/Write`);
            dispatch({ type: 'FETCH_DATA_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'FETCH_DATA_FAILURE', payload: error.message });
        }
    };
};

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
