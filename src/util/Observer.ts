export interface Observer<T> {
    update: (newValue: T) => void
}

export interface Observable<T> {
    observers: Array<Observer<T>>
    addObserver: (ob: Observer<T>) => void
    notifyObservers: () => void
}