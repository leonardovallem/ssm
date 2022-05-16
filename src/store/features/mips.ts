import {createSlice} from "@reduxjs/toolkit"
import RegisterBank from "../../processor/components/RegisterBank"
import Memory from "../../processor/components/Memory"

const mips = createSlice({
    name: "mips",
    initialState: {
        program: "",
        registerBank: new RegisterBank().serialize(),
        memory: new Memory(32).table,
        PC: 0,
    },
    reducers: {
        loadProgram: (state, action) => {
            // console.log("[MIPS] Program loaded")
            state.program = action.payload
        },
        updateRegisterBank: (state, action) => {
            // console.log("[MIPS] Updating register bank")
            state.registerBank = action.payload
        },
        updateMemory: (state, action) => {
            // console.log("[MIPS] Updating memory")
            state.memory = action.payload
        },
        nextInstruction: (state) => {
            // console.log("[MIPS] Executing next instruction")
            state.PC++
        },
        reset: (state) => {
            state.registerBank = new RegisterBank().serialize()
            state.memory = new Memory(32).table
            state.PC = 0
        }
    },
})

export const mipsActions = mips.actions
export default mips.reducer
