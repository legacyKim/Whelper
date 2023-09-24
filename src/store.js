import { configureStore, createSlice } from '@reduxjs/toolkit'
import WriteListData from './data'
import SearchListData from './searchData'

let WriteData = createSlice({
    name: 'WriteData',
    initialState: WriteListData,
    reducers: {
        writeListDataCorrect(state, newWriteList) {
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
            const deleteSearchId = deleteSearchList.payload.id;
            return state.filter(item => item.id !== deleteSearchId);
        }
    }
})

export const { writeListDataCorrect, writeListDataUpdate, writeListDataDelete } = WriteData.actions;
export const { searchListDataCorrect, searchListDataDelete } = SearchData.actions;

export default configureStore({
    reducer: {
        WriteData: WriteData.reducer,
        SearchData: SearchData.reducer,
    },
});