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
            state[deleteSearchId].title = deleteSearchList.payload.updateTitle;
        }
    }
})

export const { writeListDataCorrect, writeListDataUpdate } = WriteData.actions;
export const { searchListDataCorrect, searchListDataDelete } = SearchData.actions;

export default configureStore({
    reducer: {
        WriteData: WriteData.reducer,
        SearchData: SearchData.reducer,
    },
});