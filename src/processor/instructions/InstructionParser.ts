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

    parseProgram(): Array<Instruction> {
        const instructions: Array<Instruction> = []

        this.program.split("\n").forEach(line => {
            const splitted = line.replace(/\s+/g, " ")
                .trim()
                .replaceAll(", ", " ")
                .split(/\s/g)

            if (!(splitted[0].toUpperCase() in InstructionSet)) throw Error("Unknown instruction " + splitted[0])

            switch (splitted.length) {
                case 2:
                    const inst = new InstructionSet[splitted[0]]()

                    if (InstructionSet.isJump(inst)) {
                        const target = inst instanceof InstructionSet.JR
                            ? this.registerBank.getByName("JR")
                            : Number(splitted[1])

                        inst.target = target
                    } else if (InstructionSet.isMove(inst)) {
                        const destination = inst instanceof InstructionSet.MFHI
                            ? this.registerBank.getByName("HI")
                            : this.registerBank.getByName("LO")

                        inst.destination = destination
                    } else throw Error("Couldn't execute instruction " + splitted[0])

                    instructions.push(inst)
                    break
                case 3:
            }
        })

        return instructions
    }
}
