import { Client, Partials, GatewayIntentBits } from "discord.js";
import mongoose from "mongoose";

import configuration from '../../../configuration.json' assert { type: 'json' };
import Slash from "../Handlers/Slash.js";
import Event from "../Handlers/Event.js";

const options = {
    intents: [ ...Object.values(GatewayIntentBits) ],
    partials: [ ...Object.values(Partials) ]
}

class Tocas extends Client {

    constructor(args = options) {
        super(args);
        this.settings = configuration;
    }

    async start() {
        console.log('Started.');
        await this.connectDB();
        await this.register();
    }

    async register() {
        const slash = new Slash(this);
        const event = new Event(this, slash);

        await event.load();
        await this.login(this.settings.BOT.TOKEN);
        await slash.load();
    }

    async connectDB() {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(this.settings.DATABASE.URI);
    }
}

export default Tocas;