export class InvalidStructError extends Error {
    constructor() {
        super('La struttura della form non è valida');
    }
}


export class InvalidSchemaRetrieveError extends Error {
    constructor(error: string) {
        super(error);
    }
}

export class InvalidParamsError extends Error {
    constructor(error: string) {
        super(error);
    }
}
