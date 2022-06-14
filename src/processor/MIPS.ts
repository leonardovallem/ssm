import VolatileMemory from "./components/VolatileMemory"
import RegisterBank from "./components/RegisterBank"
import InstructionParser from "./instructions/InstructionParser"
import MipsMemory from "./components/MipsMemory"
import PersistentMemory from "./components/PersistentMemory"
import InstructionSet from "./instructions/InstructionSet"
import {getHighAndLow} from "../util/NumberUtils"
import {normalizeNumber} from "../util/StringUtils"
import {getHazardFixedInstruction, getInstructionOrLabel} from "./components/tomasulo/HazardSearch"
import ReservationStations from "./components/tomasulo/ReservationStations"
import ReorderBuffers, {State} from "./components/tomasulo/ReorderBuffers"

class RuntimeEngine {
    private instructions: Array<string> | null = null
    private labels: { [label: string]: number } | null = null
    private all?: Array<Array<string> | { [label: string]: number }>
    pc: number = 0
    cycles: number = 0
    parsedInstructions: Array<Array<string>> = []

    setInstructions(instructions: Array<string>, all?: Array<Array<string> | { [label: string]: number }>) {
        this.instructions = instructions
        this.all = all
        return this
    }

    setLabels(labels: { [label: string]: number }) {
        this.labels = labels
        return this
    }

    getSize = () => (this.parsedInstructions?.length ?? 0) + Object.keys(this.labels ?? {}).length

    running = () => this.pc < this.getSize()

    /**
     * Executes next instruction
     * return false if there are no more instructions
     */
    executeNextInstruction(): boolean {
        const currentInstruction = this.all![this.pc]
        console.log(this.pc, currentInstruction)
        const inst = getInstructionOrLabel(currentInstruction)

        if (inst.length === 1) {
            this.parsedInstructions = [...this.parsedInstructions, inst]
        } else {
            // @ts-ignore
            if (window.debug) console.log("Current Instruction:", currentInstruction)
            // @ts-ignore
            if (!currentInstruction || !(currentInstruction[0] in InstructionSet)) throw Error("Unknown instruction")

            // @ts-ignore
            this.parsedInstructions = this.runInstruction(currentInstruction)
        }

        return this.pc++ < this.instructions!.length
    }

    runInstruction(currentInstruction: Array<string>) {
        const instructionSpecs = InstructionSet[currentInstruction[0]]

        if (instructionSpecs.op3) {
            if (currentInstruction.length !== 4) RuntimeEngine.throwWrongNumberOps(currentInstruction[0])
        } else if (instructionSpecs.op2) {
            if (currentInstruction.length !== 3) RuntimeEngine.throwWrongNumberOps(currentInstruction[0])
        } else if (instructionSpecs.op1) {
            if (currentInstruction.length !== 2) RuntimeEngine.throwWrongNumberOps(currentInstruction[0])
        }

        this.issueInstructions(currentInstruction)
        return this.parsedInstructions
    }

    private static throwWrongNumberOps(instruction: string) {
        throw Error(`Instruction ${instruction} has wrong number of operands`)
    }

    private issueInstructions(instruction: Array<string>) {
        this.parsedInstructions = getHazardFixedInstruction(this.parsedInstructions, instruction)
        this.parsedInstructions.forEach(inst => ReorderBuffers.writeValue(inst))
    }

    executeInstructions(callback: () => void = () => {
    }) {
        this.parsedInstructions.forEach(inst => {
            ReorderBuffers.update(inst, State.EXECUTE)
            const rs = ReservationStations.memo[inst.join(" ")]
            if (rs) {
                const register = ReservationStations.registers[rs]
                if (register) {
                    register.rs = rs
                }
            }
            callback()
        })
    }

    writeResult(callback: () => void = () => {
    }) {
        for (let i = 0; i < this.all!.length; i++) {
            this.pc = Number(i)
            const inst = getInstructionOrLabel(this.all![i])
            console.log(inst)

            if (inst.length === 1 && inst[0].endsWith(":")) {
                return
            }

            ReorderBuffers.update(inst, State.WRITE_RESULT)
            this.executeInstruction(inst)
            const rs = ReservationStations.memo[inst.join(" ")]
            if (rs) {
                if (ReservationStations.stations[rs].vi !== undefined && ReservationStations.stations[rs].vj !== undefined) {
                    ReservationStations.stations[rs].clear()
                } else {
                    const register = ReservationStations.registers[rs]
                    if (register) ReservationStations.stations[rs].clear()
                }
            }

            i = this.pc
            callback()
        }

        Object.keys(ReservationStations.stations).forEach(rs => {
            if (ReservationStations.stations[rs].vi !== undefined && ReservationStations.stations[rs].vj !== undefined) {
                ReservationStations.stations[rs].clear()
            }
        })
    }

    commit(callback: () => void = () => {
    }) {
        this.parsedInstructions.forEach(inst => {
            ReorderBuffers.update(inst, State.COMMIT)
            const rs = ReservationStations.memo[inst.join(" ")]
            if (rs) {
                const register = ReservationStations.registers[rs]
                if (register) {
                    ReorderBuffers.update(inst, undefined, register.value)
                }
            }
            callback()
        })
    }

    private executeInstruction(instruction: Array<string>, operands?: Operands) {
        if (!operands) operands = numberOfOperands(instruction)

        if (operands === Operands.THREE) {
            const reg1 = RegisterBank.getByName(instruction[1])
            const reg2 = RegisterBank.getByName(instruction[2])

            switch (instruction[0]) {
                case "ADD":
                case "ADDU": {
                    const reg3 = RegisterBank.getByName(instruction[3])
                    reg1.value = reg2.value + reg3.value
                    break
                }
                case "ADDI":
                case "ADDIU": {
                    const immediate = Number(instruction[3])
                    reg1.value = reg2.value + immediate
                    break
                }
                case "SUB":
                case "SUBU": {
                    const reg3 = RegisterBank.getByName(instruction[3])
                    reg1.value = reg2.value - reg3.value
                    break
                }
                case "MUL": {
                    const reg3 = RegisterBank.getByName(instruction[3])
                    reg1.value = reg2.value * reg3.value
                    break
                }
                case "AND": {
                    const reg3 = RegisterBank.getByName(instruction[3])
                    reg1.value = reg2.value & reg3.value
                    break
                }
                case "ANDI": {
                    const immediate = Number(instruction[3])
                    reg1.value = reg2.value & immediate
                    break
                }
                case "OR": {
                    const reg3 = RegisterBank.getByName(instruction[3])
                    reg1.value = reg2.value | reg3.value
                    break
                }
                case "ORI": {
                    const immediate = Number(instruction[3])
                    reg1.value = reg2.value | immediate
                    break
                }
                case "SLL": {
                    const immediate = Number(instruction[3])
                    reg1.value = reg2.value << immediate
                    break
                }
                case "SRL": {
                    const immediate = Number(instruction[3])
                    reg1.value = reg2.value >> immediate
                    break
                }
                case "SLT": {
                    const reg3 = RegisterBank.getByName(instruction[3])
                    reg1.value = Number(reg2.value < reg3.value)
                    break
                }
                case "SLTI": {
                    const immediate = Number(instruction[3])
                    reg1.value = Number(reg2.value < immediate)
                    break
                }
                case "BEQ": {
                    const target = this.labels![instruction[3]]
                    if (reg1.value === reg2.value) this.pc = target - 1
                    break
                }
                case "BNE": {
                    const target = this.labels![instruction[3]]
                    console.log(this.pc)
                    if (reg1.value !== reg2.value) this.pc = target
                    console.log(this.pc)
                    break
                }
                case "BGT": {
                    const target = this.labels![instruction[3]]
                    if (reg1.value > reg2.value) this.pc = target - 1
                    break
                }
                case "BGE": {
                    const target = this.labels![instruction[3]]
                    if (reg1.value >= reg2.value) this.pc = target - 1
                    break
                }
                case "BLT": {
                    const target = this.labels![instruction[3]]
                    if (reg1.value < reg2.value) this.pc = target - 1
                    break
                }
                case "BLE": {
                    const target = this.labels![instruction[3]]
                    if (reg1.value <= reg2.value) this.pc = target - 1
                    break
                }
                default:
                    throw Error("Unknown instruction " + instruction[0])
            }

            RegisterBank.updateRegister(reg1)
            return
        }

        if (operands === Operands.TWO) {
            const reg1 = RegisterBank.getByName(instruction[1])

            switch (instruction[0]) {
                case "MULT": {
                    const reg2 = RegisterBank.getByName(instruction[2])
                    const product = (BigInt(reg1.value) * BigInt(reg2.value)).toString(16)

                    const hi = normalizeNumber(product).substring(0, product.length / 2)
                    const lo = normalizeNumber(product).substring(product.length / 2 + 1)

                    const hiReg = RegisterBank.getByName("$hi")
                    hiReg.value = Number("0x" + hi)
                    const loReg = RegisterBank.getByName("$lo")
                    loReg.value = Number("0x" + lo)

                    RegisterBank.updateRegister(hiReg)
                    RegisterBank.updateRegister(loReg)
                    break
                }
                case "DIV": {
                    const reg2 = RegisterBank.getByName(instruction[2])

                    const [hi, lo] = getHighAndLow(Math.round(reg1.value / reg2.value))

                    const hiReg = RegisterBank.getByName("$hi")
                    hiReg.value = hi
                    const loReg = RegisterBank.getByName("$lo")
                    loReg.value = lo

                    RegisterBank.updateRegister(hiReg)
                    RegisterBank.updateRegister(loReg)
                    break
                }
                case "LI": {
                    reg1.value = Number(instruction[3])
                    break
                }
                default:
                    throw Error("Unknown instruction " + instruction[0])
            }

            RegisterBank.updateRegister(reg1)
            return
        }

        if (operands === Operands.ONE) {
            switch (instruction[0]) {
                case "MFHI": {
                    const hi = RegisterBank.getByName("$hi")
                    const destination = RegisterBank.getByName(instruction[1])
                    destination.value = hi.value
                    RegisterBank.updateRegister(destination)
                    break
                }
                case "MFLO": {
                    const lo = RegisterBank.getByName("$lo")
                    const destination = RegisterBank.getByName(instruction[1])
                    destination.value = lo.value
                    RegisterBank.updateRegister(destination)
                    break
                }
                case "J": {
                    const target = this.labels![instruction[1]]
                    this.pc = target - 1
                    break
                }
                case "JR": {
                    const destination = RegisterBank.getByName(instruction[1])
                    this.pc = (destination.value / 4) - 1   // addresses have a 4 step, array indexes are sequential
                    RegisterBank.updateRegister(destination)
                    break
                }
                case "JAL": {
                    const ra = RegisterBank.getByName("$ra")
                    ra.value = this.pc = (this.pc * 4) + 1   // addresses have a 4 step, array indexes are sequential

                    RegisterBank.updateRegister(ra)
                    const target = this.labels![instruction[1]]
                    this.pc = target - 1
                    break
                }
                default:
                    throw Error("Unknown instruction " + instruction[0])
            }

            return
        }
    }
}

export class MIPS {
    memory: MipsMemory
    engine: RuntimeEngine

    runCycle() {

    }

    afterInstruction: () => void = () => {
    }

    beforeExecution: () => void = () => {
    }
    afterExecution: () => void = () => {
    }

    // TODO remove lines below
    static MEMORY_SIZE = Math.pow(2, 8)    //  reduced to 2^8 for performance reasons
    private static TEXT_SEGMENT_ADDRESS = 0x00400000
    private static DATA_SEGMENT_ADDRESS = 0x10000000

    constructor(db = false) {
        this.memory = db ? new PersistentMemory() : new VolatileMemory(MIPS.MEMORY_SIZE)
        this.engine = new RuntimeEngine()
    }

    init(db = false) {
        this.memory = db ? new PersistentMemory() : new VolatileMemory(MIPS.MEMORY_SIZE)
        this.engine = new RuntimeEngine()
    }

    executeTomasulo() {
        // let addPC = 1
        // if (this.parsedInstructions[this.engine.pc + 1][0].endsWith(":")) addPC++
        return this.executeNextInstruction()
    }

    loadProgram(text: string) {
        const [labels, instructions, all] = new InstructionParser()
            .fromText(text)
            .parse()

        // @ts-ignore
        if (window.debug) {
            console.log("Labels:", labels)
            console.log("Instructions:", instructions)
            // console.log("Parsed instructions:", parsedInstructions)
        }

        this.engine.setLabels(labels)
        this.engine.setInstructions(instructions, all)
    }

    setPC(pc: number) {
        this.engine.pc = pc
    }

    setCycles(cycles: number) {
        this.engine.cycles = cycles
    }

    executeNextInstruction(): boolean {
        if (this.engine.pc === 0) this.beforeExecution()
        const hasMoreInstructions = this.engine.executeNextInstruction()
        this.afterInstruction()

        if (hasMoreInstructions) return true

        this.afterExecution()
        return false
    }

    issueInstructions() {
        while (this.executeNextInstruction()) {
        }
    }
}

export default new MIPS()

export enum Operands {
    NONE, ONE, TWO, THREE
}

export function numberOfOperands(instruction: Array<string>) {
    switch (instruction.length) {
        case 4:
            return Operands.THREE
        case 3:
            return Operands.TWO
        case 2:
            return Operands.ONE
    }

    throw Error(`Instruction ${instruction.join(" ")} is invalid`)
}