import Dexie, {Table} from "dexie"

export interface Memory {
    id?: number
    address: number
    value: number
}

export class MemoryDB extends Dexie {
    memory!: Table<Memory>

    constructor() {
        super("mips")
        this.version(1).stores({
            memory: "++id, address, value"
        })
    }
}

const db = new MemoryDB()

export default db
