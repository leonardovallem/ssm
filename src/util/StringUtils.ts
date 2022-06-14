export function configureStringUtils() {
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

export const substringBetween = (str: string, a: string, b: string) => str.slice(
    str.indexOf(a) + 1,
    str.lastIndexOf(b)
)

export const normalizeBoolean = (value: Boolean) => value ? "Yes" : "No"

export const randomUUID = () => (1e7 + -1e3 + -4e3 + -8e3 + -1e11).toString().replace(/[018]/g, r => {
        const c = Number(r)
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    }
)
