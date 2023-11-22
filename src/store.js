import { configureStore, createSlice } from '@reduxjs/toolkit'
import WriteListData from './data/data'
import SearchListData from './data/searchData'
import memoListData from './data/dataMemo'
import CateListData from './data/cateData'

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
            state[updateMemoId].memoKeyword = updateMemoList.payload.updateMemoKeyword;
            state[updateMemoId].memoOwner = updateMemoList.payload.updateMemoOwner;
            state[updateMemoId].memoSource = updateMemoList.payload.updateMemoSource;
            state[updateMemoId].memoComment = updateMemoList.payload.updateMemoComment;
        },
        memoListDataDelete(state, deleteMemoList) {
            const deleteMemoId = deleteMemoList.payload.id;
            return state.filter(item => item.id !== deleteMemoId);
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

export const { writeListDataAdd, writeListDataUpdate, writeListDataDelete } = WriteData.actions;
export const { memoListDataAdd, memoListDataDelete, memoListDataUpdate } = memoData.actions;
export const { cateListDataAdd } = cateData.actions;

export default configureStore({
    reducer: {
        WriteData: WriteData.reducer,
        memoData: memoData.reducer,
        cateData: cateData.reducer,
    },
});