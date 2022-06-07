// @ts-nocheck
import {createSlice} from "@reduxjs/toolkit"
import RegisterBank from "../../processor/components/RegisterBank"
import VolatileMemory from "../../processor/components/VolatileMemory"
import MIPS from "../../processor/MIPS"

const mips = createSlice({
    name: "mips",
    initialState: {
        program: "",
        registerBank: new RegisterBank().serialize(),
        memory: new VolatileMemory(MIPS.MEMORY_SIZE),
        PC: 0,
    },
    reducers: {
        loadProgram: (state, action) => {
            if (window.debug) console.log("[MIPS] Program loaded")
            state.program = action.payload
        },
        updateRegisterBank: (state, action) => {
            if (window.debug) console.log("[MIPS] Updating register bank")
            state.registerBank = action.payload
        },
        updateMemory: (state, action) => {
            if (window.debug) console.log("[MIPS] Updating memory")
            state.memory = action.payload
        },
        nextInstruction: (state) => {
            if (window.debug) console.log("[MIPS] Executing next instruction")
            state.PC++
        },
        reset: (state) => {
            state.registerBank = new RegisterBank().serialize()
            state.memory = new VolatileMemory(MIPS.MEMORY_SIZE)
            state.PC = 0
        }
    },
})

export const mipsActions = mips.actions
export default mips.reducer
