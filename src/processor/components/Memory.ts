export default class Memory {
    size: number
    table: Array<number>

    constructor(size: number) {
        this.size = size
        this.table = Array(size).fill(0)
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