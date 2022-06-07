export default interface MipsMemory {
    store(address: number, value: number): void
    load(address: number): number
}