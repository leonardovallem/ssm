export default class Queue<T> {
    data: Array<T>
    private head: number
    private tail: number
    private readonly maxSize: number
    private length: number

    constructor(maxSize: number = 100) {
        this.data = Array(maxSize)
        this.maxSize = maxSize
        this.head = this.tail = this.length = 0
    }

    enqueue = (value: T) => {
        const index = this.tail++ % this.maxSize
        const updated = this.data.slice()
        updated[index] = value
        this.data = updated
        this.length++
        return index
    }

    peek = () => this.data[this.head % this.maxSize]

    dequeue = () => {
        const value = this.data[this.head++ % this.maxSize]
        this.length--
        return value
    }

    map = (transform: (it: T) => any) => {
        const data: Array<any> = []
        for (let i=this.head ; i < this.tail ; i++) data[i] = transform(this.data[i])
        return data
    }

    size = () => this.length
}