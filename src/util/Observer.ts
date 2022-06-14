export interface Observer<T, R> {
    update: (a: T, b: R) => void
}

export interface Observable<T, R> {
    observers: Array<Observer<T, R>>
    addObserver: (ob: Observer<T, R>) => void
    notifyObservers: () => void
}