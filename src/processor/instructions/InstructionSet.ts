import {
    BranchInstruction, Instruction,
    JumpInstruction,
    LogicArithmeticInstruction,
    MemoryAccessInstruction,
    MoveInstruction,
    MultDivInstruction
} from "./InstructionTypes"
import Register from "../components/Register"
import Memory from "../components/Memory"

export class RequireMemory {}
export class RequireRegister {}

abstract class LogicArithmeticInstructionImpl implements LogicArithmeticInstruction {
    abstract opcode: number
    destination: Register
    op1: Register
    op2: Register | number

    constructor(destination: Register, op1: Register, op2: Register | number) {
        this.destination = destination
        this.op1 = op1
        this.op2 = op2
    }

    abstract execute(): void
}

abstract class MultDivInstructionImpl implements MultDivInstruction {
    abstract opcode: number
    hi: Register
    lo: Register

    constructor(hi: Register, lo: Register) {
        this.hi = hi
        this.lo = lo
    }

    abstract execute(): void
}

abstract class MemoryAccessInstructionImpl extends RequireMemory implements MemoryAccessInstruction {
    abstract opcode: number
    data: Register
    offset: number
    address: Register

    constructor(data: Register, address: Register, offset: number) {
        super()
        this.data = data
        this.offset = offset
        this.address = address
    }

    abstract execute(mem: Memory | Register | null): void
}

abstract class MoveInstructionImpl extends RequireRegister implements MoveInstruction {
    abstract opcode: number
    destination: Register

    constructor(destination: Register) {
        super()
        this.destination = destination
    }

    abstract execute(origin: Memory | Register | null): void
}

abstract class JumpInstructionImpl implements JumpInstruction {
    abstract opcode: number
    target: number | Register | null

    constructor(target: number | Register | null) {
        this.target = target
    }

    abstract execute(): void
}

abstract class BranchInstructionImpl implements BranchInstruction {
    abstract opcode: number
    target: number | Register | null
    op1: Register
    op2: Register

    constructor(op1: Register, op2: Register, target: number | Register | null) {
        this.op1 = op1
        this.op2 = op2
        this.target = target
    }

    abstract execute(): void
}

export class ADD extends LogicArithmeticInstructionImpl {
    opcode: number = 0x00

    execute() {
        this.destination.value = this.op1.value + (this.op2 as Register).value
    }
}

export class ADDI extends LogicArithmeticInstructionImpl {
    opcode: number = 0x08

    execute() {
        this.destination.value = this.op1.value + (this.op2 as number)
    }
}

export class ADDU extends LogicArithmeticInstructionImpl {
    opcode: number = 0b000000

    execute() {
        this.destination.value = this.op1.value + (this.op2 as Register).value
    }
}

export class ADDIU extends LogicArithmeticInstructionImpl {
    opcode: number = 0x09

    execute() {
        this.destination.value = this.op1.value + (this.op2 as number)
    }
}

export class SUB extends LogicArithmeticInstructionImpl {
    opcode: number = 0x00

    execute() {
        this.destination.value = this.op1.value - (this.op2 as Register).value
    }
}

export class SUBU extends LogicArithmeticInstructionImpl {
    opcode: number = 0x00

    execute() {
        this.destination.value = this.op1.value - (this.op2 as Register).value
    }
}

export class MUL extends LogicArithmeticInstructionImpl {
    opcode: number = 0x00

    execute() {
        this.destination.value = this.op1.value * (this.op2 as Register).value
    }
}

export class AND extends LogicArithmeticInstructionImpl {
    opcode: number = 0x00

    execute() {
        this.destination.value = this.op1.value & (this.op2 as Register).value
    }
}

export class ANDI extends LogicArithmeticInstructionImpl {
    opcode: number = 0x0C

    execute() {
        this.destination.value = this.op1.value & (this.op2 as number)
    }
}

export class OR extends LogicArithmeticInstructionImpl {
    opcode: number = 0x00

    execute() {
        this.destination.value = this.op1.value | (this.op2 as Register).value
    }
}

export class ORI extends LogicArithmeticInstructionImpl {
    opcode: number = 0x0D

    execute() {
        this.destination.value = this.op1.value | (this.op2 as number)
    }
}

export class SLL extends LogicArithmeticInstructionImpl {
    opcode: number = 0x00

    execute() {
        this.destination.value = this.op1.value << (this.op2 as number)
    }
}

export class SRL extends LogicArithmeticInstructionImpl {
    opcode: number = 0x00

    execute() {
        this.destination.value = this.op1.value >> (this.op2 as number)
    }
}

export class SLT extends LogicArithmeticInstructionImpl {
    opcode: number = 0x00

    execute() {
        this.destination.value = Number(this.op1.value < (this.op2 as Register).value)
    }
}

export class SLTI extends LogicArithmeticInstructionImpl {
    opcode: number = 0x0A

    execute() {
        this.destination.value = Number(this.op1.value < (this.op2 as number))
    }
}

export class MULT extends MultDivInstructionImpl {
    opcode: number = 0x00

    execute() {
        // TODO
    }
}

export class DIV extends MultDivInstructionImpl {
    opcode: number = 0x00

    execute() {
        // TODO
    }
}

export class LW extends MemoryAccessInstructionImpl {
    opcode: number = 0x23

    execute(mem: Memory | null) {
        if (!mem) return
        this.data.value = mem.load(this.address.value + this.offset)
    }
}

export class SW extends MemoryAccessInstructionImpl {
    opcode: number = 0x2B

    execute(mem: Memory) {
        mem.store(this.address.value + this.offset, this.data.value)
    }
}

export class MFHI extends MoveInstructionImpl {
    opcode: number = 0  // TODO

    execute(hi: Register) {
        this.destination.value = hi.value
    }
}

export class MFLO extends MoveInstructionImpl {
    opcode: number = 0  // TODO

    execute(lo: Register) {
        this.destination.value = lo.value
    }
}

export class J extends JumpInstructionImpl {
    opcode: number = 0  // TODO

    execute() {
        // this.target
    }
}

export class JR extends JumpInstructionImpl {
    opcode: number = 0  // TODO

    execute() {
        // this.target
    }
}

export class JAL extends JumpInstructionImpl {
    opcode: number = 0  // TODO

    execute() {
        // this.target
    }
}

export class BEQ extends BranchInstructionImpl {
    opcode: number = 0  // TODO

    execute() {
        // this.target
    }
}

export class BNE extends BranchInstructionImpl {
    opcode: number = 0  // TODO

    execute() {
        // this.target
    }
}

export class BGT extends BranchInstructionImpl {
    opcode: number = 0  // TODO

    execute() {
        // this.target
    }
}

export class BGE extends BranchInstructionImpl {
    opcode: number = 0  // TODO

    execute() {
        // this.target
    }
}

export class BLT extends BranchInstructionImpl {
    opcode: number = 0  // TODO

    execute() {
        // this.target
    }
}

export class BLE extends BranchInstructionImpl {
    opcode: number = 0  // TODO

    execute() {
        // this.target
    }
}

interface InstructionSet {
    ADD: Function
    ADDI: Function
    ADDU: Function
    ADDIU: Function
    SUB: Function
    SUBU: Function
    MUL: Function
    AND: Function
    ANDI: Function
    OR: Function
    ORI: Function
    SLL: Function
    SRL: Function
    SLT: Function
    SLTI: Function
    MULT: Function
    DIV: Function
    LW: Function
    SW: Function
    MFHI: Function
    MFLO: Function
    J: Function
    JR: Function
    JAL: Function
    BEQ: Function
    BNE: Function
    BGT: Function
    BGE: Function
    BLT: Function
    BLE: Function
    isJump: (inst: Instruction) => boolean
    isBranch: (inst: Instruction) => boolean
    isLA: (inst: Instruction) => boolean
    isMultDiv: (inst: Instruction) => boolean
    isMove: (inst: Instruction) => boolean
    isLS: (inst: Instruction) => boolean
}

const instructionSet: InstructionSet = {
    ADD: ADD,       // add $r, $r, $r       4
    ADDI: ADDI,     // addi $r, $r, i       4
    ADDU: ADDU,     // addu $r, $r, $r      4
    ADDIU: ADDIU,   // addiu $r, $r, i      4
    SUB: SUB,       // sub $r, $r, $r       4
    SUBU: SUBU,     // subu $r, $r, $r      4
    MUL: MUL,       // mul $r, $r, $r       4
    AND: AND,       // and $r, $r, $r       4
    ANDI: ANDI,     // andi $r, $r, i       4
    OR: OR,         // or $r, $r, $r        4
    ORI: ORI,       // ori $r, $r, i        4
    SLL: SLL,       // sll $r, $r, $r       4
    SRL: SRL,       // srl $r, $r, $r       4
    SLT: SLT,       // slt $r, $r, $r       4
    SLTI: SLTI,     // slti $r, $r, i       4
    MULT: MULT,     // mult $r, $r           3
    DIV: DIV,       // div $r, $r            3
    LW: LW,         // lw $r, i($r)          3
    SW: SW,         // lw $r, i($r)          3
    MFHI: MFHI,     // mfhi $r                2
    MFLO: MFLO,     // mflo $r                2
    J: J,           // j i                    2
    JR: JR,         // jr $r                  2
    JAL: JAL,       // jal i                  2
    BEQ: BEQ,       // beq $r, $r, i        4
    BNE: BNE,       // bne $r, $r, i        4
    BGT: BGT,       // bgt $r, $r, i        4
    BGE: BGE,       // bge $r, $r, i        4
    BLT: BLT,       // blt $r, $r, i        4
    BLE: BLE,       // ble $r, $r, i        4

    isJump: (instruction: Instruction) => instruction instanceof JumpInstructionImpl,
    isBranch: (instruction: Instruction) => instruction instanceof BranchInstructionImpl,
    isLA: (instruction: Instruction) => instruction instanceof LogicArithmeticInstructionImpl,
    isMultDiv: (instruction: Instruction) => instruction instanceof MultDivInstructionImpl,
    isMove: (instruction: Instruction) => instruction instanceof MoveInstructionImpl,
    isLS: (instruction: Instruction) => instruction instanceof MemoryAccessInstructionImpl,
}

export default instructionSet