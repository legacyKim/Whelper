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

export const { writeListDataCorrect, writeListDataUpdate } = WriteData.actions;

export default configureStore({
    reducer: {
        WriteData: WriteData.reducer,
    },
});