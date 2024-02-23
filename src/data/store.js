import { configureStore, createSlice, getDefaultMiddleware } from '@reduxjs/toolkit'
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

import { WriteData, memoData, cateData, bookData, rootReducer } from './reducers.js';

export const { writeListDataAdd, writeListDataUpdate, writeListDataDelete } = WriteData.actions;
export const { memoListDataAdd, memoListDataDelete, memoListDataUpdate, memoListAnno, memoListAnnoUpdate, memoListAnnoDelete } = memoData.actions;
export const { cateListDataAdd } = cateData.actions;
export const { bookListDataAdd, bookListDelete } = bookData.actions;

export default configureStore({
    reducer: rootReducer,
});