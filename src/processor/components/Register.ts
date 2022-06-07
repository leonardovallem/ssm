export default class Register {
    name: string
    value: number
    rs: number = 0

    constructor(name: string, value: number = 0, rs: number = 0) {
        this.name = name
        this.value = value
    }

    static deserialize(obj: {name: string, value: number, rs: number}) {
        return new Register(obj.name, obj.value, obj.rs)
    }
}