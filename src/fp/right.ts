export abstract class ValueObject<T = string> {
    protected constructor(public value: T) {
    }
}

export abstract class ValueObjectCollection {
    protected constructor() {
    }
}

export abstract class Entity {
    protected constructor(public id: string | undefined) {
    }
}
