export function DisplayHex() {
    // @ts-ignore
    Number.prototype.displayHex = function (factor?: number) {
        const value = factor ? factor * this.valueOf() : this
        let str = value.toString(16).toUpperCase()

        while (str.length < 8) str = "0" + str
        return "0x" + str
    }
}

export function normalizeNumber(number: string, size: number = 8) {
    while (number.length < size) number = "0" + number
    return number
}

export const normalizeBoolean = (value: Boolean) => value ? "Yes" : "No"