import { configureStore, createSlice } from '@reduxjs/toolkit'
import WriteContentData from './data'

let WriteData = createSlice({
    name: 'WriteData',
    initialState: WriteContentData,
    reducers: {
        writeListDataCorrect(state) {
            return 'john ' + state
        }
    }
})

export let writeListDataCorrect = WriteData.actions

export default configureStore({
    reducer: {
        WriteData: WriteData.reducer,
    }
})