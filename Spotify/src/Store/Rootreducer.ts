import { combineReducers } from 'redux';
import authSlice from "./Reducer/AuthpageReducer"
import spotifySlice from "./Reducer/SpoyifyReducer"
import playlistSlice from "./Reducer/PlaylistReducer"

const rootReducer = combineReducers({
    auth : authSlice,
    spotify : spotifySlice,
    playlist : playlistSlice

});

export type RootStates = ReturnType<typeof rootReducer>;

export default rootReducer;