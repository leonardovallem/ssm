import Register from "./Register"
import {InstructionsThatUpdateFirstRegister} from "../instructions/InstructionSet";
import {substringBetween} from "../../util/StringUtils"
import ReservationStations from "./tomasulo/ReservationStations"

export class RB {
    registers: Array<Register> = []
    private byName: { [name: string]: number } = {}

    constructor(values: Array<{ name: string, value: string }> | null = null) {
        if (values) {
            this.registers = values.map((obj) => Register.deserialize(obj))
            return
        }

        this.fillValues()
    }

    private fillValues() {
        this.registers = [
            new Register("$zero"),
            new Register("$at"),
            new Register("$v0"),
            new Register("$v1"),
        ]

        for (let i = 0; i < 4; i++) this.registers.push(new Register("$a" + i))
        for (let i = 0; i < 8; i++) this.registers.push(new Register("$t" + i))
        for (let i = 0; i < 8; i++) this.registers.push(new Register("$s" + i))
        for (let i = 8; i < 10; i++) this.registers.push(new Register("$t" + i))
        for (let i = 0; i < 2; i++) this.registers.push(new Register("$k" + i))

        this.registers.push(
            new Register("$gp"),
            new Register("$sp"),
            new Register("$fp"),
            new Register("$ra"),
            new Register("$hi"),
            new Register("$lo")
        )

        this.registers.forEach((reg, index) => {
            this.byName[reg.name] = index
        })
    }

    update(updated: Array<{ name: string, value: number }>) {
        this.registers = updated.map(obj => new Register(obj.name, obj.value))
    }

    updateRegister(register: Register) {
        for (const index in this.registers) {
            if (this.registers[index].name === register.name) {
                const copy = this.registers.slice()
                copy[index] = register
                this.registers = copy
                return
            }
        }
    }

    getByName(name: string) {
        if (!(name in this.byName)) {
            if (!(name in ReservationStations.registers)) throw Error("Unknown register " + name)
            return ReservationStations.registers[name]
        }
        return this.registers[this.byName[name]]
    }

    cleared() {
        this.fillValues()
        return this
    }

    serialize = () => this.registers.map(reg => ({name: reg.name, value: reg.value}))
}

const RegisterBank = new RB()

export default RegisterBank

export class RAT {
    table: { [register: string]: string } = {}
    mappings: { [register: string]: string } = {}
    private counter: number = 0

    constructor() {
        this.init()
    }

    init() {
        RegisterBank.registers.forEach(reg => {
            this.table[reg.name] = reg.name
        })
        this.mappings = {}
        this.counter = 0
    }

    getMapped = (register: string): string | null => {
        let reg: string | null = register

        while (!reg?.startsWith("$") && reg !== null) {
            reg = reg in this.mappings
                ? this.mappings[reg]
                : null
        }

        return reg
    }

    getRegister = (register: string) => {
        if (register.startsWith("$")) return this.table[register]
        return this.getMapped(register)
    }

    parseHazards(instruction: Array<string>, hazards: Array<string>, uuid: string = ""): Array<string> {
        const rs = ReservationStations.insert(instruction, hazards, uuid)

        if (rs.length > 0) {
            rs.forEach((r, i) => {
                const index = instruction.indexOf(hazards[i])
                if (index === -1) return

                instruction[index] = r
                this.mappings[r] = hazards[i]
                this.table[hazards[i]] = r

                if (ReservationStations.stations[r].qj === this.mappings[r]) {
                    ReservationStations.stations[r].qj = this.table[hazards[i]]
                } else if (ReservationStations.stations[r].qk === this.mappings[r]) {
                    ReservationStations.stations[r].qk = this.table[hazards[i]]
                }
            })
        }
        return instruction
    }

    private isSecondRegister = (instruction: Array<string>, hazards: Array<string>) => {
        return hazards.length === 1 && instruction.indexOf(hazards[0]) === instruction.length - 1
    }

    parse(currentInstruction: Array<string>, nextInstruction?: Array<string>): Array<string> {
        const currInst = [...currentInstruction]
        if (!InstructionsThatUpdateFirstRegister.includes(currInst[0])) return currInst

        if (currInst[0] === "LW") {
            const reg = substringBetween(currInst[2], "(", ")")
            currInst[2] = `(${this.table[reg]})`
        } else if (!["LI", "MFHI", "MFLO"].includes(currInst[0])) {
            currInst[2] = this.getRegister(currInst[2])!
            if (currInst[3].at(currInst[3].length - 1) !== "I") {
                currInst[3] = this.getRegister(currInst[3])!
            }
        }

        if (nextInstruction) {
            const reg = `P${++this.counter}`
            this.mappings[reg] = currInst[1]
            this.table[currInst[1]] = reg
            currInst[1] = this.getRegister(currInst[1])!
        }
        return currInst
    }
}

export const RegisterAliasTable = new RAT()
