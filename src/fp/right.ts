import {Either, Option} from "./f_p";
import {Failure} from "./left";

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

/**
 * Parent class for Data transfer objects
 * Has toJson and toDomain defined here
 * fromJson and fromDomain are defined in the child class because those are static functions
 * */
export abstract class Dto<E extends Entity | ValueObjectCollection> {
    toJson(): object {
        return JSON.parse(JSON.stringify(this));
    }

    abstract toDomain(): Either<Failure, E> | Option<E> | E
}

/**
 * Parent class for Data transfer objects with an id
 * This is the infrastructure layer equivalent of the Entity class of the Domain layer
 * */
export abstract class IdDto<E extends Entity> extends Dto<E> {
    protected constructor(public id: string | undefined) {
        super();
    }
}

export class ValuelessSuccess {
    constructor() {
    }
}
