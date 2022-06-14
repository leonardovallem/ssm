import MipsMemory from "./MipsMemory"
import {MIPS_MEMORY_SIZE} from "../../util/Constants"

export default class VolatileMemory implements MipsMemory {
    size: number
    table: Array<number>

    constructor(size: number = MIPS_MEMORY_SIZE) {
        this.size = size
        this.table = Array(size).fill(0)
    }

    from(table: Array<number>) {
        this.table = table
        this.size = table.length
        return this
    }

    update(newTable: Array<number>) {
        this.table = newTable
    }

    store(address: number, value: number) {
        const index = address / 4
        if (index >= this.size) throw Error("Memory has no address " + address)

        this.table[index] = value
    }

    load(address: number): number {
        const index = address / 4
        if (index >= this.size) throw Error("Memory has no address " + address)

        return this.table[index]
    }
}