import {
    BranchInstruction, Instruction,
    JumpInstruction,
    LogicArithmeticInstruction,
    MemoryAccessInstruction,
    MoveInstruction,
    MultDivInstruction
} from "./InstructionTypes"
import Register from "../components/Register"
import Memory from "../components/Memory";

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

abstract class MemoryAccessInstructionImpl implements MemoryAccessInstruction {
    abstract opcode: number
    address: Register
    data: Register
    offset: number

    constructor(address: Register, data: Register, offset: number) {
        this.address = address
        this.data = data
        this.offset = offset
    }

    abstract execute(mem: Memory | Register | null): void
}

abstract class MoveInstructionImpl implements MoveInstruction {
    abstract opcode: number
    destination: Register

    constructor(destination: Register) {
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

const instructionSet: { [key: string]: any } = {
    ADD: ADD,       // add $r, $r, $r
    ADDI: ADDI,     // addi $r, $r, i
    ADDU: ADDU,     // addu $r, $r, $r
    ADDIU: ADDIU,   // addiu $r, $r, i
    SUB: SUB,       // sub $r, $r, $r
    SUBU: SUBU,     // subu $r, $r, $r
    MUL: MUL,       // mul $r, $r, $r
    AND: AND,       // and $r, $r, $r
    ANDI: ANDI,     // andi $r, $r, i
    OR: OR,         // or $r, $r, $r
    ORI: ORI,       // ori $r, $r, i
    SLL: SLL,       // sll $r, $r, $r
    SRL: SRL,       // srl $r, $r, $r
    SLT: SLT,       // slt $r, $r, $r
    SLTI: SLTI,     // slti $r, $r, i
    MULT: MULT,     // mult $r, $r
    DIV: DIV,       // div $r, $r
    LW: LW,         // lw $r, i($r)
    SW: SW,         // lw $r, i($r)
    MFHI: MFHI,     // mfhi $r
    MFLO: MFLO,     // mflo $r
    J: J,           // j i
    JR: JR,         // jr $r
    JAL: JAL,       // jal i
    BEQ: BEQ,       // beq $r, $r, i
    BNE: BNE,       // bne $r, $r, i
    BGT: BGT,       // bgt $r, $r, i
    BGE: BGE,       // bge $r, $r, i
    BLT: BLT,       // blt $r, $r, i
    BLE: BLE,       // ble $r, $r, i

    isJump: (instruction: Instruction) => instruction instanceof JumpInstructionImpl,
    isBranch: (instruction: Instruction) => instruction instanceof BranchInstructionImpl,
    isLA: (instruction: Instruction) => instruction instanceof LogicArithmeticInstructionImpl,
    isMultDiv: (instruction: Instruction) => instruction instanceof MultDivInstructionImpl,
    isMove: (instruction: Instruction) => instruction instanceof MoveInstructionImpl,
}

export default instructionSet