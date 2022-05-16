import {Instruction} from "./InstructionTypes"
import InstructionSet from "./InstructionSet"
import RegisterBank from "../components/RegisterBank"

export default class InstructionParser {
    program: string
    registerBank: RegisterBank

    constructor(program: string, registerBank: RegisterBank) {
        this.program = program
        this.registerBank = registerBank
    }

    parse(): Array<Instruction> {
        const instructions: Array<Instruction> = []

        this.program.split("\n").forEach(line => {
            const splitted = line.replace(/\s+/g, " ")
                .trim()
                .replaceAll(", ", " ")
                .split(/\s/g)

            if (!(splitted[0].toUpperCase() in InstructionSet)) throw Error("Unknown instruction " + splitted[0])

            // @ts-ignore
            const instructionType = InstructionSet[splitted[0].toUpperCase()]
            const inst = new instructionType()

            switch (splitted.length) {
                case 2: {
                    if (InstructionSet.isJump(inst)) {
                        inst.target = inst instanceof InstructionSet.JR
                            ? this.registerBank.getByName("$jr")
                            : Number(splitted[1])
                    } else if (InstructionSet.isMove(inst)) {
                        inst.destination = inst instanceof InstructionSet.MFHI
                            ? this.registerBank.getByName("$hi")
                            : this.registerBank.getByName("$lo")
                    } else throw Error("Couldn't execute instruction " + splitted[0])

                    instructions.push(inst)
                    break
                }
                case 3: {
                    if (InstructionSet.isLS(inst)) {
                        inst.data = this.registerBank.getByName(splitted[1])
                        const [offset, address] = splitted[2].split("(") as string[]

                        inst.offset = Number(offset)
                        inst.address = address.substring(0, address.length - 1)
                    } else if (InstructionSet.isMultDiv(inst)) {
                        inst.hi = this.registerBank.getByName("$hi")
                        inst.lo = this.registerBank.getByName("$lo")
                    } else throw Error("Couldn't execute instruction " + splitted[0])

                    instructions.push(inst)
                    break
                }
                case 4: {
                    if (InstructionSet.isBranch(inst)) {
                        inst.op1 = this.registerBank.getByName(splitted[1])
                        inst.op2 = this.registerBank.getByName(splitted[2])
                        inst.target = Number(splitted[3])
                    } else if (InstructionSet.isLA(inst)) {
                        inst.destination = this.registerBank.getByName(splitted[1])
                        inst.op1 = this.registerBank.getByName(splitted[2])

                        inst.op2 = splitted[3].indexOf("$") === 0
                            ? this.registerBank.getByName(splitted[3])
                            : Number(splitted[3])
                    } else throw Error("Couldn't execute instruction " + splitted[0])

                    instructions.push(inst)
                    break
                }
                default:
                    throw Error("Couldn't execute instruction " + splitted[0])
            }
        })

        return instructions
    }
}
