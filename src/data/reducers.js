import { createSlice, configureStore, current } from '@reduxjs/toolkit';
import { writeListData, writeListDataPost, writeListDataUpdate, memoListData, cateListData, bookListData } from './api.js'

const WriteData = createSlice({
    name: 'WriteData',
    initialState: {
        data: {
            cate: [],
            write: [],
        },
        loading: false,
        error: null,
    },
    reducers: {
        syncWriteListData: (state, action) => {
            if (action.payload !== undefined) {
                state.data = {
                    ...state.data,
                    write: [...state.data.write, action.payload],
                };
            }
        },
        writeListDataDelete: (state, action) => {
            const deleteWriteId = action.payload.id;
            state.data = state.data.filter(item => item.id !== deleteWriteId);
        },
    },

    extraReducers: (builder) => {

        // get data
        builder.addCase(writeListData.pending, (state) => {
            state.loading = true;
        }).addCase(writeListData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
        }).addCase(writeListData.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })
        
        // post data
        .addCase(writeListDataPost.pending, (state) => {
            state.loading = true;
        }).addCase(writeListDataPost.fulfilled, (state, action) => {
            state.loading = false;
            state.data = {
                ...state.data,
                write: [...state.data.write, action.payload]
            };
        }).addCase(writeListDataPost.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })
        
        // update data
        .addCase(writeListDataUpdate.pending, (state) => {
            state.loading = true;
        }).addCase(writeListDataUpdate.fulfilled, (state, action) => {
            state.loading = false;
            const currentState = current(state);
            const updatedWrite = currentState.data.write.filter(item => item.id !== action.payload.id);

            console.log(currentState)
            console.log(updatedWrite)
            
            return {
                ...currentState,
                write: updatedWrite,
            };
        }).addCase(writeListDataUpdate.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })
    },
});

const memoData = createSlice({
    name: 'memoData',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        memoListDataAdd(state, action) {
            console.log(action.payload)
            console.log(...state)
        },
        memoListDataUpdate(state, action) {
            const updateMemoId = action.payload.id;
            const updateMemo = action.payload;
            state.data = state.data.map(item => (item.id === updateMemoId ? updateMemo : item));
        },
        memoListAnno(state, action) {
        },
        memoListAnnoUpdate(state, updateAnnoList) {
        },
        memoListAnnoDelete(state, action) {
        }
    },

    extraReducers: (builder) => {
        builder.addCase(memoListData.pending, (state) => {
            state.loading = true;
        }).addCase(memoListData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload
        }).addCase(memoListData.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })
    },
})

const cateData = createSlice({
    name: 'cateData',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        cateListDataAdd(state, action) {
            state.data = [...state.data, action.payload];
        },
    },

    extraReducers: (builder) => {
        builder.addCase(cateListData.pending, (state) => {
            state.loading = true;
        }).addCase(cateListData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        }).addCase(cateListData.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })
    },
})

const bookData = createSlice({
    name: 'bookData',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        bookListDataAdd(state, action) {
            state.data = [...state.data, action.payload];
        },
        bookListDelete(state, action) {
        }
    },

    extraReducers: (builder) => {
        builder.addCase(bookListData.pending, (state) => {
            state.loading = true;
        }).addCase(bookListData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        }).addCase(bookListData.rejected, (state, action) => {
            state.error = action.payload ?? action.errors
        })
    },
});

export const { syncWriteListData, syncWriteListDataUpdate, writeListDataDelete } = WriteData.actions;
export const { memoListDataAdd, memoListDataDelete, memoListDataUpdate, memoListAnno, memoListAnnoUpdate, memoListAnnoDelete } = memoData.actions;
export const { cateListDataAdd } = cateData.actions;
export const { bookListDataAdd, bookListDelete } = bookData.actions;

const store = configureStore({
    reducer: {
        WriteData: WriteData.reducer,
        memoData: memoData.reducer,
        cateData: cateData.reducer,
        bookData: bookData.reducer,
    }
});

export default store;