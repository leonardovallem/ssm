export function DisplayHex() {
    // @ts-ignore
    Number.prototype.displayHex = function (factor?: number) {
        const value = factor ? factor * this.valueOf() : this
        let str = value.toString(16).toUpperCase()

        while (str.length < 8) str = "0" + str
        return "0x" + str
    }
}

export const normalizeBoolean = (value: Boolean) => value ? "Yes" : "No"