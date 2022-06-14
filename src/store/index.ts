import {combineReducers, configureStore} from "@reduxjs/toolkit"
import mips from "./features/mips"
import editor from "./features/editor"

const reducer = combineReducers({
    mips,
    editor
})

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export default store

export type RootState = ReturnType<typeof store.getState>