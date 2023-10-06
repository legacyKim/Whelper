import { configureStore, createSlice } from '@reduxjs/toolkit'
import WriteListData from './data'
import SearchListData from './searchData'
import memoListData from './dataMemo'

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
        },
        writeListDataDelete(state, deleteWriteList) {
            const deleteWriteId = deleteWriteList.payload.id;
            return state.filter(item => item.id !== deleteWriteId);
        }
    }
})

let SearchData = createSlice({
    name: 'SearchData',
    initialState: SearchListData,
    reducers: {
        searchListDataCorrect(state, recentSerachList) {
            const recentSerach = [...state, recentSerachList.payload];
            return recentSerach;
        },
        searchListDataDelete(state, deleteSearchList) {
            const deleteSearchContent = deleteSearchList.payload.searchContent;
            return state.filter(item => item.searchContent !== deleteSearchContent);
        }
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
            const updateMemoId = updateMemoList.payload.id;
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

export const { writeListDataAdd, writeListDataUpdate, writeListDataDelete } = WriteData.actions;
export const { searchListDataCorrect, searchListDataDelete } = SearchData.actions;
export const { memoListDataAdd, memoListDataDelete, memoListDataUpdate } = memoData.actions;

export default configureStore({
    reducer: {
        WriteData: WriteData.reducer,
        SearchData: SearchData.reducer,
        memoData: memoData.reducer,
    },
});