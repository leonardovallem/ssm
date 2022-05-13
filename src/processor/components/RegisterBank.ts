import Register from "./Register"
import Pair from "../../util/Pair"

export default class RegisterBank {

    private registerNames: Array<Pair<string, number>>
    private readonly registers: Array<Register>
    private especialRegisters: Array<Register>

    constructor() {
        this.especialRegisters = [new Register("$hi"), new Register("$lo")]

        this.registers = [
            new Register("$zero"),
            new Register("at"),
            new Register("$v0"),
            new Register("$v1"),
        ]

        for (let i = 0; i < 4; i++) this.registers.push(new Register("$a" + i))
        for (let i = 0; i < 8; i++) this.registers.push(new Register("$t" + i))
        for (let i = 0; i < 8; i++) this.registers.push(new Register("$s" + i))
        for (let i = 8; i < 10; i++) this.registers.push(new Register("$t" + i))
        for (let i = 0; i < 2; i++) this.registers.push(new Register("$k" + i))

        this.registers.push(
            new Register("$gp"),
            new Register("$sp"),
            new Register("$fp"),
            new Register("$ra"),
        )

        this.registerNames = this.registers.map((reg, index) => {
            return new Pair(reg.name.substring(1).toUpperCase(), index)
        })
    }

    getByName(name: string) {
        const formatted = name.toUpperCase()
        if (formatted === "HI") return this.especialRegisters[0]
        if (formatted === "LO") return this.especialRegisters[0]

        const instruction = this.registerNames.find(pair => pair.first.toUpperCase() === formatted)
        if (!instruction) throw Error("Unknown register " + name)

        return this.registers[instruction.second]
    }
}
