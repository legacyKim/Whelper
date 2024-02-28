import { createSlice, configureStore } from '@reduxjs/toolkit';
import { writeListData, memoListData, cateListData, bookListData } from './api.js'

const WriteData = createSlice({
    name: 'WriteData',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        writeListDataAdd: (state, action) => {
            state.data.push(action.payload);
        },
        writeListDataUpdate: (state, action) => {
            const updateWriteId = action.payload.id;
            const updatedWrite = action.payload;

            // state[updateWriteId].title = action.payload.updateTitle;
            // state[updateWriteId].subTitle = action.payload.updateSubTitle;
            // state[updateWriteId].content = action.payload.updateContent;
            // state[updateWriteId].keyword = action.payload.updateKeyword;

            state[updateWriteId] = updatedWrite;
        },
        writeListDataDelete: (state, action) => {
            const deleteWriteId = action.payload.id;
            return state.filter(item => item.id !== deleteWriteId);
        },
    },

    extraReducers: (builder) => {
        builder.addCase(writeListData.pending, (state) => {
            state.loading = true;
        }).addCase(writeListData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        }).addCase(writeListData.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })
    },
});

const memoData = createSlice({
    name: 'memoData',
    initialState: [],
    reducers: {
        memoListDataAdd(state, newMemoList) {
            const newMemo = [...state, newMemoList.payload];
            return newMemo;
        },
        memoListDataUpdate(state, updateMemoList) {
            const updateMemoId = updateMemoList.payload.memoId;
            // state[updateMemoId].memoSource = updateMemoList.payload.updateMemoSource;
            // state[updateMemoId].memoAuthor = updateMemoList.payload.updateMemoAuthor;
            // state[updateMemoId].memoComment = updateMemoList.payload.updateMemoComment;
        },
        memoListAnno(state, newAnnoList) {

            const updateMemoId = newAnnoList.payload.memoId;
            const newAnnotation = newAnnoList.payload.memoAnno;
            const memoAnnoIndex = newAnnoList.payload.memoAnnoIndex;

            state[updateMemoId].memoAnnotation = {
                ...state[updateMemoId].memoAnnotation,
                [memoAnnoIndex]: newAnnotation,
            };
        },
        memoListAnnoUpdate(state, updateAnnoList) {
            const updateWriteId = updateAnnoList.payload.corrMemoId;
            const AnnoKey = updateAnnoList.payload.corrAnnotationKeys;
            state[updateWriteId].memoAnnotation[AnnoKey] = updateAnnoList.payload.corrMemoAnno;
        },
        memoListAnnoDelete(state, deleteAnnoList) {

            const updateWriteId = deleteAnnoList.payload.corrMemoId;
            const AnnoKey = deleteAnnoList.payload.corrAnnotationKeys;

            return state.map(item => {
                if (item.id === updateWriteId) {
                    const updatedAnnotations = { ...item.memoAnnotation };
                    delete updatedAnnotations[AnnoKey];
                    return { ...item, memoAnnotation: updatedAnnotations, };
                }
                return item;
            });
        }
    },

    extraReducers: (builder) => {
        builder.addCase(memoListData.pending, (state) => {
            state.loading = true;
        }).addCase(memoListData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        }).addCase(memoListData.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })
    },
})

const cateData = createSlice({
    name: 'cateData',
    initialState: [],
    reducers: {
        cateListDataAdd(state, newCateList) {
            const newCate = [...state, newCate.payload];
            return newCate;
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
    initialState: [],
    reducers: {
        bookListDataAdd(state, newBookList) {
            const book = [...state, newBookList.payload];
            return book;
        },
        bookListDelete(state, deleteBookList) {
            const deleteBook = deleteBookList.payload.book;
            return state.filter(item => item.book !== deleteBook);
        }
    },

    extraReducers: (builder) => {
        builder.addCase(bookListData.pending, (state) => {
            state.loading = true;
        }).addCase(bookListData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        }).addCase(bookListData.rejected, (state, action) => {
            state.error = action.payload ?? action.error
        })
    },
});

export const { writeListDataAdd, writeListDataUpdate, writeListDataDelete } = WriteData.actions;
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