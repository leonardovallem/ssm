export default class Queue<T> {
    data: Array<T> = []

    add = (value: T) => this.data.push(value)

    peek = () => this.data[this.data.length - 1]

    pop = () => this.data.pop()

    map = (transform: (it: T) => any) => this.data.map(t => transform(t))
}