enum ProgramState {
    NOT_RUNNING,
    LOADING_RUN,
    LOADING_DEBUG,
    RUNNING,
    DEBUGGING,
    WAITING_FOR_NEXT_INSTRUCTION,
    EXECUTE_NEXT_INSTRUCTION,
}

export const isInExecution = (state: ProgramState) => ![
    ProgramState.NOT_RUNNING,
    ProgramState.LOADING_RUN,
    ProgramState.LOADING_DEBUG
].includes(state)

export default ProgramState