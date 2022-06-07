import {persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage"
import {Reducer} from "@reduxjs/toolkit"

const persistedReducer = (reducers: Reducer) => persistReducer({
        key: "SSM",
        storage,
        blacklist: ["mips"]
    },
    reducers
)

export default persistedReducer