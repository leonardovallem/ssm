
class Item {
    name: string
    busy: boolean   // station is busy
    // op: Instruction // operation that's gonna be executed
    vi: number      // value of the source operands
    vj: number      // value of the source operands
    qj: Item        // reservation stations that are
    qk: Item        // gonna produce the result
    a: number       // immediate value or calculated address

    constructor(name: string, busy: boolean, vi: number, vj: number, qj: Item, qk: Item, a: number) {
        this.name = name;
        this.busy = busy;
        // this.op = op;
        this.vi = vi;
        this.vj = vj;
        this.qj = qj;
        this.qk = qk;
        this.a = a;
    }
}

export default class ReservationStations {
    stations: Array<Item> = []
}