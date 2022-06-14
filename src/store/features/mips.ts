// @ts-nocheck
import {createSlice} from "@reduxjs/toolkit"
import RegisterBank from "../../processor/components/RegisterBank"
import VolatileMemory from "../../processor/components/VolatileMemory"
import MIPS from "../../processor/MIPS"
import ReservationStations from "../../processor/components/tomasulo/ReservationStations"

const mips = createSlice({
    name: "mips",
    initialState: {
        program: "",
        registerBank: RegisterBank.cleared().serialize(),
        memory: new VolatileMemory(MIPS.MEMORY_SIZE),
        PC: 0,
        cycles: 0,
        parsedInstructions: [],
        reservationStations: ReservationStations.init().stations
    },
    reducers: {
        loadProgram: (state, action) => {
            if (window.debug) console.log("[MIPS] Program loaded")
            state.program = action.payload
        },
        loadInstructions: (state, action) => {
            if (window.debug) console.log("[MIPS] Parsed instructions loaded")
            state.parsedInstructions = action.payload
        },
        updateRegisterBank: (state, action) => {
            if (window.debug) console.log("[MIPS] Updating register bank")
            state.registerBank = action.payload
        },
        updateMemory: (state, action) => {
            if (window.debug) console.log("[MIPS] Updating memory")
            state.memory = action.payload
        },
        updateReservationStations: (state, action) => {
            if (window.debug) console.log("[MIPS] Updating Reservation Stations")
            state.reservationStations = action.payload
        },
        updateMetrics: (state, action) => {
            if (window.debug) console.log("[MIPS] Executing next instruction")
            const {pc, cycles} = action.payload
            state.PC = pc
            state.cycles = cycles
        },
        reset: (state) => {
            state.registerBank = RegisterBank.serialize()
            state.memory = new VolatileMemory(MIPS.MEMORY_SIZE)
            state.PC = 0
            state.cycles = 0
            state.parsedInstructions = []
        }
    },
})

export const mipsActions = mips.actions
export default mips.reducer
