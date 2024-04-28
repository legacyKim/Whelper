import { createSlice, configureStore } from '@reduxjs/toolkit';
import { writeListData, writeListDataPost, memoListData, cateListData, bookListData, login } from './api.js'

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
            console.log(action.payload)
            if (action.payload !== undefined) {
                const updatedWrite = state.data.write.map(item =>
                    item.id === action.payload.db_id ? action.payload : item
                );
                state.data.write = updatedWrite;
            }
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

        syncMemoListDelete(state, action) {
            if (action.payload !== undefined) {
                const deleteMemo = state.data.memo.filter(item =>
                    item.id !== action.payload
                )
                state.data.memo = deleteMemo;
            }
        },

        syncMemoListAnno(state, action) {
            if (action.payload !== undefined) {
                const { memoSource, memoAnnotation } = action.payload;
                const addMemoAnno = state.data.memo.map(item =>
                    item.memoSource === memoSource
                        ? {
                            ...item,
                            memoAnnotation: [...item.memoAnnotation, memoAnnotation]
                        }
                        : item
                );
                return { ...state, data: { ...state.data, memo: addMemoAnno } };
            }
        },

        syncMemoListAnnoUpdate(state, action) {
            if (action.payload !== undefined) {

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
            }
        },

        syncMemoListAnnoDelete(state, action) {
            if (action.payload !== undefined) {
                const { id, corrAnnotationKeys } = action.payload;
                const updatedMemo = state.data.memo.map(item => {
                    if (item.id === id) {
                        const updatedAnnotations = item.memoAnnotation.filter((index) => index !== corrAnnotationKeys);
                        return { ...item, memoAnnotation: updatedAnnotations };
                    } else {
                        return item;
                    }
                });
                return { ...state, data: { ...state.data, memo: updatedMemo } };
            }
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
        syncCateListData(state, action) {
            if (action.payload !== undefined) {
                state.data = {
                    ...state.data,
                    cate: [...state.data.cate, action.payload],
                };
            }
        }
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
        syncBookListDelete(state, action) {
            if (action.payload !== undefined) {
                const deleteBook = state.data.book.filter(item =>
                    item.memoSource !== action.payload.memoSource
                )
                state.data.book = deleteBook;
            }
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

const loginData = createSlice({
    name: 'loginData',
    initialState: {
        loading: false,
        loggedIn: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.loading = false;
            state.loggedIn = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.loggedIn = action.payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.loggedIn = false;
                state.error = action.error.message;
            });
    },
});

export const { syncWriteListData, syncWriteListDataUpdate } = WriteData.actions;
export const { syncMemoListDataAdd, syncMemoListDelete, syncMemoListDataUpdate, syncMemoListAnno, syncMemoListAnnoUpdate, syncMemoListAnnoDelete } = memoData.actions;
export const { cateListDataAdd, syncCateListData } = cateData.actions;
export const { syncBookListDataAdd, syncBookListDelete } = bookData.actions;
export const { logout } = loginData.actions;

const store = configureStore({
    reducer: {
        WriteData: WriteData.reducer,
        memoData: memoData.reducer,
        cateData: cateData.reducer,
        bookData: bookData.reducer,
        loginData: loginData.reducer,
    }
});

export default store;