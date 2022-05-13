import Register from "../components/Register"
import Memory from "../components/Memory"

export interface Instruction {
    opcode: number
    execute: (arg: Memory | null | Register) => void
}

export interface LogicArithmeticInstruction extends Instruction {
    destination: Register
    op1: Register
    op2: Register | number
}

export interface MultDivInstruction extends Instruction {
    hi: Register
    lo: Register
}

export interface MemoryAccessInstruction extends Instruction {
    data: Register
    offset: number
    address: Register
}

export interface MoveInstruction extends Instruction {
    destination: Register
}

export interface JumpInstruction extends Instruction {
    target: number | Register | null
}

export interface BranchInstruction extends JumpInstruction {
    op1: Register
    op2: Register
}