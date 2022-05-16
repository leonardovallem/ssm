import Memory from "./components/Memory"
import {Instruction} from "./instructions/InstructionTypes"
import RegisterBank from "./components/RegisterBank"
import InstructionParser from "./instructions/InstructionParser"
import {MFHI, MFLO, RequireMemory} from "./instructions/InstructionSet"

export default class MIPS {
    memory: Memory
    registerBank: RegisterBank
    program: Array<Instruction> = []
    PC: number = 0

    afterInstruction: () => void = () => {}
    afterExecution: () => void = () => {}

    constructor() {
        this.memory = new Memory(32)
        this.registerBank = new RegisterBank()
    }

    loadProgram(program: string) {
        this.program = new InstructionParser(program, this.registerBank).parse()
    }

    executeNextInstruction() {
        if (this.program.length <= this.PC) return

        const instruction = this.program[this.PC]
        if (instruction instanceof RequireMemory) instruction.execute(this.memory)
        else if (instruction instanceof MFHI) instruction.execute(this.registerBank.getByName("$hi"))
        else if (instruction instanceof MFLO) instruction.execute(this.registerBank.getByName("$lo"))
        else instruction.execute(null)

        this.PC++
        this.afterInstruction()
    }

    executeProgram() {
        this.program.forEach(() => this.executeNextInstruction())
        this.afterExecution()
    }
}
