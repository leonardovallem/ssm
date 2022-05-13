import Memory from "./components/Memory"
import {Instruction} from "./instructions/InstructionTypes"
import RegisterBank from "./components/RegisterBank"

export default class MIPS {
    memory: Memory
    registerBank: RegisterBank
    program: Array<Instruction> = []
    PC: number = 0

    constructor() {
        this.memory = new Memory(32)
        this.registerBank = new RegisterBank()
    }

    loadProgram(program: Array<Instruction>) {
        this.program = program
    }

    executeNextInstruction() {
        if (this.program.length <= this.PC) return

        this.program[this.PC].execute(this.memory)
        this.PC++
    }
}
