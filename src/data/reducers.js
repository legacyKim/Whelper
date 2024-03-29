import { createSlice, configureStore, current } from '@reduxjs/toolkit';
import { writeListData, writeListDataPost, memoListData, cateListData, bookListData } from './api.js'
import { memo } from 'react';

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
        syncWriteListDataUpdate: (state, action) => {
            if (action.payload !== undefined) {
                const updatedWrite = state.data.write.map(item =>
                    item.id === action.payload.db_id ? action.payload : item
                );
                state.data.write = updatedWrite;
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
        syncMemoListDataAdd(state, action) {
            if (action.payload !== undefined) {
                state.data = {
                    ...state.data,
                    memo: [...state.data.memo, action.payload],
                };
            }
        },

        syncMemoListDataUpdate(state, action) {
            if (action.payload !== undefined) {
                const updateMemo = state.data.memo.map(item =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.data.memo = updateMemo;
            }
        },

        syncBookListDataPost(state, action) {

        },

        syncMemoListAnno(state, action) {
            const { id, memoAnno } = action.payload;
            const addMemoAnno = state.data.memo.map(item =>
                item.id === id
                    ? {
                        ...item,
                        memoAnnotation: [...item.memoAnnotation, memoAnno]
                    }
                    : item
            );
            return { ...state, data: { ...state.data, memo: addMemoAnno } };
        },

        syncMemoListAnnoUpdate(state, action) {
            const { id, memoAnno, corrAnnotationKeys } = action.payload;
            const updatedMemoAnno = state.data.memo.map(item =>
                item.id === id
                    ? {
                        ...item,
                        memoAnnotation: item.memoAnnotation.map((anno, index) =>
                            index === corrAnnotationKeys
                                ? memoAnno
                                : anno
                        )
                    }
                    : item
            );
            return { ...state, data: { ...state.data, memo: updatedMemoAnno } };
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
            state.error = action.payload ?? action.error;
        })
    },
})

const bookData = createSlice({
    name: 'bookData',
    initialState: {
        data: {
            memo: [],
            book: [],
        },
        loading: false,
        error: null,
    },
    reducers: {
        syncBookListDataAdd(state, action) {
            if (action.payload !== undefined) {
                state.data = {
                    ...state.data,
                    book: [...state.data.book, action.payload],
                };
            }
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
            state.error = action.payload ?? action.errors;
        })
    },

});

export const { syncWriteListData, syncWriteListDataUpdate, writeListDataDelete } = WriteData.actions;
export const { syncMemoListDataAdd, memoListDataDelete, syncMemoListDataUpdate, syncMemoListAnno, syncMemoListAnnoUpdate, memoListAnnoDelete } = memoData.actions;
export const { cateListDataAdd } = cateData.actions;
export const { syncBookListDataAdd, bookListDelete } = bookData.actions;

const store = configureStore({
    reducer: {
        WriteData: WriteData.reducer,
        memoData: memoData.reducer,
        cateData: cateData.reducer,
        bookData: bookData.reducer,
    }
});

export default store;