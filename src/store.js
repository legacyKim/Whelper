import { configureStore, createSlice } from '@reduxjs/toolkit'
import WriteListData from './data/data'
import SearchListData from './data/searchData'
import memoListData from './data/dataMemo'
import CateListData from './data/cateData'
import bookListData from './data/bookData'

let WriteData = createSlice({
    name: 'WriteData',
    initialState: WriteListData,
    reducers: {
        writeListDataAdd(state, newWriteList) {
            const newWrite = [...state, newWriteList.payload];
            return newWrite;
        },
        writeListDataUpdate(state, updateWriteList) {
            const updateWriteId = updateWriteList.payload.id;
            state[updateWriteId].title = updateWriteList.payload.updateTitle;
            state[updateWriteId].subTitle = updateWriteList.payload.updateSubTitle;
            state[updateWriteId].content = updateWriteList.payload.updateContent;
            state[updateWriteId].keyword = updateWriteList.payload.updateKeyword;
        },
        writeListDataDelete(state, deleteWriteList) {
            const deleteWriteId = deleteWriteList.payload.id;
            return state.filter(item => item.id !== deleteWriteId);
        },
    }
})

let memoData = createSlice({
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
                    return { ...item, memoAnnotation : updatedAnnotations, };
                }
                return item;
            });

        }
    }
})

let cateData = createSlice({
    name: 'cateData',
    initialState: CateListData,
    reducers: {
        cateListDataAdd(state, newCateList) {
            const newCate = [...state, newCate.payload];
            return newCate;
        },
    }
})

let bookData = createSlice({
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
})

export const { writeListDataAdd, writeListDataUpdate, writeListDataDelete } = WriteData.actions;
export const { memoListDataAdd, memoListDataDelete, memoListDataUpdate, memoListAnno, memoListAnnoUpdate, memoListAnnoDelete } = memoData.actions;
export const { cateListDataAdd } = cateData.actions;
export const { bookListDataAdd, bookListDelete } = bookData.actions;

export default configureStore({
    reducer: {
        WriteData: WriteData.reducer,
        memoData: memoData.reducer,
        cateData: cateData.reducer,
        bookData: bookData.reducer,
    },
});