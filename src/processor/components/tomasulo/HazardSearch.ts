import InstructionParser from "../../instructions/InstructionParser"
import {InstructionsThatUpdateFirstRegister} from "../../instructions/InstructionSet"
import {RegisterAliasTable} from "../RegisterBank"

export default function fixHazards(program: Array<string>): Array<string> {
    if (program.length === 0) return []

    const prevInst = InstructionParser.splitInstruction(program[0])
    const instructions: Array<string> = [prevInst.join(" ")]
    for (let i = 1; i < program.length; i++) {
        const currInst = InstructionParser.splitInstruction(program[i])
        const hazard = findWAWandWAR(currInst, prevInst)

        const instruction = RegisterAliasTable.parseHazard(currInst, hazard)
        instructions.push(instruction.join(" "))
    }

    return instructions
}

export const findWAWandWAR = (currInst: Array<string>, nextInstr: Array<string>) => {
    const regWAW = findWAW(currInst, nextInstr)
    const regWAR = findWAR(currInst, nextInstr)

    if (regWAW) return regWAW
    return regWAR
}

function findRAW(inst1: Array<string>, inst2: Array<string>) {
    if (!InstructionsThatUpdateFirstRegister.includes(inst1[0])) return false
    return [inst2[2], inst2[3]].includes(inst1[1])
        ? inst1[1]
        : null
}

function findWAW(inst1: Array<string>, inst2: Array<string>) {
    if (!InstructionsThatUpdateFirstRegister.includes(inst1[0])
        || !InstructionsThatUpdateFirstRegister.includes(inst2[0])
    ) return null
    return inst1[1] === inst2[1] ? inst2[1] : null
}

function findWAR(inst1: Array<string>, inst2: Array<string>) {
    if (!InstructionsThatUpdateFirstRegister.includes(inst2[0])) return null
    return [inst1[2], inst1[3]].includes(inst2[1])
        ? inst2[1]
        : null
}