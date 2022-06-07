// @ts-nocheck
import {createSlice} from "@reduxjs/toolkit"
import ProgramState from "../../util/EditorState"

const editor = createSlice({
    name: "editor",
    initialState: {
        state: ProgramState.NOT_RUNNING,
        zoom: 16,
        theme: "Active4D",
        error: null
    },
    reducers: {
        loadRun: (state) => {
            if (window.debug) console.log("[EDITOR] Program loaded: RUN")
            state.state = ProgramState.LOADING_RUN
        },
        loadDebug: (state) => {
            if (window.debug) console.log("[EDITOR] Program loaded: DEBUG")
            state.state = ProgramState.LOADING_DEBUG
        },
        programRunning: (state) => {
            if (window.debug) console.log("[EDITOR] Program running")
            state.state = ProgramState.RUNNING
        },
        programDebugging: (state) => {
            if (window.debug) console.log("[EDITOR] Program debugging")
            state.state = ProgramState.DEBUGGING
        },
        waitingNextInstruction: (state) => {
            if (window.debug) console.log("[EDITOR] Program waiting for next instruction")
            state.state = ProgramState.WAITING_FOR_NEXT_INSTRUCTION
        },
        executeNextInstruction: (state) => {
            if (window.debug) console.log("[EDITOR] Executing next instruction")
            state.state = ProgramState.EXECUTE_NEXT_INSTRUCTION
        },
        stopExecution: (state) => {
            if (window.debug) console.log("[EDITOR] Stopping execution")
            state.state = ProgramState.NOT_RUNNING
        },
        noticeError: (state, action) => {
            state.error = action.payload
        },
        increaseZoom: (state) => {
            state.zoom++
        },
        decreaseZoom: (state) => {
            state.zoom--
        },
        changeTheme: (state, action) => {
            state.theme = action.payload
        }
    }
})

export const editorActions = editor.actions
export default editor.reducer