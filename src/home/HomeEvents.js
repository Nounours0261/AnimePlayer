export class listUpdateEvent extends CustomEvent {
    static name = "listupdate";

    constructor() {
        super(listUpdateEvent.name);
    }
}