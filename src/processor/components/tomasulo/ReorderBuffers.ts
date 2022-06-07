import Queue from "../../../util/Queue"
import Register from "../Register"
import ReservationStations from "./ReservationStations"

enum State {
    COMMIT = "Commit",
    WRITE_RESULT = "Write Result",
    EXECUTE = "Execute"
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

export default class ReorderBuffers {
    private lastRegister: number = 0
    private reservationStation: ReservationStations | null = null
    buffer: Queue<ReorderBuffer> = new Queue<ReorderBuffer>()

    writeValue = (register: Register) => {
        // return this.buffer.add()
    }

    map = (transform: (it: ReorderBuffer) => any) => this.buffer.map(rs => transform(rs))
}