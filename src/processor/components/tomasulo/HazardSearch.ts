import {InstructionsThatUpdateFirstRegister} from "../../instructions/InstructionSet"
import {RegisterAliasTable} from "../RegisterBank"
import ReservationStations from "./ReservationStations"
import {randomUUID} from "../../../util/StringUtils";

export default function fixHazards(program: Array<Array<string> | { [label: string]: number }>): Array<Array<string>> {
    if (program.length === 0) return []

    const prevInst = getInstructionOrLabel(program[0])
    const instructions: Array<Array<string>> = [prevInst]
    for (let i = 1; i < program.length; i++) {
        const currInst = getInstructionOrLabel(program[i])

        if (currInst.length === 1) {
            instructions.push([currInst[0]])
            continue
        }

        const hazards = findWAWandWAR(currInst, prevInst)
        const instruction = RegisterAliasTable.parseHazards(currInst, hazards)
        instructions.push(instruction)
    }

    return instructions
}

export function getHazardFixedInstruction(
    program: Array<Array<string> | { [label: string]: number }>,
    instruction: Array<string>
): Array<Array<string>> {
    if (program.length === 0) {
        ReservationStations.insert(instruction)
        return [instruction]
    }

    const instructions: Array<Array<string>> = program.map(obj => getInstructionOrLabel(obj))

    let inst = getInstructionOrLabel(instruction)
    const uuid = randomUUID()
    if (inst.length > 1) {
        for (let i = 0; i < instructions.length; i++) {
            const hazards = findWAWandWAR(inst, instructions[i])
            inst = RegisterAliasTable.parseHazards(inst, hazards, uuid)
        }
    }

    instructions.push(inst)
    return instructions
}

export function getInstructionOrLabel(instruction: Array<string> | { [label: string]: number }): Array<string> {
    if (instruction instanceof Array) return [...instruction]
    return Object.keys(instruction)
}

export const findWAWandWAR = (currInst: Array<string>, nextInstr: Array<string>) => {
    const regWAW = findWAW(currInst, nextInstr)
    const regWAR = findWAR(nextInstr, currInst)

    const hazards = []
    if (regWAW) hazards.push(regWAW)
    if (regWAR) hazards.push(regWAR)
    return hazards
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