const initialState = {
    data: null,
    error: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                ...state,
                data: action.payload,
                error: null,
            };
        case 'FETCH_FAILURE':
            return {
                ...state,
                data: null,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;