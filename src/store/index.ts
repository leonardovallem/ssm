import {combineReducers, configureStore} from "@reduxjs/toolkit"
import mips from "./features/mips"
import editor from "./features/editor"
import persistedReducers from "./persist"
import {persistStore} from "redux-persist"

const reducer = combineReducers({
    mips,
    editor
})

const store = configureStore({
    reducer: persistedReducers(reducer),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export default store

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>