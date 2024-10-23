import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './Rootreducer'
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: rootReducer,
})

store.subscribe(() => {
    console.log(store.getState())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;