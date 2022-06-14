import {Observer} from "../../../util/Observer"
import {isAdd, isLoad, isMult, isStore} from "../../instructions/InstructionSet"
import RegisterBank from "../RegisterBank"
import FunctionalUnit from "./FunctionalUnit"
import {getFirstReadRegister, getSecondReadRegister} from "../../instructions/InstructionParser"
import Register from "../Register";

export class ReservationStation {
    name: string
    busy: boolean           // station is busy
    instruction?: string    // operation that's gonna be executed
    vi?: number             // - value of the source operands
    vj?: number             // -
    qj?: string             // . reservation stations that are gonna produce the result
    qk?: string             // .
    // a?: number              // immediate value or calculated address

    constructor(name: string, busy: boolean = false, instruction?: string, vi?: number, vj?: number, qj?: string, qk?: string) {
        this.name = name
        this.busy = busy
        this.instruction = instruction
        this.vi = vi
        this.vj = vj
        this.qj = qj
        this.qk = qk
    }

    clear() {
        this.busy = false
        this.instruction = undefined
        this.vi = undefined
        this.vj = undefined
        this.qj = undefined
        this.qk = undefined
    }

    receiveData(instruction: string, data: number) {
        if (!this.vi) this.vi = data
        else if (!this.vj) this.vj = data
        else throw Error("No value in the Reservation Station is null")

        this.busy = true
    }

    insert(rs: {
        instruction?: string,
        vi?: number,
        vj?: number,
        qj?: string,
        qk?: string
    }) {
        this.busy = true
        this.instruction = rs.instruction
        this.vi = rs.vi
        this.vj = rs.vj
        this.qj = rs.qj
        this.qk = rs.qk
    }
}

export class ReservationStations implements Observer<FunctionalUnit, number> {
    stations: { [name: string]: ReservationStation } = {}
    addStations: { [name: string]: ReservationStation } = {}
    multStations: { [name: string]: ReservationStation } = {}
    loadStations: { [name: string]: ReservationStation } = {}
    storeStations: { [name: string]: ReservationStation } = {}
    generalStations: { [name: string]: ReservationStation } = {}

    queried: { [name: string]: ReservationStation } = {}
    memo: { [name: string]: string } = {}
    registers: { [name: string]: Register } = {}

    constructor(amount: number = 15) {
        this.init(amount)
    }

    init(amount: number = 15) {
        for (let i = 1; i <= amount; i++) {
            this.addStations[`Add${i}`] = new ReservationStation(`Add${i}`)
            this.multStations[`Mult${i}`] = new ReservationStation(`Mult${i}`)
            this.loadStations[`Load${i}`] = new ReservationStation(`Load${i}`)
            this.storeStations[`Store${i}`] = new ReservationStation(`Store${i}`)
            this.generalStations[`General${i}`] = new ReservationStation(`General${i}`)
        }

        this.stations = {
            ...this.addStations,
            ...this.multStations,
            ...this.loadStations,
            ...this.storeStations,
            ...this.generalStations,
        }

        return this
    }

    update(source: FunctionalUnit, data: number) {
        switch (source) {
            case FunctionalUnit.ADD:
                this.addStations[0].receiveData("TODO", data)
                break
            case FunctionalUnit.MULT:
                this.multStations[0].receiveData("TODO", data)
                break
            case FunctionalUnit.LOAD:
                this.loadStations[0].receiveData("TODO", data)
                break
            case FunctionalUnit.STORE:
                this.storeStations[0].receiveData("TODO", data)
                break
            default:
                this.generalStations[0].receiveData("TODO", data)
        }
    }

    private getFreeSlotFromInstruction(instruction: Array<string>): string {
        if (isAdd(instruction)) return this.getFreeSlot(FunctionalUnit.ADD)
        if (isMult(instruction)) return this.getFreeSlot(FunctionalUnit.MULT)
        if (isLoad(instruction)) return this.getFreeSlot(FunctionalUnit.LOAD)
        if (isStore(instruction)) return this.getFreeSlot(FunctionalUnit.STORE)
        return this.getFreeSlot(FunctionalUnit.NULL)
    }

    getFreeSlot(fu: FunctionalUnit) {
        let rss: Array<string> = []

        switch (fu) {
            case FunctionalUnit.ADD:
                rss = Object.keys(this.addStations)
                break
            case FunctionalUnit.MULT:
                rss = Object.keys(this.addStations)
                break
            case FunctionalUnit.LOAD:
                rss = Object.keys(this.addStations)
                break
            case FunctionalUnit.STORE:
                rss = Object.keys(this.addStations)
                break
        }

        for (const rs of rss) if (!this.stations[rs].busy) return rs
        return ""
    }

    insert(instruction: Array<string>, hazards: Array<string> = [], uuid: string = ""): Array<string> {
        const rs = (!uuid || !(uuid in this.queried)) ? this.getFreeSlotFromInstruction(instruction) : this.queried[uuid].name
        if (!rs) return []

        if (hazards.length === 0) {
            const reg1 = getFirstReadRegister(instruction)
            const reg2 = getSecondReadRegister(instruction)

            const is1Physical = reg1.startsWith("$")
            const is2Physical = reg2 && reg2.startsWith("$")
            const immediate = instruction[instruction.length - 1].startsWith("$")
                ? undefined : Number(instruction[instruction.length - 1])

            this.stations[rs].insert({
                instruction: instruction[0],
                vi: is1Physical ? RegisterBank.getByName(reg1).value : undefined,
                qk: is1Physical ? reg1 : undefined,
                vj: is2Physical ? RegisterBank.getByName(reg2).value : immediate,
                qj: is2Physical ? reg2 : undefined,
            })
        } else {
            const is1Physical = hazards[0].startsWith("$")
            const is2Physical = hazards.length > 1 && hazards[1].startsWith("$")
            const immediate = instruction[instruction.length - 1].startsWith("$")
                ? undefined : Number(instruction[instruction.length - 1])

            this.registers[rs] = RegisterBank.getByName(hazards[0])

            this.stations[rs].insert({
                instruction: instruction[0],
                vi: is1Physical ? RegisterBank.getByName(hazards[0]).value : undefined,
                qk: is1Physical ? hazards[0] : undefined,
                vj: is2Physical ? RegisterBank.getByName(hazards[1]).value : immediate,
                qj: is2Physical ? hazards[1] : undefined,
            })

            // reg.rs = rs // TODO this has to be in the execution phase
        }

        this.queried[uuid] = this.stations[rs]
        this.memo[instruction.join(" ")] = rs
        return [rs]
    }

    // insertInstruction(instruction: Array<string>): boolean {
    //     if (isAdd(instruction)) {
    //         const rs = this.getFreeSlot(FunctionalUnit.ADD)
    //         if (!rs) return false
    //
    //         const [, , _reg1, _reg2] = instruction
    //         const reg1 = RegisterBank.getByName(_reg1)
    //         const reg2 = RegisterBank.getByName(_reg2)
    //         if (!reg1.rs) {
    //             reg1.rs = rs.name
    //         } else if (!reg2.rs) {
    //             reg2.rs = rs.name
    //         }
    //     } else if (isMult(instruction)) {
    //         const rs = this.getFreeSlot(FunctionalUnit.MULT)
    //         if (!rs) return false
    //
    //     } else if (isLoad(instruction)) {
    //         const rs = this.getFreeSlot(FunctionalUnit.LOAD)
    //         if (!rs) return false
    //
    //     } else if (isStore(instruction)) {
    //         const rs = this.getFreeSlot(FunctionalUnit.STORE)
    //         if (!rs) return false
    //
    //     }
    //
    //     return true
    // }

    from = (rss: { [name: string]: ReservationStation }) => {
        this.stations = rss
        return this
    }

    map = (transform: (it: ReservationStation) => any) => {
        return Object.values(this.stations).map(rs => transform(rs))
    }
}

export default new ReservationStations()