export default class Register {
    name: string
    value: number
    rs: string = ""

    constructor(name: string, value: number = 0, rs?: string) {
        this.name = name
        this.value = value
    }

    static deserialize(obj: {name: string, value: string, rs?: string}) {
        return new Register(obj.name, Number(obj.value), obj.rs)
    }
}