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
            state.loading = false;
            state.error = action.error.message;
        })
    },
});

const memoData = createSlice({
    name: 'memoData',
    initialState: memoListData,
    reducers: {
        memoListDataAdd(state, newMemoList) {
            const newMemo = [...state, newMemoList.payload];
            return newMemo;
        },
        memoListDataUpdate(state, updateMemoList) {
            const updateMemoId = updateMemoList.payload.memoId;
            state[updateMemoId].memoSource = updateMemoList.payload.updateMemoSource;
            state[updateMemoId].memoAuthor = updateMemoList.payload.updateMemoAuthor;
            state[updateMemoId].memoComment = updateMemoList.payload.updateMemoComment;
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
    }
})

const cateData = createSlice({
    name: 'cateData',
    initialState: cateListData,
    reducers: {
        cateListDataAdd(state, newCateList) {
            const newCate = [...state, newCate.payload];
            return newCate;
        },
    }
})

const bookData = createSlice({
    name: 'bookData',
    initialState: bookListData,
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