import { Events, ActivityType } from "discord.js";
import Event from '../../Structures/Base/Event.js'


class Presence extends Event {

    constructor() {
        super();
        this.name = 'Presence';
        this.type = Events.ClientReady;
        this.once = true;
    }

    async run(client) {
        console.log(`Logged in as ${client.user.tag}`);

        client.user.setPresence({
            activities: [
                { name: 'Apex Legends', type: ActivityType.Playing }
            ],
            status: 'online'
        })
    }

}

export default Presence;