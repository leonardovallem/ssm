// @ts-nocheck
import {createSlice} from "@reduxjs/toolkit"
import RegisterBank from "../../processor/components/RegisterBank"
import VolatileMemory from "../../processor/components/VolatileMemory"
import MIPS from "../../processor/MIPS"
import ReservationStations from "../../processor/components/tomasulo/ReservationStations"
import ReorderBuffers, {State} from "../../processor/components/tomasulo/ReorderBuffers"

const mips = createSlice({
    name: "mips",
    initialState: {
        program: "",
        registerBank: RegisterBank.cleared().serialize(),
        memory: new VolatileMemory(MIPS.MEMORY_SIZE),
        PC: 0,
        cycles: 0,
        parsedInstructions: [],
        reservationStations: ReservationStations.init().stations,
        reorderBuffers: ReorderBuffers.init().buffer.data,
        phase: State.STAND_BY
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
        updateReorderBuffers: (state, action) => {
            if (window.debug) console.log("[MIPS] Updating Reorder Buffers")
            state.reorderBuffers = action.payload
        },
        updateMetrics: (state, action) => {
            if (window.debug) console.log("[MIPS] Executing next instruction")
            const {pc, cycles} = action.payload
            if (pc) state.PC = pc
            if (cycles) state.cycles = cycles
        },
        runPhase: (state, action) => {
            if (window.debug) console.log(`[MIPS] Running ${action.payload.toString()} phase`)
            state.phase = action.payload
        },
        reset: (state) => {
            state.registerBank = RegisterBank.serialize()
            state.memory = new VolatileMemory(MIPS.MEMORY_SIZE)
            state.PC = 0
            state.cycles = 0
            state.parsedInstructions = []
            state.reservationStations = ReservationStations.init().stations
            state.phase = State.STAND_BY
        }
    },
})

export const mipsActions = mips.actions
export default mips.reducer
