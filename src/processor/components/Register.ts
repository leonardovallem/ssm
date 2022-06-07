export default class Register {
    name: string
    value: number
    rs: number = 0

    constructor(name: string, value: number = 0, rs: number = 0) {
        this.name = name
        this.value = value
    }

    static deserialize(obj: {name: string, value: string}) {
        return new Register(obj.name, Number(obj.value))
    }
}