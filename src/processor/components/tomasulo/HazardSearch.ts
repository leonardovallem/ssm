import InstructionParser from "../../instructions/InstructionParser"
import {InstructionsThatUpdateFirstRegister} from "../../instructions/InstructionSet"

export default function searchHazards(program: Array<string>) {
    program.forEach((inst, index) => {
        const prevInst = InstructionParser.splitInstruction(inst)
        for (let i = index + 1; i < program.length; i++) {
            const currInst = InstructionParser.splitInstruction(program[i])
        }
    })
}

function hasRAW(inst1: Array<string>, inst2: Array<string>): boolean {
    if (!InstructionsThatUpdateFirstRegister.includes(inst1[0])) return false
    return [inst2[2], inst2[3]].includes(inst1[1])
}

function hasWAW(inst1: Array<string>, inst2: Array<string>): boolean {
    if (!InstructionsThatUpdateFirstRegister.includes(inst1[0])
        || !InstructionsThatUpdateFirstRegister.includes(inst2[0])
    ) return false
    return inst1[1] === inst2[1]
}

function hasWAR(inst1: Array<string>, inst2: Array<string>): boolean {
    if (!InstructionsThatUpdateFirstRegister.includes(inst2[0])) return false
    return [inst1[2], inst1[3]].includes(inst2[1])
}