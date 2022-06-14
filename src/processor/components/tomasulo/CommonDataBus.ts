import {Observable, Observer} from "../../../util/Observer"
import FunctionalUnit from "./FunctionalUnit"

export class CommonDataBus implements Observable<FunctionalUnit, number> {
    observers: Array<Observer<FunctionalUnit, number>> = []
    private source: FunctionalUnit = FunctionalUnit.NULL
    private data: number = 0

    update(source: FunctionalUnit, data: number) {
        this.source = source
        this.data = data
        this.notifyObservers()
    }

    addObserver(ob: Observer<FunctionalUnit, number>) {
        this.observers.push(ob)
    }

    notifyObservers() {
        this.observers.forEach(ob => ob.update(this.source, this.data))
    }
}

export default new CommonDataBus()