import React, {  useRef } from 'react';

import { configureStore, createSlice } from '@reduxjs/toolkit'
import WriteContentData from './data'

let WriteData = createSlice({
    name: 'WriteData',
    initialState: WriteContentData,
    reducers: {
        WriteListDataCorrect(state) {

            console.log(state)
        }
    }
})

export const { WriteListDataCorrect } = WriteData.actions;

export default configureStore({
    reducer: {
        WriteData: WriteData.reducer,
    },
});