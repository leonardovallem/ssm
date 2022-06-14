import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import MipsEngine from "../../processor/MIPS"
import {RootState} from "../../store"
import ProgramState from "../../util/EditorState"
import {editorActions} from "../../store/features/editor"
import {mipsActions} from "../../store/features/mips"
import RegisterBank, {RegisterAliasTable} from "../../processor/components/RegisterBank"
import ReservationStations from "../../processor/components/tomasulo/ReservationStations"

export default function Mips() {
    const dispatch = useDispatch()

    function configureExecution() {
        RegisterAliasTable.init()
        ReservationStations.init()
        loadComponents()

        MipsEngine.beforeExecution = () => {
            dispatch(mipsActions.loadInstructions(MipsEngine.parsedInstructions))
            dispatch(mipsActions.updateReservationStations(ReservationStations.stations))
        }
        MipsEngine.afterInstruction = () => {
            dispatch(mipsActions.updateRegisterBank(RegisterBank.registers))
            dispatch(mipsActions.updateMemory(MipsEngine.memory))
            dispatch(mipsActions.updateMetrics(MipsEngine.engine))
        }
        MipsEngine.afterExecution = () => {
            dispatch(mipsActions.updateRegisterBank(RegisterBank.registers))
            dispatch(mipsActions.updateMemory(MipsEngine.memory))
            dispatch(editorActions.stopExecution())
        }
    }

    const {mips, editor} = useSelector<RootState, any>((state) => state)

    function loadComponents() {
        RegisterBank.update(mips.registerBank)
        MipsEngine.memory = mips.memory
        MipsEngine.parsedInstructions = mips.parsedInstructions
        MipsEngine.loadProgram(mips.program)
        MipsEngine.setPC(mips.PC)
        MipsEngine.setCycles(mips.cycles)
        ReservationStations.stations = mips.reservationStations
    }

    function loadProgram(after: () => void = () => {
    }) {
        if ((mips.program?.trim() ?? "") === "") {
            dispatch(editorActions.noticeError("Code is empty"))
            dispatch(editorActions.stopExecution())
            return
        }

        MipsEngine.loadProgram(mips.program)
        after()
    }

    useEffect(() => {
        try {
            if (mips.program) configureExecution()
        } catch (e: any) {
            // @ts-ignore
            if (window.debug) console.log(e)
            dispatch(editorActions.noticeError(e))
            dispatch(editorActions.stopExecution())
        }

        switch (editor.state) {
            case ProgramState.LOADING_RUN:
            case ProgramState.LOADING_DEBUG:
                dispatch(mipsActions.reset())
                loadComponents()
                break
            case ProgramState.RUNNING:
                try {
                    loadProgram(() => MipsEngine.executeProgram())
                } catch (e: any) {
                    // @ts-ignore
                    if (window.debug) console.log(e)
                    dispatch(editorActions.noticeError(e))
                    dispatch(editorActions.stopExecution())
                }
                break
            case ProgramState.DEBUGGING:
            case ProgramState.WAITING_FOR_NEXT_INSTRUCTION:
                // idle
                break
            case ProgramState.EXECUTE_NEXT_INSTRUCTION:
                if (MipsEngine.executeNextInstruction()) dispatch(editorActions.waitingNextInstruction())
        }
    }, [editor.state])

    return <></>
}