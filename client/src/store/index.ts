import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/user'

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
})