export default class Pair<T, R> {
    first: T
    second: R

    constructor(first: T, second: R) {
        this.first = first
        this.second = second
    }
}