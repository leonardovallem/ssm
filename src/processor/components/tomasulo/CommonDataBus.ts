import {Observable, Observer} from "../../../util/Observer"

export default class CommonDataBus implements Observable<number> {
    observers: Array<Observer<number>> = []
    private value: number = 0
    private static instance: CommonDataBus | null = null

    private constructor() {}

    static getInstance(): CommonDataBus {
        if (!this.instance) this.instance = new CommonDataBus()
        return this.instance
    }

    update(value: number) {
        this.value = value
        this.notifyObservers()
    }

    addObserver(ob: Observer<number>) {
        this.observers.push(ob)
    }

    notifyObservers() {
        this.observers.forEach(ob => ob.update(this.value))
    }
}