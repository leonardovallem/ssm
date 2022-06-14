export default class Queue<T> {
    private data: Array<T> = []
    private head: number
    private tail: number
    private readonly maxSize: number
    private length: number

    constructor(maxSize: number = 10) {
        this.maxSize = maxSize
        this.head = this.tail = this.length = 0
    }

    enqueue = (value: T) => {
        this.data[++this.tail % this.maxSize] = value
        this.length++
    }

    peek = () => this.data[this.head % this.maxSize]

    dequeue = () => {
        const value = this.data[this.head++ % this.maxSize]
        this.length--
        return value
    }

    map = (transform: (it: T) => any) => this.data.map(t => transform(t))

    size = () => this.length
}