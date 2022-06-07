interface Instruction {
    cycles: number
    op1: boolean
    op2: boolean
    op3: boolean
}

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