import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import MipsEngine from "../../processor/MIPS"
import {RootState} from "../../store"
import ProgramState from "../../util/EditorState"
import {editorActions} from "../../store/features/editor"
import {mipsActions} from "../../store/features/mips"
import RegisterBank, {RegisterAliasTable} from "../../processor/components/RegisterBank"
import ReservationStations from "../../processor/components/tomasulo/ReservationStations"
import ReorderBuffers, {State} from "../../processor/components/tomasulo/ReorderBuffers"

export default function Mips() {
    const dispatch = useDispatch()
    const [ran, setRan] = useState(false)

    function configureExecution() {
        if (!ran) {
            RegisterAliasTable.init()
            ReservationStations.init()
            loadComponents()
        }

        MipsEngine.beforeExecution = () => {
            dispatch(mipsActions.loadInstructions(MipsEngine.engine.parsedInstructions))
            dispatch(mipsActions.updateReservationStations(ReservationStations.stations))
            dispatch(mipsActions.updateReorderBuffers(ReorderBuffers.buffer.data))
        }
        MipsEngine.afterInstruction = () => {
            dispatch(mipsActions.loadInstructions(MipsEngine.engine.parsedInstructions))
            dispatch(mipsActions.updateReservationStations(ReservationStations.stations))
            dispatch(mipsActions.updateReorderBuffers(ReorderBuffers.buffer.data))
            dispatch(mipsActions.updateRegisterBank(RegisterBank.registers))
            dispatch(mipsActions.updateMemory(MipsEngine.memory))
            dispatch(mipsActions.updateMetrics(MipsEngine.engine))
        }
        MipsEngine.afterExecution = () => {
            dispatch(mipsActions.updateRegisterBank(RegisterBank.registers))
            dispatch(mipsActions.updateMemory(MipsEngine.memory))
            dispatch(mipsActions.updateMetrics({pc: 0}))
            dispatch(editorActions.stopExecution())
        }
    }

    const {mips, editor} = useSelector<RootState, any>((state) => state)

    function loadComponents() {
        RegisterBank.update(mips.registerBank)
        MipsEngine.memory = mips.memory
        MipsEngine.engine.parsedInstructions = mips.parsedInstructions
        MipsEngine.loadProgram(mips.program)
        MipsEngine.setPC(mips.PC)
        MipsEngine.setCycles(mips.cycles)
        ReservationStations.stations = mips.reservationStations
        ReorderBuffers.buffer.data = mips.reorderBuffers
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
                setRan(true)
                // dispatch(mipsActions.reset())   // TODO check if this is overwritting
                loadComponents()
                break
            case ProgramState.RUNNING:
                setRan(true)
                try {
                    switch (mips.phase) {
                        case State.ISSUE:
                            loadProgram(() => MipsEngine.issueInstructions())
                            break
                        case State.EXECUTE:
                            MipsEngine.engine.executeInstructions(MipsEngine.afterInstruction)
                            MipsEngine.afterExecution()
                            break
                        case State.WRITE_RESULT:
                            MipsEngine.engine.writeResult(MipsEngine.afterInstruction)
                            MipsEngine.afterExecution()
                            break
                        case State.COMMIT:
                            MipsEngine.engine.commit(MipsEngine.afterInstruction)
                            MipsEngine.afterExecution()
                            break
                    }
                } catch (e: any) {
                    // @ts-ignore
                    if (window.debug) console.log(e)
                    dispatch(editorActions.noticeError(e))
                    dispatch(editorActions.stopExecution())
                }
                break
            case ProgramState.DEBUGGING:
            case ProgramState.WAITING_FOR_NEXT_INSTRUCTION:
                setRan(true)
                // idle
                break
            case ProgramState.EXECUTE_NEXT_INSTRUCTION:
                setRan(true)
                if (MipsEngine.executeTomasulo()) dispatch(editorActions.waitingNextInstruction())
                break
            default:
                setRan(false)
        }
    }, [editor.state])

    return <></>
}