import { ActivityType, Collection } from "discord.js";
import Utility from "../Utililites/Utility.js";

class Event {

    constructor(client, instance) {
        console.log('Handler Event loaded');
        this.client = client;
        this.instance = instance;
        this.on = new Collection();
        this.once = new Collection();
    }

    async load() {
        const path = Utility.root('src/Events');
        const files = await Utility.files(path);

        for (const file of files) {

            const { default: Evento } = await import(file);
            const event = new Evento();

            if (event.once) {
                if (!this.once.has(event.type))
                this.once.set(event.type, []);

                const types = this.once.get(event.type);
                types.push(event);

                continue;
            }

            if (!this.on.has(event.type))
            this.on.set(event.type, []);

            const types = this.on.get(event.type);
            types.push(event);
        }

        this.run()
    }

    run() {

        for (const name of this.once.keys()) {
            const events = this.once.get(name);
            this.client.once(name, (...args) => {
                for (const event of events) {
                    event.run(...args, this.instance);
                }
            })
        }

        for (const name of this.on.keys()) {
            const events = this.on.get(name);
            this.client.on(name, (...args) => {
                for (const event of events) {
                    event.run(...args, this.instance);
                }
            })
        }

    }

}

export default Event;