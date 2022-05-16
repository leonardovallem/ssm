export default class Register {
    name: string
    value: number

    constructor(name: string, value: number = 0) {
        this.name = name
        this.value = value
    }

    static deserialize(obj: {name: string, value: number}) {
        return new Register(obj.name, obj.value)
    }
}