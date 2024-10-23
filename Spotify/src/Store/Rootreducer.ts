import { combineReducers } from 'redux';
import authSlice from "./Reducer/AuthpageReducer"

const rootReducer = combineReducers({
    auth : authSlice
});

export type RootStates = ReturnType<typeof rootReducer>;

export default rootReducer;