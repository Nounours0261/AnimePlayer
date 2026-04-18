export class almostFinishedEvent extends CustomEvent {
    static name = "almostfinished";

    constructor() {
        super(almostFinishedEvent.name);
    }
}

export class playNextEvent extends CustomEvent {
    static name = "playnext";

    constructor() {
        super(playNextEvent.name);
    }
}

export class playNumberEvent extends CustomEvent {
    static name = "playnumber";

    constructor(nb) {
        super(playNumberEvent.name, {detail: nb});
    }
}