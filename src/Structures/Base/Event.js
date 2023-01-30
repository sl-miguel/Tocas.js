import { Events } from "discord.js";

class Event {

    name;
    type;
    once;

    constructor() {
        this.name = null;
        this.type = Events.InteractionCreate;
        this.once = false;
    }

}

export default Event;