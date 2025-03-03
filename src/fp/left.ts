export abstract class Failure {
    constructor() {
    }
}

export class SimpleFailure extends Failure {
    constructor(readonly message: string) {
        super();
    }
}

export abstract class ValueObjectFailure extends Failure {
    constructor(readonly messageLocaleKey: string) {
        super();
    }
}

export abstract class TextFieldFailure extends ValueObjectFailure {
    protected constructor(messageLocaleKey: string, public failedValue: string) {
        super(messageLocaleKey);
    }
}

export class HttpRequestFailure extends Failure {
    constructor(
        public statusCode: number,
        public statusMessage: string,
        public errorMessage: string,
        public extra?: any
    ) {
        super()
    }

    toString() {
        let failureString = `HttpRequestError: ${this.statusCode} ${this.statusMessage}\nMessage: ${this.errorMessage}`;
        if (this.extra) failureString += `\nextra: ${this.extra}`
        return failureString
    }
}
