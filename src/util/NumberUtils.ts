const BINARY_HIGH_MASK = 0xFFFFFFFF00000000
const BINARY_LOW_MASK = 0xFFFFFFFF

export const getHighAndLow = (num: number) => [(num & BINARY_HIGH_MASK) >> 32, num & BINARY_LOW_MASK]