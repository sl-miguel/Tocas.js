import Command from "../Structures/Base/Command.js";

class Ping extends Command {

    constructor() {
        super();
        this.name = "ping";
        this.description = "Responds with pong.";
        this.defer = false;
        this.cooldown = { perUserPerGuild: '1 m' };
    }

    async run({ interaction }) {
        return 'pong';
    }
}

export default Ping;