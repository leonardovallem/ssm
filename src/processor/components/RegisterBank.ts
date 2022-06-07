import Register from "./Register"

export default class RegisterBank {
    registers: Array<Register>
    private byName: { [name: string]: number } = {}

    constructor(values: Array<{name: string, value: string}> | null = null) {
        if (values) {
            this.registers = values.map((obj) => Register.deserialize(obj))
            return
        }

        this.registers = [
            new Register("$zero"),
            new Register("$at"),
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
            new Register("$hi"),
            new Register("$lo")
        )

        this.registers.forEach((reg, index) => {
            this.byName[reg.name] = index
        })
    }

    update(updated: Array<{name: string, value: number}>) {
        this.registers = updated.map(obj => new Register(obj.name, obj.value))
    }

    getByName(name: string) {
        if (!(name in this.byName)) throw Error("Unknown register " + name)
        return this.registers[this.byName[name]]
    }

    serialize = () => this.registers.map(reg => ({name: reg.name, value: reg.value}))
}
