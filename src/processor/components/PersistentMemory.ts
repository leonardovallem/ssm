import MipsMemory from "./MipsMemory"
import db from "../../data/db"

export default class PersistentMemory implements MipsMemory {
    // @ts-ignore
    async load(address: number): number {
        const result = await db.memory
            .where("address")
            .equals(address)
            .toArray()
        if (result.length === 0) throw Error(`Couldn't retrieve memory address ${address}`)
        return result[0].value
    }

    async store(address: number, value: number) {
        await db.memory
            .where("address")
            .equals(address)
            .modify(row => row.value = value)
    }
}