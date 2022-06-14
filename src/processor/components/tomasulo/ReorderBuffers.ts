import Queue from "../../../util/Queue"
import Register from "../Register"

enum State {
    COMMIT = "Commit",
    EXECUTE = "Execute",
    WRITE_RESULT = "Write Result",
}

export class ReorderBuffer {
    entry: number
    busy: boolean
    state: State
    destination: Register
    value: number

    constructor(entry: number, busy: boolean, state: State, destination: Register, value: number) {
        this.entry = entry;
        this.busy = busy;
        this.state = state;
        this.destination = destination;
        this.value = value;
    }
}

export class ReorderBuffers {
    private lastRegister: number = 0
    buffer: Queue<ReorderBuffer> = new Queue<ReorderBuffer>()

    writeValue = (register: Register) => {
        // return this.buffer.add()
    }

    map = (transform: (it: ReorderBuffer) => any) => this.buffer.map(rb => transform(rb))
}

export default new ReorderBuffers()