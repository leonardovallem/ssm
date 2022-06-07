import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import MipsEngine from "../../processor/MIPS"
import {RootState} from "../../store"
import ProgramState from "../../util/EditorState"
import {editorActions} from "../../store/features/editor"
import {mipsActions} from "../../store/features/mips"

export default function Mips() {
    const dispatch = useDispatch()
    const mipsEngine = new MipsEngine()

    function configureExecution() {
        loadComponents()

        mipsEngine.afterInstruction = () => {
            dispatch(mipsActions.updateRegisterBank(mipsEngine.registerBank.registers))
            dispatch(mipsActions.updateMemory(mipsEngine.memory))
            dispatch(mipsActions.updateMetrics(mipsEngine.engine))
        }
        mipsEngine.afterExecution = () => {
            dispatch(mipsActions.updateRegisterBank(mipsEngine.registerBank.registers))
            dispatch(mipsActions.updateMemory(mipsEngine.memory))
            dispatch(editorActions.stopExecution())
        }
    }

    const {mips, editor} = useSelector<RootState, any>((state) => state)

    function loadComponents() {
        mipsEngine.memory = mips.memory
        mipsEngine.registerBank.update(mips.registerBank)
        mipsEngine.loadProgram(mips.program)
        mipsEngine.setPC(mips.PC)
        mipsEngine.setCycles(mips.cycles)
    }

    function loadProgram(after: () => void = () => {
    }) {
        if ((mips.program?.trim() ?? "") === "") {
            dispatch(editorActions.noticeError("Code is empty"))
            dispatch(editorActions.stopExecution())
            return
        }

        mipsEngine.loadProgram(mips.program)
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
                    loadProgram(() => mipsEngine.executeProgram())
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
                if (mipsEngine.executeNextInstruction()) dispatch(editorActions.waitingNextInstruction())
        }
    }, [editor.state])

    return <></>
}