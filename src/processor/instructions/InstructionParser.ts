import InstructionSet from "./InstructionSet"

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
        Array<string>
    ] {
        let notInstructions = 0

        this.input.split("\n").forEach((line, index) => {
            if (!line) {
                notInstructions++
                return
            }

            const split = InstructionParser.splitInstruction(line)
            const label = InstructionParser.getLabel(split)

            if (label) {
                this.labels[label.substring(0, label.length - 1)] = index - notInstructions++
                return
            }

            if (!(split[0] in InstructionSet)) throw Error("Unknown instruction " + split[0])
            this.program.push(split.join(" "))
        })

        return [this.labels, this.program]
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