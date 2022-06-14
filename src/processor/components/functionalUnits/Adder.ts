import {Observer} from "../../../util/Observer"

export class Adder implements Observer<string, number> {
    knownValue?: number
    unknownValue?: number

    sum(knownValue: number) {
        this.knownValue = knownValue
    }

    update(source: string, value: number): void {
        this.unknownValue = value
    }

    yieldResult(): number {
        if (!this.knownValue || !this.unknownValue) throw Error("Can't add: A value is still unknown")
        return this.knownValue + this.unknownValue
    }
}

const adder = new Adder()

export default adder