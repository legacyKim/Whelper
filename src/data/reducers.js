import { createSlice, configureStore } from '@reduxjs/toolkit';
import { writeListData, writeListPageData, writeListDataViewIncrement, writeListCateData, writeListSearchData, writeListDateData, writeListDataAnnoLink, writeListDataPost, memoListData, cateListData, bookListData } from './api.js'

const writeInitialState = () => ({
    data: {
        write: [],
        totalPages: null,
    },
    loading: false,
    error: null,
});

const WriteListView = createSlice({
    name: 'WriteListView',
    initialState: writeInitialState(),
    reducers: {
        syncWriteListData: (state, action) => {
            state.data.write = action.payload;
        },
        syncWriteListDataUpdate: (state, action) => {
            if (action.payload !== undefined) {
                const updatedWrite = state.data.write.map(item =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.data.write = updatedWrite;
            }
        },
    }
})

const WriteListPageDataOn = createSlice({
    name: 'WriteListPageDataOn',
    initialState: writeInitialState(),
    reducers: {
        syncWriteListPageData: (state, action) => {
            if (action.payload !== undefined) {
                state.data = {
                    ...state.data,
                    write: [...state.data.write, action.payload],
                };
            }
        },
        syncWriteListPageDataUpdate: (state, action) => {
            if (action.payload !== undefined) {
                const updatedWrite = state.data.write.map(item =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.data.write = updatedWrite;
            }
        },
        syncWriteListDelete(state, action) {
            if (action.payload !== undefined) {
                const deleteWrite = state.data.write.filter(item =>
                    item.id !== action.payload
                )
                state.data.write = deleteWrite;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(writeListPageData.pending, (state) => {
            state.loading = true;
        }).addCase(writeListPageData.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.totalPages) {
                const newWriteData = action.payload.write.filter(newItem =>
                    !state.data.write.some(existingItem => existingItem.id === newItem.id)
                );
                state.data.write = [...state.data.write, ...newWriteData];
                state.data.totalPages = action.payload.totalPages;
            }
        }).addCase(writeListPageData.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })

        .addCase(writeListDataViewIncrement.fulfilled, (state, action) => {
            if (action.payload) {
                const updatedWrite = state.data.write.map(item =>
                    item.id === action.payload.id ? { ...item, views: action.payload.views } : item
                );
                state.data.write = updatedWrite;
            }
        })
        .addCase(writeListDataViewIncrement.rejected, (state, action) => {
            state.error = action.payload ?? action.error;
        });

    },
});

const WriteListDateDataOn = createSlice({
    name: 'WriteListDateDataOn',
    initialState: writeInitialState(),
    extraReducers: (builder) => {
        builder.addCase(writeListDateData.pending, (state) => {
            state.loading = true;
        }).addCase(writeListDateData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        }).addCase(writeListDateData.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })
    },
});

const WriteListDataAnnoLinkOn = createSlice({
    name: 'WriteListDataAnnoLinkOn',
    initialState: writeInitialState(),
    reducers: {
        syncWriteListDataAnnoLink: (state, action) => {
            if (action.payload !== undefined) {
                state.data = {
                    ...state.data,
                    write: [...state.data.write, action.payload],
                };
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(writeListDataAnnoLink.pending, (state) => {
            state.loading = true;
        }).addCase(writeListDataAnnoLink.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        }).addCase(writeListDataAnnoLink.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })
    },
})

const WriteListCateDataOn = createSlice({
    name: 'WriteListCateDataOn',
    initialState: writeInitialState(),
    reducers: {
        resetWriteCate: (state) => {
            return writeInitialState();
        },
    },
    extraReducers: (builder) => {
        builder.addCase(writeListCateData.pending, (state) => {
            state.loading = true;
        }).addCase(writeListCateData.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload.totalPages) {
                const newWriteData = action.payload.write.filter(newItem =>
                    !state.data.write.some(existingItem => existingItem.id === newItem.id)
                );
                state.data.write = [...state.data.write, ...newWriteData];
                state.data.totalPages = action.payload.totalPages;
            }
        }).addCase(writeListCateData.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })

    },
});

const WriteListSearchDataOn = createSlice({
    name: 'WriteListSearchDataOn',
    initialState: writeInitialState(),
    reducers: {
        resetWriteSearch: (state) => {
            return writeInitialState();
        },
    },
    extraReducers: (builder) => {
        builder.addCase(writeListSearchData.pending, (state) => {
            state.loading = true;
        }).addCase(writeListSearchData.fulfilled, (state, action) => {
            state.loading = false;

            if (action.payload.totalPages) {
                const newWriteData = action.payload.write.filter(newItem =>
                    !state.data.write.some(existingItem => existingItem.id === newItem.id)
                );
                state.data.write = [...state.data.write, ...newWriteData];
                state.data.totalPages = action.payload.totalPages;
            }
        }).addCase(writeListSearchData.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })

    },
});

const memoInitialState = {
    data: {
        memo: [],
        totalPages: null,
        page: 1,
    },
    error: null,
}

const memoData = createSlice({
    name: 'memoData',
    initialState: memoInitialState,
    reducers: {

        setMemoPage(state, action) {
            state.data.page = action.payload;
        },

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
        },

        resetMemo: () => memoInitialState,

    },

    extraReducers: (builder) => {
        builder.addCase(memoListData.pending, (state) => {
            state.loading = true;
        }).addCase(memoListData.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.memo) {
                const newMemoData = action.payload.memo.filter(newItem =>
                    !state.data.memo.some(existingItem => existingItem.id === newItem.id)
                );
                state.data.memo = [...state.data.memo, ...newMemoData];
                state.data.totalPages = action.payload.totalPages;
            }
        }).addCase(memoListData.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })

    },
});

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
        },
        syncCateListDataDel(state, action) {
            if (action.payload !== undefined) {
                const deleteCate = state.data.cate.filter(item =>
                    item.category !== action.payload.category
                )
                state.data.cate = deleteCate;
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
});

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

export const { syncWriteListData, syncWriteListDataUpdate } = WriteListView.actions;
export const { syncMemoListDataAdd, syncMemoListDelete, syncMemoListDataUpdate, syncMemoListAnno, syncMemoListAnnoUpdate, syncMemoListAnnoDelete, resetMemo, setMemoPage } = memoData.actions;
export const { syncWriteListPageData, syncWriteListPageDataUpdate, syncWriteListDelete } = WriteListPageDataOn.actions;
export const { syncWriteListDateData } = WriteListDateDataOn.actions;
export const { resetWriteCate } = WriteListCateDataOn.actions;
export const { resetWriteSearch } = WriteListSearchDataOn.actions;
export const { syncWriteListDataAnnoLink } = WriteListDataAnnoLinkOn.actions;
export const { cateListDataAdd, syncCateListData, syncCateListDataDel } = cateData.actions;
export const { syncBookListDataAdd, syncBookListDelete } = bookData.actions;

const store = configureStore({
    reducer: {
        WriteListView: WriteListView.reducer,
        WriteListPageDataOn: WriteListPageDataOn.reducer,
        WriteListDateDataOn: WriteListDateDataOn.reducer,
        WriteListCateDataOn: WriteListCateDataOn.reducer,
        WriteListSearchDataOn: WriteListSearchDataOn.reducer,
        WriteListDataAnnoLinkOn: WriteListDataAnnoLinkOn.reducer,
        memoData: memoData.reducer,
        cateData: cateData.reducer,
        bookData: bookData.reducer,
    }
});

export default store;