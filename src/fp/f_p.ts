export class Either<L, R> {
    private constructor(
        private readonly leftValue?: L,
        private readonly rightValue?: R/*,
        private readonly defaultHandlers?: {
            left?: (l: L, extras?: { [key: string]: any }) => any,
            right?: (r: R, extras?: { [key: string]: any }) => any
        }*/
    ) {
        if (
            (leftValue === undefined && rightValue === undefined) ||
            (leftValue !== undefined && rightValue !== undefined)
        ) {
            throw new Error("Either must be constructed with a left value or a right value, but not both.");
        }
    }

    static left<L = any, R = any>(
        l: NonNullable<L>/*,
        defaultLeftHandler?: (l: L, extras?: { [key: string]: any }) => any*/
    ): Either<L, R> {
        return new Either<L, R>(l, undefined/*, {left: defaultLeftHandler}*/);
    }

    static right<L = any, R = any>(
        r: NonNullable<R>/*,
        defaultRightHandler?: (r: R, extras?: { [key: string]: any }) => any*/
    ): Either<L, R> {
        return new Either<L, R>(undefined, r/*, {right: defaultRightHandler}*/);
    }

    fold<A, B>(ifLeft: (l: L) => A, ifRight: (r: R) => B): A | B {
        if (this.isLeft) {
            return ifLeft(this.leftValue!);
        } else {
            return ifRight(this.rightValue!);
        }
    }

    /*foldLeft<A>(
        ifLeft: (l: L) => A,
        extras?: { [key: string]: any }
    ): A {
        if (this.isLeft) {
            return ifLeft(this.leftValue!);
        } else {
            if (this.defaultHandlers?.right) {
                return this.defaultHandlers.right(this.rightValue!, extras);
            } else {
                throw new Error("Unable to foldLeft since default right handler is missing.");
            }
        }
    }

    foldRight<B>(
        ifRight: (r: R) => B,
        extras?: { [key: string]: any }
    ): B {
        if (this.isRight) {
            return ifRight(this.rightValue!);
        } else {
            if (this.defaultHandlers?.left) {
                return this.defaultHandlers.left(this.leftValue!, extras);
            } else {
                throw new Error("Unable to foldRight since default left handler is missing.");
            }
        }
    }*/

    getOrElse<B>(ifLeft: (l: L) => B): B | R {
        if (this.isLeft)
            return ifLeft(this.value as L)
        else
            return this.value as R
    }

    /**
     * ifRight has to be provided unless certain that the value is Left
     * if ifRight is not provided and value is Right, an error will be thrown*/
    getLeft(ifRight?: (r: R) => any): L {
        if (this.isRight) {
            if (ifRight == undefined) throw new Error("Function ifRight is missing and the value is right")
            return ifRight(this.value as R)
        } else
            return this.value as L
    }

    /**
     * ifLeft has to be provided unless certain that the value is Right
     * if ifLeft is not provided and value is Left, an error will be thrown*/
    getRight(ifLeft?: (l: L) => any): R {
        if (this.isLeft) {
            if (ifLeft == undefined) throw new Error("Function ifLeft is missing and the value is left")
            return ifLeft(this.value as L)
        } else
            return this.value as R
    }

    get value(): L | R {
        return this.leftValue ?? this.rightValue!
    }

    get isLeft(): boolean {
        return this.leftValue !== undefined
    }

    get isRight(): boolean {
        return this.rightValue !== undefined
    }
}

export class Option<S> {
    constructor(private value: undefined | S) {
    }

    static none<S>(): Option<S> {
        return new Option<S>(undefined)
    }

    static some<S>(s: NonNullable<S>): Option<S> {
        return new Option<S>(s)
    }

    fold<A, B>(ifNone: () => A, ifSome: (s: S) => B): A | B {
        if (this.value == undefined)
            return ifNone()
        else
            return ifSome(this.value as S)
    }

    getOrElse<B>(ifNone: () => B): S | B {
        if (this.value == undefined)
            return ifNone()
        else
            return this.value as S
    }

    /**
     * ifLeft has to be provided unless certain that the value is Right
     * if ifLeft is not provided and value is Left, an error will be thrown*/
    getSome(ifNone?: () => any): S {
        if (this.value == undefined) {
            if (ifNone == undefined) throw new Error("Function ifLeft is missing and the value is left")
            return ifNone()
        } else
            return this.value as S
    }

    get isNone(): boolean {
        return this.value == undefined
    }

    get isSome(): boolean {
        return this.value != undefined
    }
}
