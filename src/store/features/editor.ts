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
        loadProgram: (state) => {
            // console.log("[EDITOR] Program loaded")
            state.state = ProgramState.LOADING_RUN
        },
        programRunning: (state) => {
            // console.log("[EDITOR] Program running")
            state.state = ProgramState.RUNNING
        },
        programDebugging: (state) => {
            // console.log("[EDITOR] Program debugging")
            state.state = ProgramState.DEBUGGING
        },
        executeNextInstruction: (state) => {
            // console.log("[EDITOR] Executing next instruction")
            state.state = ProgramState.EXECUTE_NEXT_INSTRUCTION
        },
        stopExecution: (state) => {
            // console.log("[EDITOR] Stopping execution")
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