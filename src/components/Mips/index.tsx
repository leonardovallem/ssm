import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import MipsEngine from "../../processor/MIPS"
import {RootState} from "../../store"
import ProgramState from "../../util/EditorState"
import {editorActions} from "../../store/features/editor"
import {mipsActions} from "../../store/features/mips";

export default function Mips() {
    const dispatch = useDispatch()
    const mipsEngine = new MipsEngine()

    mipsEngine.afterInstruction = () => {
        dispatch(mipsActions.updateRegisterBank(mipsEngine.registerBank.registers))
        dispatch(mipsActions.updateMemory(mipsEngine.memory.table))
        dispatch(mipsActions.nextInstruction())
    }
    mipsEngine.afterExecution = () => {
        dispatch(editorActions.stopExecution())
    }

    const {mips, editor} = useSelector<RootState, any>((state) => state)

    function loadComponents() {
        mipsEngine.memory.update(mips.memory)
        mipsEngine.registerBank.update(mips.registerBank)
        mipsEngine.PC = mips.PC
    }

    useEffect(() => {
        switch (editor.state) {
            case ProgramState.LOADING_RUN:
            case ProgramState.LOADING_DEBUG:
                dispatch(mipsActions.reset())
                loadComponents()

                try {
                    if((mips.program?.trim() ?? "") === "") {
                        dispatch(editorActions.noticeError("Code is empty"))
                        dispatch(editorActions.stopExecution())
                        return
                    }

                    mipsEngine.loadProgram(mips.program)
                    if (editor.state === ProgramState.LOADING_RUN) {
                        dispatch(editorActions.programRunning())
                        mipsEngine.executeProgram()
                    }
                    else dispatch(editorActions.programDebugging())
                } catch(e: any) {
                    dispatch(editorActions.noticeError(e))
                    dispatch(editorActions.stopExecution())
                }

                break
            case ProgramState.EXECUTE_NEXT_INSTRUCTION:
                mipsEngine.executeNextInstruction()
                dispatch(editorActions.programDebugging())
        }
    }, [mips, editor])

    return <></>
}