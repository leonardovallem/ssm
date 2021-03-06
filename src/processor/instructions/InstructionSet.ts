interface Instruction {
    cycles: number
    op1: boolean
    op2: boolean
    op3: boolean
}

export const isAdd = (instruction: Array<string>) => [
    "ADD",
    "ADDI",
    "ADDU",
    "ADDIU",
    "SUB",
    "SUBU",
].includes(instruction[0])

export const isMult = (instruction: Array<string>) => [
    "MUL", "MULT", "DIV"
].includes(instruction[0])

export const isALU = (instruction: Array<string>) => [
    "ADD",
    "ADDI",
    "ADDU",
    "ADDIU",
    "SUB",
    "SUBU",
    "MUL",
    "MULT",
    "AND",
    "ANDI",
    "OR",
    "ORI",
    "SRL",
    "SLL",
    "SLT",
    "SLTI",
].includes(instruction[0])

export const isBranch = (instruction: Array<string>) => [
    "BEQ",
    "BNE",
    "BGT",
    "BGE",
    "BLT",
    "BLE",
    "J",
    "JR",
    "JAL",
].includes(instruction[0])

export const isLoad = (instruction: Array<string>) => instruction[0] === "LW"

export const isStore = (instruction: Array<string>) => instruction[0] === "SW"

export const enum InstructionType {
    BRANCH,
    ALU,
    STORE,
    LOAD,
    OTHER,
}

export const typeOfInstruction = (instruction: Array<string>) => {
    if (isALU(instruction)) return InstructionType.ALU
    if (isBranch(instruction)) return InstructionType.BRANCH
    if (isLoad(instruction)) return InstructionType.LOAD
    if (isStore(instruction)) return InstructionType.STORE
    return InstructionType.OTHER
}

export const InstructionsThatUpdateFirstRegister = [
    "ADD",
    "ADDI",
    "ADDU",
    "ADDIU",
    "SUB",
    "SUBU",
    "MUL",
    "AND",
    "ANDI",
    "OR",
    "ORI",
    "SRL",
    "SLL",
    "SLT",
    "SLTI",
    "LI",
    "LW",
    "MFHI",
    "MFLO"
]

export const ThreeOperandsInstructions: { [name: string]: Instruction } = {
    ADD: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    ADDI: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    ADDU: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    ADDIU: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    SUB: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    SUBU: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    MUL: {
        "cycles": 5,
        "op1": true,
        "op2": true,
        "op3": true
    },
    AND: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    ANDI: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    OR: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    ORI: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    SLL: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    SRL: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    SLT: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    SLTI: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    BEQ: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    BNE: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    BGT: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    BGE: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    BLT: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    },
    BLE: {
        "cycles": 2,
        "op1": true,
        "op2": true,
        "op3": true
    }
}

export const TwoOperandsInstructions: { [name: string]: Instruction } = {
    MULT: {
        "cycles": 5,
        "op1": true,
        "op2": true,
        "op3": false
    },
    DIV: {
        "cycles": 5,
        "op1": true,
        "op2": true,
        "op3": false
    },
    LI: {
        "cycles": 7,
        "op1": true,
        "op2": true,
        "op3": false
    },
    LW: {
        "cycles": 7,
        "op1": true,
        "op2": true,
        "op3": false
    },
    SW: {
        "cycles": 8,
        "op1": true,
        "op2": true,
        "op3": false
    }
}

export const OneOperandInstructions: { [name: string]: Instruction } = {
    MFHI: {
        "cycles": 2,
        "op1": true,
        "op2": false,
        "op3": false
    },
    MFLO: {
        "cycles": 2,
        "op1": true,
        "op2": false,
        "op3": false
    },
    J: {
        "cycles": 1,
        "op1": true,
        "op2": false,
        "op3": false
    },
    JR: {
        "cycles": 1,
        "op1": true,
        "op2": false,
        "op3": false
    },
    JAL: {
        "cycles": 1,
        "op1": true,
        "op2": false,
        "op3": false
    }
}

const instructions: { [name: string]: Instruction } = {
    ...ThreeOperandsInstructions,
    ...TwoOperandsInstructions,
    ...OneOperandInstructions
}

export default instructions