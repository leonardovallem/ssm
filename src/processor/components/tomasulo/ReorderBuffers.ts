import Queue from "../../../util/Queue"

export enum State {
    ISSUE = "Issue",
    EXECUTE = "Execute",
    WRITE_RESULT = "Write Result",
    COMMIT = "Commit",
    STAND_BY = "Stand By",
}

export const nextPhase = (state: State) => {
    switch (state) {
        case State.STAND_BY:
            return State.ISSUE
        case State.ISSUE:
            return State.EXECUTE
        case State.EXECUTE:
            return State.WRITE_RESULT
        case State.WRITE_RESULT:
            return State.COMMIT
    }
    return State.ISSUE
}

export class ReorderBuffer {
    static count: number = 0
    entry: number
    busy: boolean
    state: State
    instruction?: string
    value?: number

    constructor(instruction?: string, state: State = State.ISSUE) {
        this.entry = ++ReorderBuffer.count
        this.busy = true
        this.state = state
        this.instruction = instruction
    }
}

export class ReorderBuffers {
    private lastRegister: number = 0
    buffer: Queue<ReorderBuffer> = new Queue<ReorderBuffer>()
    private index: { [inst: string]: number } = {}

    constructor(size = 100) {
        this.init(size)
    }

    init(size = 100) {
        this.buffer = new Queue<ReorderBuffer>(size)
        return this
    }

    writeValue = (instruction: Array<string>) => {
        if (instruction.join(" ") in this.index) return

        const inst = instruction.join(" ")
        this.index[inst] = this.buffer.enqueue(new ReorderBuffer(inst))
    }

    from(data: Array<ReorderBuffer>) {
        this.init()
        this.buffer.data = data
        return this
    }

    update = (instruction: Array<string>, state?: State, value?: number) => {
        const rb = this.index[instruction.join(" ")]
        if (state) this.buffer.data[rb].state = state
        this.buffer.data[rb].value = value
    }

    map = (transform: (it: ReorderBuffer) => any) => this.buffer.map(rb => transform(rb))
}

export default new ReorderBuffers()