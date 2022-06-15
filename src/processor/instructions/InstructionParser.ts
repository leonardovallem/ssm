import InstructionSet, {isALU, isBranch, isStore} from "./InstructionSet"
import {RegisterAliasTable} from "../components/RegisterBank"
import {substringBetween} from "../../util/StringUtils";

export default class InstructionParser {
    private input: string = ""
    private program: Array<string> = []
    private labels: { [label: string]: number } = {}

    fromText(text: string) {
        this.input = text
        return this
    }

    parse(): [
        { [label: string]: number },
        Array<string>,
        Array<Array<string> | { [label: string]: number }>,
    ] {
        RegisterAliasTable.init()
        const instructions: Array<Array<string> | { [label: string]: number }> = []
        let notInstructions = 0

        this.input.replace(/\r\n/g, "\n").split("\n").forEach((line, index) => {
            if (!line) {
                notInstructions++
                return
            }

            const split = InstructionParser.splitInstruction(line)
            const label = InstructionParser.getLabel(split)

            if (label) {
                this.labels[label.substring(0, label.length - 1)] = index - notInstructions++

                const temp: { [label: string]: number } = {}
                temp[label] = this.labels[label.substring(0, label.length - 1)]
                instructions.push(temp)
                return
            }

            if (!(split[0] in InstructionSet)) throw Error("Unknown instruction " + split[0])

            instructions.push(split)
            this.program.push(split.join(" "))
        })

        return [this.labels, this.program, instructions]
    }

    static getLabel(instruction: Array<string>) {
        return instruction.length === 1 && instruction[0].at(instruction[0].length - 1) === ":"
            ? instruction[0]
            : null
    }

    static splitInstruction(instruction: string) {
        const split = instruction.replace(/#.*$/, "")
            .replace(/\s+/g, " ")
            .trim()
            .replaceAll(", ", " ")
            .split(/\s/g)
        split[0] = split[0].toUpperCase()

        return split
    }
}

export function getFirstReadRegister(instruction: Array<string>) {
    if (isBranch(instruction)
        || isStore(instruction)
        || ["MULT", "DIV"].includes(instruction[0])
    ) return instruction[1]
    return instruction[2]
}

export function getSecondReadRegister(instruction: Array<string>) {
    if ([
        "BEQ",
        "BNE",
        "BGT",
        "BGE",
        "BLT",
        "BLE",
        "MULT",
        "DIV",
    ].includes(instruction[0])) return instruction[2]
    if (instruction[0] === "LW") return substringBetween(instruction[0], "(", ")")
    if (isALU(instruction)) return instruction[3]

    return undefined
}
