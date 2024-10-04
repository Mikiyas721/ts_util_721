export abstract class Failure {
    constructor(protected message: string | undefined = undefined) {
    }

    abstract get messageLocaleKey(): string
}

export class SimpleFailure extends Failure {
    constructor(message: string) {
        super(message);
    }

    get messageLocaleKey(): string {
        return this.message as string;
    }
}
