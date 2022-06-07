import InstructionSet from "./InstructionSet"

export default class InstructionParser {
    private input: string = ""
    private program: Array<string> = []

    fromText(text: string) {
        this.input = text
        return this
    }

    parse() {
        this.input.split("\n").forEach(line => {
            if (!line) return

            const split = line.replace(/#.*$/, "")
                .replace(/\s+/g, " ")
                .trim()
                .replaceAll(", ", " ")
                .split(/\s/g)
            split[0] = split[0].toUpperCase()

            if (!(split[0] in InstructionSet)) throw Error("Unknown instruction " + split[0])

            this.program.push(split.join(" "))
        })

        return this.program
    }
}