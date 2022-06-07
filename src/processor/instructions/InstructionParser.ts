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
            const splitted = line.replace(/#.*$/, "")
                .replace(/\s+/g, " ")
                .trim()
                .replaceAll(", ", " ")
                .split(/\s/g)
            splitted[0] = splitted[0].toUpperCase()

            if (!(splitted[0] in InstructionSet)) throw Error("Unknown instruction " + splitted[0])

            this.program.push(splitted.join(" "))
        })

        return this.program
    }
}