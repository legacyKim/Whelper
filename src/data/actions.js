import axios from 'axios';

export const fetchData = () => {

    return async (dispatch) => {

        try {

            const response = await axios.get('/src/components/Write');
            dispatch({
                type: 'FETCH_SUCCESS',
                payload: response.data,
            });

        } catch (error) {

            dispatch({
                type: 'FETCH_FAILURE',
                payload: error.message,
            });

        }
    };
};