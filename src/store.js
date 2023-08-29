import { configureStore, createSlice } from '@reduxjs/toolkit'
import WriteContentData from './data'

let writeData = createSlice({
    name: 'writeData',
    initialState: WriteContentData,
    reducers : {
        writeListDataCorrect(state){
          return 'john ' + state
        }
      }
})

export let writeListDataCorrect = writeData.actions

export default configureStore({
    reducer: {
        writeData: writeData.reducer,
    }
}) 