import {Observer} from "../../../util/Observer"
import {isAdd, isLoad, isMult, isStore} from "../../instructions/InstructionSet"
import RegisterBank from "../RegisterBank"
import FunctionalUnit from "./FunctionalUnit"
import {normalizeNumber} from "../../../util/StringUtils";
import {getHighAndLow} from "../../../util/NumberUtils";
import {numberOfOperands, Operands} from "../../MIPS";

export class ReservationStation {
    name: string
    busy: boolean           // station is busy
    instruction?: string    // operation that's gonna be executed
    vi?: number             // - value of the source operands
    vj?: number             // -
    qj?: string             // . reservation stations that are gonna produce the result
    qk?: string             // .
    a?: number              // immediate value or calculated address

    constructor(name: string, busy: boolean = false, instruction?: string, vi?: number, vj?: number, qj?: string, qk?: string, a?: number) {
        this.name = name
        this.busy = busy
        this.instruction = instruction
        this.vi = vi
        this.vj = vj
        this.qj = qj
        this.qk = qk
        this.a = a
    }

    clear() {
        this.busy = false
        this.instruction = undefined
        this.vi = undefined
        this.vj = undefined
        this.qj = undefined
        this.qk = undefined
        this.a = undefined
    }

    receiveData(instruction: string, data: number) {
        if (!this.vi) this.vi = data
        else if (!this.vj) this.vj = data
        else throw Error("No value in the Reservation Station is null")

        this.busy = true
    }
}

export class ReservationStations implements Observer<FunctionalUnit, number> {
    stations: { [name: string]: ReservationStation } = {}
    addStations: { [name: string]: ReservationStation } = {}
    multStations: { [name: string]: ReservationStation } = {}
    loadStations: { [name: string]: ReservationStation } = {}
    storeStations: { [name: string]: ReservationStation } = {}
    generalStations: { [name: string]: ReservationStation } = {}

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

    private getFreeSlotFromInstruction(instruction: Array<string>) {
        if (isAdd(instruction)) return this.getFreeSlot(FunctionalUnit.ADD)
        if (isMult(instruction)) return this.getFreeSlot(FunctionalUnit.MULT)
        if (isLoad(instruction)) return this.getFreeSlot(FunctionalUnit.LOAD)
        if (isStore(instruction)) return this.getFreeSlot(FunctionalUnit.STORE)
        return this.getFreeSlot(FunctionalUnit.NULL)
    }

    getFreeSlot(fu: FunctionalUnit) {
        let rss: Array<ReservationStation> = []

        switch (fu) {
            case FunctionalUnit.ADD:
                rss = Object.values(this.addStations)
                break
            case FunctionalUnit.MULT:
                rss = Object.values(this.addStations)
                break
            case FunctionalUnit.LOAD:
                rss = Object.values(this.addStations)
                break
            case FunctionalUnit.STORE:
                rss = Object.values(this.addStations)
                break
        }

        for (let rs of rss) if (!rs.busy) return rs
        return null
    }

    insert(instruction: Array<string>, hazard: string) {
        const rs = this.getFreeSlotFromInstruction(instruction)
        if (!rs) return ""

        const knownRegister = RegisterBank.getByName(hazard)

        rs.busy = true
        rs.vi = knownRegister.value
        rs.instruction = instruction[0]
        rs.qj = rs.name
        RegisterBank.getByName(hazard).rs = rs.name
        return rs.name

        // const operands = numberOfOperands(instruction)
        //
        // if (operands === Operands.THREE) {
        //
        //     switch (instruction[0]) {
        //         case "ADDI":
        //         case "ADDIU":
        //         case "ANDI":
        //         case "ORI":
        //         case "SLL":
        //         case "SRL":
        //         case "SLTI": {
        //             if (isAdd(instruction)) {
        //             }
        //             break
        //         }
        //         case "ADD":
        //         case "ADDU":
        //         case "SUB":
        //         case "SUBU":
        //         case "MUL":
        //         case "AND":
        //         case "OR":
        //         case "SLT": {
        //             break
        //         }
        //         case "BEQ": {
        //             break
        //         }
        //         case "BNE": {
        //             break
        //         }
        //         case "BGT": {
        //             break
        //         }
        //         case "BGE": {
        //             break
        //         }
        //         case "BLT": {
        //             break
        //         }
        //         case "BLE": {
        //             break
        //         }
        //         default:
        //             throw Error("Unknown instruction " + instruction[0])
        //     }
        //
        //     return
        // }
        //
        // if (operands === Operands.TWO) {
        //     const reg1 = RegisterBank.getByName(instruction[1])
        //
        //     switch (instruction[0]) {
        //         case "MULT": {
        //             break
        //         }
        //         case "DIV": {
        //             break
        //         }
        //         case "LI": {
        //             break
        //         }
        //         default:
        //             throw Error("Unknown instruction " + instruction[0])
        //     }
        //
        //     return
        // }
        //
        // if (operands === Operands.ONE) {
        //     switch (instruction[0]) {
        //         case "MFHI": {
        //             break
        //         }
        //         case "MFLO": {
        //             break
        //         }
        //         case "J": {
        //             break
        //         }
        //         case "JR": {
        //             break
        //         }
        //         case "JAL": {
        //             break
        //         }
        //         default:
        //             throw Error("Unknown instruction " + instruction[0])
        //     }
        //
        //     return
        // }
    }

    insertInstruction(instruction: Array<string>): boolean {
        if (isAdd(instruction)) {
            const rs = this.getFreeSlot(FunctionalUnit.ADD)
            if (!rs) return false

            const [, , _reg1, _reg2] = instruction
            const reg1 = RegisterBank.getByName(_reg1)
            const reg2 = RegisterBank.getByName(_reg2)
            if (!reg1.rs) {
                reg1.rs = rs.name
            } else if (!reg2.rs) {
                reg2.rs = rs.name
            }
        } else if (isMult(instruction)) {
            const rs = this.getFreeSlot(FunctionalUnit.MULT)
            if (!rs) return false

        } else if (isLoad(instruction)) {
            const rs = this.getFreeSlot(FunctionalUnit.LOAD)
            if (!rs) return false

        } else if (isStore(instruction)) {
            const rs = this.getFreeSlot(FunctionalUnit.STORE)
            if (!rs) return false

        }

        return true
    }

    from = (rss: { [name: string]: ReservationStation }) => {
        this.stations = rss
        return this
    }

    map = (transform: (it: ReservationStation) => any) => {
        return Object.values(this.stations).map(rs => transform(rs))
    }
}

export default new ReservationStations()